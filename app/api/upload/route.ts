import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maxImages = 10;
const maxSizeBytes = 10 * 1024 * 1024;
const uploadDir = path.join(process.cwd(), "public", "uploads", "leads");

function safeBaseName(name: string) {
  return name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images").filter((value): value is File => value instanceof File);

    if (files.length > maxImages) {
      return NextResponse.json(
        { ok: false, message: `Upload up to ${maxImages} images only` },
        { status: 400 },
      );
    }

    await mkdir(uploadDir, { recursive: true });

    const uploaded = [];

    for (const file of files) {
      if (!allowedTypes.has(file.type)) {
        return NextResponse.json(
          { ok: false, message: "Only jpg, jpeg, png, and webp images are allowed" },
          { status: 400 },
        );
      }

      if (file.size > maxSizeBytes) {
        return NextResponse.json(
          { ok: false, message: "Each image must be 10MB or smaller" },
          { status: 400 },
        );
      }

      const extension = allowedTypes.get(file.type)!;
      const baseName = safeBaseName(file.name) || "reference";
      const filename = `${Date.now()}-${crypto.randomUUID()}-${baseName}.${extension}`;
      const filePath = path.join(uploadDir, filename);
      const bytes = Buffer.from(await file.arrayBuffer());

      // TODO: Replace local upload with Google Drive / Cloudinary / Supabase Storage for Vercel.
      await writeFile(filePath, bytes);

      uploaded.push({
        originalName: file.name,
        url: `/uploads/leads/${filename}`,
      });
    }

    return NextResponse.json({
      ok: true,
      uploaded,
      urls: uploaded.map((file) => file.url),
    });
  } catch (error) {
    console.error("Upload API error", error);

    return NextResponse.json(
      { ok: false, message: "Could not upload images" },
      { status: 500 },
    );
  }
}
