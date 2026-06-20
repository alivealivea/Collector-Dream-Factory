import { NextResponse } from "next/server";
import { appendLeadToSheet, type LeadRow } from "@/src/lib/googleSheets";

export const runtime = "nodejs";

type LeadRequest = Partial<
  Omit<LeadRow, "createdAt" | "uploadedImageUrls"> & {
    uploadedImageUrls: unknown;
  }
>;

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function imageUrls(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequest;
    const lead: LeadRow = {
      createdAt: new Date().toISOString(),
      name: stringValue(body.name),
      phone: stringValue(body.phone),
      lineId: stringValue(body.lineId),
      facebook: stringValue(body.facebook),
      instagram: stringValue(body.instagram),
      preferredContact: stringValue(body.preferredContact),
      projectType: stringValue(body.projectType),
      selectedSize: stringValue(body.selectedSize),
      budget: stringValue(body.budget),
      finishType: stringValue(body.finishType),
      description: stringValue(body.description),
      uploadedImageUrls: imageUrls(body.uploadedImageUrls),
      pageSource: stringValue(body.pageSource) || "dream-project",
    };

    const result = await appendLeadToSheet(lead);

    return NextResponse.json({
      ok: true,
      mode: result.mode,
      message: "Lead saved",
    });
  } catch (error) {
    console.error("Lead API error", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Could not save lead",
      },
      { status: 500 },
    );
  }
}
