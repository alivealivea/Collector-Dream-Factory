export type LeadRow = {
  createdAt: string;
  name: string;
  phone: string;
  lineId: string;
  facebook: string;
  instagram: string;
  preferredContact: string;
  projectType: string;
  selectedSize: string;
  budget: string;
  finishType: string;
  description: string;
  uploadedImageUrls: string[];
  pageSource: string;
};

type AppendResult = {
  mode: "google-sheet" | "mock";
};

const sheetRange = "Leads!A:N";
const tokenUrl = "https://oauth2.googleapis.com/token";
const sheetsScope = "https://www.googleapis.com/auth/spreadsheets";

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function getPrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function hasGoogleSheetEnv() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID,
  );
}

async function createAccessToken() {
  const { createSign } = await import("node:crypto");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: sheetsScope,
    aud: tokenUrl,
    exp: now + 3600,
    iat: now,
  };

  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`;
  const signature = createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(getPrivateKey()!);
  const jwt = `${unsignedToken}.${base64Url(signature)}`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google token response did not include access_token");
  }

  return data.access_token;
}

export async function appendLeadToSheet(lead: LeadRow): Promise<AppendResult> {
  if (!hasGoogleSheetEnv()) {
    console.log("Dream Build lead mock", lead);
    return { mode: "mock" };
  }

  const accessToken = await createAccessToken();
  const sheetId = process.env.GOOGLE_SHEET_ID!;
  const appendUrl = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      sheetRange,
    )}:append`,
  );
  appendUrl.searchParams.set("valueInputOption", "USER_ENTERED");
  appendUrl.searchParams.set("insertDataOption", "INSERT_ROWS");

  const row = [
    lead.createdAt,
    lead.name,
    lead.phone,
    lead.lineId,
    lead.facebook,
    lead.instagram,
    lead.preferredContact,
    lead.projectType,
    lead.selectedSize,
    lead.budget,
    lead.finishType,
    lead.description,
    lead.uploadedImageUrls.join(", "),
    lead.pageSource,
  ];

  const response = await fetch(appendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${detail}`);
  }

  return { mode: "google-sheet" };
}
