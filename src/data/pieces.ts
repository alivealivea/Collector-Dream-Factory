import { pricing, type SizeKey } from "@/src/config/pricing";
import generatedPieces from "@/src/data/pieces.generated.json";

export type Piece = {
  id: string;
  slug: string;
  titleTh: string;
  titleEn: string;
  subtitleTh: string;
  subtitleEn: string;
  category: string;
  badges: string[];
  heroImage: string;
  galleryImages: string[];
  storySlug?: string;
  sizes: SizeKey[];
  prices: Record<SizeKey, string>;
  startingPrice: string;
  descriptionTh: string;
  descriptionEn: string;
  loreTh: string;
  loreEn: string;
  seoTitleTh: string;
  seoTitleEn: string;
  seoDescriptionTh: string;
  seoDescriptionEn: string;
  availableForBuild: boolean;
  availableForSTL: boolean;
};

const allSizes = Object.keys(pricing) as SizeKey[];
const allPrices = Object.fromEntries(allSizes.map((size) => [size, pricing[size].price])) as Record<SizeKey, string>;

const fallbackPieces: readonly Piece[] = [
  {
    id: "android-18",
    slug: "android-18",
    titleTh: "Android 18",
    titleEn: "Android 18",
    subtitleTh: "Life-size Hero Piece",
    subtitleEn: "Life-size Hero Piece",
    category: "Life-size",
    badges: ["Hero Piece", "Life-size"],
    heroImage: "/images/android-18.png",
    galleryImages: ["/images/android-18.png", "/images/portfolio/portfolio-08.jpg", "/images/hero-lifesize-android.jpg", "/images/room-preview.png"],
    storySlug: "android-18-life-size-project",
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["170"].price,
    descriptionTh: "งานสะสมขนาดใหญ่ที่ถูกสร้างขึ้นเพื่อให้กลายเป็นจุดเด่นของห้องสะสมอย่างแท้จริง",
    descriptionEn: "A large collectible made to become the main statement piece in a collector room.",
    loreTh: "ตัวละครขนาดใหญ่ที่ยืนเป็นจุดเด่นของห้องสะสมได้ทันที",
    loreEn: "A large character piece designed to become the room's focal point.",
    seoTitleTh: "Android 18 Life-size Hero Piece | Collector Dream Factory",
    seoTitleEn: "Android 18 Life-size Hero Piece | Collector Dream Factory",
    seoDescriptionTh: "ตัวอย่างงานรับทำฟิกเกอร์และรับทำ life-size สำหรับนักสะสมที่อยากมีของสะสมขนาดใหญ่ในห้องจริง",
    seoDescriptionEn: "A life-size custom collectible example for collectors looking for a large display piece in Thailand.",
    availableForBuild: true,
    availableForSTL: false,
  },
  {
    id: "goku",
    slug: "goku",
    titleTh: "Goku",
    titleEn: "Goku",
    subtitleTh: "Young Warrior",
    subtitleEn: "Young Warrior",
    category: "Gallery Piece",
    badges: ["Hero Piece", "Gallery Piece"],
    heroImage: "/images/goku.png",
    galleryImages: ["/images/goku.png", "/images/portfolio/portfolio-27.jpg", "/images/portfolio/portfolio-28.jpg", "/images/room-preview.png"],
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["100"].price,
    descriptionTh: "ชิ้นงานขนาดตั้งโชว์ที่เก็บความรู้สึกของตัวละครวัยเด็กไว้แบบเรียบง่ายและชัดเจน",
    descriptionEn: "A display piece that keeps the energy of a childhood character clear and simple.",
    loreTh: "ตัวละครที่โตมากับความทรงจำ พร้อมกลายเป็นจุดเด่นของห้องสะสม",
    loreEn: "A childhood legend designed to become the focal point of a collector room.",
    seoTitleTh: "Goku ฟิกเกอร์สั่งทำ | Collector Dream Factory",
    seoTitleEn: "Goku Custom Figure | Collector Dream Factory",
    seoDescriptionTh: "ตัวอย่างรับทำฟิกเกอร์ตัวละครและรับทำโมเดลจากรูปสำหรับนักสะสมในประเทศไทย",
    seoDescriptionEn: "Custom character figure example for collectors in Thailand.",
    availableForBuild: true,
    availableForSTL: true,
  },
  {
    id: "akaza",
    slug: "akaza",
    titleTh: "Akaza",
    titleEn: "Akaza",
    subtitleTh: "Prototype Hero Piece",
    subtitleEn: "Prototype Hero Piece",
    category: "Prototype",
    badges: ["Gallery Piece", "Prototype"],
    heroImage: "/images/akaza.png",
    galleryImages: ["/images/akaza.png", "/images/story-akaza-process.jpg", "/images/portfolio/portfolio-17.jpg", "/images/height-comparison.png"],
    storySlug: "akaza-hero-piece",
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["170"].price,
    descriptionTh: "งานต้นแบบขนาดใหญ่ที่เน้นท่าทาง กล้ามเนื้อ และสเกลของตัวละครให้เห็นชัด",
    descriptionEn: "A large prototype focused on pose, muscle form, and readable character scale.",
    loreTh: "งานปั้นตัวละครขนาดใหญ่ โชว์ฟอร์มและรายละเอียดชัดตั้งแต่แรกเห็น",
    loreEn: "A bold sculptural character piece with presence and detail.",
    seoTitleTh: "Akaza Prototype Hero Piece | Collector Dream Factory",
    seoTitleEn: "Akaza Prototype Hero Piece | Collector Dream Factory",
    seoDescriptionTh: "ตัวอย่างของสะสมขนาดใหญ่ รับทำโมเดลตัวละครและรับทำตัวละครขนาดจริง",
    seoDescriptionEn: "Large character statue and prototype collectible example in Thailand.",
    availableForBuild: true,
    availableForSTL: false,
  },
  {
    id: "watermelon",
    slug: "watermelon",
    titleTh: "Watermelon",
    titleEn: "Watermelon",
    subtitleTh: "Custom Character Piece",
    subtitleEn: "Custom Character Piece",
    category: "Gallery Piece",
    badges: ["Scale Preview", "Gallery Piece"],
    heroImage: "/images/watermelon.png",
    galleryImages: ["/images/watermelon.png", "/images/story-watermelon-scale.jpg", "/images/portfolio/portfolio-25.jpg", "/images/room-preview.png"],
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["30"].price,
    descriptionTh: "งานคาแรกเตอร์สดใสที่เหมาะกับโต๊ะ ชั้นวาง หรือมุมสะสมขนาดเล็ก",
    descriptionEn: "A bright character piece for a desk, shelf, or small collector corner.",
    loreTh: "ภาพเทียบสเกลกับคนจริง เพื่อให้เห็นว่าชิ้นงานวางในบ้านแล้วใหญ่แค่ไหน",
    loreEn: "A real human scale check showing how large the piece feels in a home.",
    seoTitleTh: "Watermelon Custom Character Piece | Collector Dream Factory",
    seoTitleEn: "Watermelon Custom Character Piece | Collector Dream Factory",
    seoDescriptionTh: "รับทำฟิกเกอร์คาแรกเตอร์และของสะสมสั่งทำขนาดเริ่มต้นสำหรับนักสะสม",
    seoDescriptionEn: "Custom character collectible example with accessible starting sizes.",
    availableForBuild: true,
    availableForSTL: true,
  },
  {
    id: "r2d2",
    slug: "r2d2",
    titleTh: "R2-D2",
    titleEn: "R2-D2",
    subtitleTh: "Life-size Collection",
    subtitleEn: "Life-size Collection",
    category: "Life-size",
    badges: ["Hero Piece", "Life-size"],
    heroImage: "/images/r2d2.png",
    galleryImages: ["/images/r2d2.png", "/images/story-r2d2-scale.jpg", "/images/portfolio/portfolio-23.jpg", "/images/room-preview.png"],
    storySlug: "r2d2-collection",
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["170"].price,
    descriptionTh: "งานหุ่นยนต์ขนาดใหญ่ที่ต้องอ่านสเกลได้ทันทีเมื่อวางอยู่ใกล้คนจริง",
    descriptionEn: "A large robot piece designed so the scale is clear beside a real person.",
    loreTh: "งานหุ่นยนต์ขนาดใหญ่ที่ใช้คนยืนเทียบ เพื่ออ่านสเกลได้ทันที",
    loreEn: "A large robot build shown beside a real person for immediate scale.",
    seoTitleTh: "R2-D2 Life-size Collection | Collector Dream Factory",
    seoTitleEn: "R2-D2 Life-size Collection | Collector Dream Factory",
    seoDescriptionTh: "รับทำ life-size และของสะสมขนาดใหญ่สำหรับนักสะสมในประเทศไทย",
    seoDescriptionEn: "Life-size collectible and large display piece example in Thailand.",
    availableForBuild: true,
    availableForSTL: false,
  },
  {
    id: "stitch",
    slug: "stitch",
    titleTh: "Stitch",
    titleEn: "Stitch",
    subtitleTh: "Playful Display Piece",
    subtitleEn: "Playful Display Piece",
    category: "Gallery Piece",
    badges: ["Gallery Piece"],
    heroImage: "/images/stitch.png",
    galleryImages: ["/images/stitch.png", "/images/story-stitch-showcase.jpg", "/images/portfolio/portfolio-24.jpg", "/images/room-preview.png"],
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["60"].price,
    descriptionTh: "ชิ้นงานที่ทำให้มุมสะสมดูสนุกขึ้น โดยยังคงรายละเอียดของตัวละครไว้ครบ",
    descriptionEn: "A playful piece that keeps the character detail while making the display corner feel alive.",
    loreTh: "คาแรกเตอร์ playful สำหรับมุมสะสมที่อยากให้สนุกขึ้น",
    loreEn: "A playful character for collector corners that need more energy.",
    seoTitleTh: "Stitch Gallery Piece | Collector Dream Factory",
    seoTitleEn: "Stitch Gallery Piece | Collector Dream Factory",
    seoDescriptionTh: "รับทำโมเดลและฟิกเกอร์สั่งทำสำหรับมุมสะสมส่วนตัว",
    seoDescriptionEn: "Custom display figure example for personal collector corners.",
    availableForBuild: true,
    availableForSTL: true,
  },
  {
    id: "c3po",
    slug: "c3po",
    titleTh: "C-3PO",
    titleEn: "C-3PO",
    subtitleTh: "Gold Display Piece",
    subtitleEn: "Gold Display Piece",
    category: "Gallery Piece",
    badges: ["Prototype"],
    heroImage: "/images/c3po.png",
    galleryImages: ["/images/c3po.png", "/images/room-preview.png", "/images/portfolio/portfolio-09.jpg"],
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["100"].price,
    descriptionTh: "โทนทองที่เข้ากับห้องสว่างและเฟอร์นิเจอร์ไม้ เหมาะกับงานตั้งโชว์แบบพรีเมียม",
    descriptionEn: "A gold-toned display piece that works well with warm rooms and wooden furniture.",
    loreTh: "โทนทองพรีเมียมที่เข้ากับห้องสว่างและเฟอร์นิเจอร์ไม้",
    loreEn: "A warm gold display piece for bright interiors and wooden furniture.",
    seoTitleTh: "C-3PO Gold Display Piece | Collector Dream Factory",
    seoTitleEn: "C-3PO Gold Display Piece | Collector Dream Factory",
    seoDescriptionTh: "ตัวอย่างของสะสมสั่งทำและงานตั้งโชว์สำหรับห้องสะสม",
    seoDescriptionEn: "Custom gold display collectible example for collector rooms.",
    availableForBuild: true,
    availableForSTL: true,
  },
  {
    id: "bearbrick",
    slug: "bearbrick",
    titleTh: "Bearbrick",
    titleEn: "Bearbrick",
    subtitleTh: "Modern Display Piece",
    subtitleEn: "Modern Display Piece",
    category: "Gallery Piece",
    badges: ["Gallery Piece"],
    heroImage: "/images/bearbrick.png",
    galleryImages: ["/images/bearbrick.png", "/images/room-preview.png", "/images/portfolio/portfolio-09.jpg"],
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["100"].price,
    descriptionTh: "ชิ้นงานสีดำเรียบที่เข้ากับห้องโมเดิร์นและมุมสะสมแบบมินิมอล",
    descriptionEn: "A clean black display piece for modern rooms and minimal collector corners.",
    loreTh: "ชิ้น display สีดำที่เข้ากับห้องโมเดิร์น",
    loreEn: "A clean black display piece for modern interiors.",
    seoTitleTh: "Bearbrick Modern Display Piece | Collector Dream Factory",
    seoTitleEn: "Bearbrick Modern Display Piece | Collector Dream Factory",
    seoDescriptionTh: "รับทำฟิกเกอร์และของสะสมสั่งทำสำหรับห้องโมเดิร์น",
    seoDescriptionEn: "Custom collectible display piece for modern interiors.",
    availableForBuild: true,
    availableForSTL: true,
  },
  {
    id: "lover",
    slug: "lover",
    titleTh: "Lovers",
    titleEn: "Lovers",
    subtitleTh: "Custom Couple Collectible",
    subtitleEn: "Custom Couple Collectible",
    category: "Custom",
    badges: ["Gallery Piece", "Memory Piece"],
    heroImage: "/images/lover.png",
    galleryImages: ["/images/lover.png", "/images/portfolio/portfolio-01.jpg", "/images/memory-twins.jpg", "/images/portfolio/portfolio-13.png"],
    storySlug: "custom-couple-collectible",
    sizes: allSizes,
    prices: allPrices,
    startingPrice: pricing["60"].price,
    descriptionTh: "งานคู่ที่เก็บท่าทาง เสื้อผ้า และความทรงจำให้กลายเป็นของสะสมเฉพาะตัว",
    descriptionEn: "A custom couple collectible that keeps posture, clothing, and memory in one piece.",
    loreTh: "ความทรงจำที่กลายเป็นฟิกเกอร์ยืนโชว์ได้จริง",
    loreEn: "A real display figure made from a personal memory.",
    seoTitleTh: "Custom Couple Collectible | Collector Dream Factory",
    seoTitleEn: "Custom Couple Collectible | Collector Dream Factory",
    seoDescriptionTh: "รับทำโมเดลจากรูป รับทำฟิกเกอร์คนจริง และของสะสมจากความทรงจำ",
    seoDescriptionEn: "Custom couple and memory figure made from reference photos.",
    availableForBuild: true,
    availableForSTL: false,
  },
];

