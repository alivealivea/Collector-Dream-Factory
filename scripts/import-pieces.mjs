import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "content", "pieces.sample.csv");
const outputPath = path.join(root, "src", "data", "pieces.generated.json");
const requiredColumns = [
  "slug",
  "titleTh",
  "titleEn",
  "category",
  "startingPrice",
  "sizeOptions",
  "heroImage",
  "galleryImages",
  "descriptionTh",
  "descriptionEn",
  "availableForBuild",
];
const allowedSizes = new Set(["30", "60", "100", "170"]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      cell = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function toBoolean(value) {
  return ["true", "yes", "1", "y"].includes(value.trim().toLowerCase());
}

function splitList(value) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

const csv = await readFile(sourcePath, "utf8");
const rows = parseCsv(csv);
const [headers, ...dataRows] = rows;
const errors = [];

if (!headers?.length) {
  errors.push("CSV is empty.");
} else {
  for (const column of requiredColumns) {
    if (!headers.includes(column)) {
      errors.push(`Missing required column: ${column}`);
    }
  }
}

const records = [];
const seenSlugs = new Set();

dataRows.forEach((row, rowIndex) => {
  const lineNumber = rowIndex + 2;
  const record = Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() ?? ""]));

  for (const column of requiredColumns) {
    if (!record[column]) {
      errors.push(`Row ${lineNumber}: missing ${column}`);
    }
  }

  if (record.slug && !validateSlug(record.slug)) {
    errors.push(`Row ${lineNumber}: slug must use lowercase letters, numbers, and hyphens only`);
  }

  if (seenSlugs.has(record.slug)) {
    errors.push(`Row ${lineNumber}: duplicate slug "${record.slug}"`);
  }
  seenSlugs.add(record.slug);

  const sizeOptions = splitList(record.sizeOptions);
  for (const size of sizeOptions) {
    if (!allowedSizes.has(size)) {
      errors.push(`Row ${lineNumber}: invalid size "${size}". Use 30, 60, 100, or 170`);
    }
  }

  records.push({
    slug: record.slug,
    titleTh: record.titleTh,
    titleEn: record.titleEn,
    category: record.category,
    startingPrice: record.startingPrice,
    sizeOptions,
    heroImage: record.heroImage,
    galleryImages: splitList(record.galleryImages),
    descriptionTh: record.descriptionTh,
    descriptionEn: record.descriptionEn,
    availableForBuild: toBoolean(record.availableForBuild),
  });
});

if (errors.length) {
  console.error("Piece import failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "content/pieces.sample.csv",
      pieces: records,
    },
    null,
    2,
  )}\n`,
);

console.log(`Imported ${records.length} pieces into ${path.relative(root, outputPath)}`);
