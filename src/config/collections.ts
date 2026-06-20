import { pieces } from "@/src/data/pieces";
import { pricing, type SizeKey } from "@/src/config/pricing";

export type CollectionSlug = (typeof pieces)[number]["slug"];
export type { SizeKey };

const galleryLabels = [
  "Before painting",
  "Printing process",
  "Finished work",
  "Customer photo",
  "Display in room",
] as const;

export const sizeOptions = pricing;

export const collections = pieces.map((piece) => ({
  slug: piece.slug,
  category: piece.category,
  badge: piece.badges[0] ?? piece.category,
  badges: piece.badges,
  images: piece.galleryImages,
  gallery: piece.galleryImages.slice(0, 5).map((image, index) => ({
    label: galleryLabels[index] ?? "Gallery",
    image,
  })),
  th: {
    title: piece.titleTh,
    subtitle: piece.subtitleTh,
    description: piece.descriptionTh,
  },
  en: {
    title: piece.titleEn,
    subtitle: piece.subtitleEn,
    description: piece.descriptionEn,
  },
  piece,
}));

export const materialDetails = [
  "PLA+",
  "PETG",
  "Resin",
  "Hand finishing",
  "Primer",
  "Painting",
  "Assembly",
] as const;