type GeneratedPiece = (typeof generatedPieces.pieces)[number];

function normalizeSizes(sizeOptions: readonly string[]) {
  const sizes = sizeOptions.filter((size): size is SizeKey => size in pricing);
  return sizes.length ? sizes : allSizes;
}

function buildPiece(row: GeneratedPiece): Piece {
  const fallback = fallbackPieces.find((piece) => piece.slug === row.slug);
  const sizes = normalizeSizes(row.sizeOptions);
  const prices = Object.fromEntries(sizes.map((size) => [size, pricing[size].price])) as Record<SizeKey, string>;
  const subtitle = fallback?.subtitleTh ?? row.category;

  return {
    id: row.slug,
    slug: row.slug,
    titleTh: row.titleTh,
    titleEn: row.titleEn,
    subtitleTh: fallback?.subtitleTh ?? row.category,
    subtitleEn: fallback?.subtitleEn ?? row.category,
    category: row.category,
    badges: fallback?.badges ?? [row.category],
    heroImage: row.heroImage,
    galleryImages: row.galleryImages.length ? row.galleryImages : [row.heroImage],
    storySlug: fallback?.storySlug,
    sizes,
    prices: { ...allPrices, ...prices },
    startingPrice: row.startingPrice,
    descriptionTh: row.descriptionTh,
    descriptionEn: row.descriptionEn,
    loreTh: fallback?.loreTh ?? row.descriptionTh,
    loreEn: fallback?.loreEn ?? row.descriptionEn,
    seoTitleTh: fallback?.seoTitleTh ?? `${row.titleTh} ${subtitle} | Collector Dream Factory`,
    seoTitleEn: fallback?.seoTitleEn ?? `${row.titleEn} ${row.category} | Collector Dream Factory`,
    seoDescriptionTh:
      fallback?.seoDescriptionTh ??
      `${row.descriptionTh} รับทำฟิกเกอร์ รับทำโมเดลจากรูป และของสะสมสั่งทำ`,
    seoDescriptionEn:
      fallback?.seoDescriptionEn ??
      `${row.descriptionEn} Custom figure Thailand and custom collectible Thailand.`,
    availableForBuild: row.availableForBuild,
    availableForSTL: fallback?.availableForSTL ?? false,
  };
}

export const pieces = generatedPieces.pieces.map(buildPiece);

export type PieceSlug = (typeof pieces)[number]["slug"];

export function getPieceBySlug(slug: string) {
  return pieces.find((piece) => piece.slug === slug);
}
