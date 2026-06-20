export type SizeKey = "30" | "60" | "100" | "170";

export const pricing = {
  "30": { label: "30 cm", price: "฿3,900+", numericPrice: 3900, height: 15, width: 16 },
  "60": { label: "60 cm", price: "฿6,900+", numericPrice: 6900, height: 30, width: 22 },
  "100": { label: "100 cm", price: "฿12,000+", numericPrice: 12000, height: 50, width: 30 },
  "170": { label: "170 cm", price: "฿18,900+", numericPrice: 18900, height: 84, width: 38 },
} as const satisfies Record<
  SizeKey,
  { label: string; price: string; numericPrice: number; height: number; width: number }
>;

export const defaultSize: SizeKey = "100";
export const sizeOptions = pricing;
