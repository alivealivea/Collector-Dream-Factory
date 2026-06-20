export type Story = {
  id: string;
  slug: string;
  titleTh: string;
  titleEn: string;
  excerptTh: string;
  excerptEn: string;
  bodyTh: string[];
  bodyEn: string[];
  heroImage: string;
  galleryImages: string[];
  relatedPieceSlug?: string;
  seoTitleTh: string;
  seoTitleEn: string;
  seoDescriptionTh: string;
  seoDescriptionEn: string;
};

export const stories = [
  {
    id: "android-18-life-size-project",
    slug: "android-18-life-size-project",
    titleTh: "Android 18 Life-size Project",
    titleEn: "Android 18 Life-size Project",
    excerptTh: "งานขนาดใหญ่ที่ต้องดูทั้งสัดส่วน พื้นที่ตั้ง และความรู้สึกเวลาอยู่ในห้องจริง",
    excerptEn: "A large piece where scale, room placement, and presence all matter.",
    bodyTh: [
      "งานนี้เริ่มจากภาพตัวละครและความต้องการให้ชิ้นงานดูเด่นในห้องสะสมจริง",
      "เราดูสเกล รายละเอียด และวิธีผลิตให้เหมาะกับงานขนาดใหญ่ก่อนเริ่มทำ",
    ],
    bodyEn: [
      "This project began with character references and a clear goal: a piece that stands out in a real collector room.",
      "We reviewed scale, detail, and production method before moving into the build.",
    ],
    heroImage: "/images/portfolio/portfolio-08.jpg",
    galleryImages: ["/images/portfolio/portfolio-08.jpg", "/images/android-18.png"],
    relatedPieceSlug: "android-18",
    seoTitleTh: "Android 18 Life-size Project | Collector Dream Factory",
    seoTitleEn: "Android 18 Life-size Project | Collector Dream Factory",
    seoDescriptionTh: "เรื่องราวงานรับทำ life-size และของสะสมขนาดใหญ่สำหรับห้องสะสมจริง",
    seoDescriptionEn: "Story of a life-size custom collectible built for a real collector room.",
  },
  {
    id: "akaza-hero-piece",
    slug: "akaza-hero-piece",
    titleTh: "Akaza Hero Piece",
    titleEn: "Akaza Hero Piece",
    excerptTh: "งานที่เน้นท่าทาง กล้ามเนื้อ และขนาด เพื่อให้ตัวละครดูมีแรงเมื่อวางโชว์",
    excerptEn: "A piece focused on pose, muscle form, and display presence.",
    bodyTh: [
      "งานนี้เน้นอ่านท่าทางและกล้ามเนื้อให้ชัดตั้งแต่ระยะไกล",
      "ขั้นตอนสำคัญคือการแบ่งชิ้นงาน เก็บผิว และเช็กสเกลก่อนทำสีจริง",
    ],
    bodyEn: [
      "This piece focuses on strong pose readability and muscle form from a distance.",
      "The key steps are part splitting, surface finishing, and scale checks before painting.",
    ],
    heroImage: "/images/story-akaza-process.jpg",
    galleryImages: ["/images/story-akaza-process.jpg", "/images/portfolio/portfolio-17.jpg", "/images/akaza.png"],
    relatedPieceSlug: "akaza",
    seoTitleTh: "Akaza Hero Piece | Collector Dream Factory",
    seoTitleEn: "Akaza Hero Piece | Collector Dream Factory",
    seoDescriptionTh: "เรื่องราวงานรับทำโมเดลตัวละครขนาดใหญ่และงานต้นแบบ Hero Piece",
    seoDescriptionEn: "Story of a large custom character model and Hero Piece prototype.",
  },
  {
    id: "r2d2-collection",
    slug: "r2d2-collection",
    titleTh: "R2-D2 Collection",
    titleEn: "R2-D2 Collection",
    excerptTh: "งานหุ่นยนต์ขนาดใหญ่ที่ต้องเห็นสเกลชัดเมื่อเทียบกับคนและพื้นที่ในบ้าน",
    excerptEn: "A large robot build that needs to read clearly beside a person and furniture.",
    bodyTh: [
      "ชิ้นงานขนาดใหญ่ต้องดูเรื่องสัดส่วนและการขนย้ายตั้งแต่ก่อนผลิต",
      "ภาพเทียบคนช่วยให้ลูกค้าเข้าใจขนาดจริงก่อนตัดสินใจเริ่มงาน",
    ],
    bodyEn: [
      "Large builds need proportion and transport planning before production.",
      "Human scale references help customers understand the real size before starting.",
    ],
    heroImage: "/images/story-r2d2-scale.jpg",
    galleryImages: ["/images/story-r2d2-scale.jpg", "/images/portfolio/portfolio-23.jpg", "/images/r2d2.png"],
    relatedPieceSlug: "r2d2",
    seoTitleTh: "R2-D2 Collection | Collector Dream Factory",
    seoTitleEn: "R2-D2 Collection | Collector Dream Factory",
    seoDescriptionTh: "เรื่องราวของสะสมขนาดใหญ่และงานรับทำโมเดล life-size",
    seoDescriptionEn: "Story of a large custom collectible and life-size model build.",
  },
  {
    id: "memory-twin-figure",
    slug: "memory-twin-figure",
    titleTh: "Memory Twin Figure",
    titleEn: "Memory Twin Figure",
    excerptTh: "งานที่เริ่มจากภาพและความทรงจำ แล้วทำให้กลายเป็นฟิกเกอร์ที่เก็บไว้ได้",
    excerptEn: "A piece that begins with photos and memories, then becomes a figure to keep.",
    bodyTh: [
      "บางงานไม่ได้เริ่มจากตัวละคร แต่เริ่มจากคนจริงและความทรงจำ",
      "สิ่งสำคัญคือเก็บท่าทาง เสื้อผ้า และรายละเอียดเล็ก ๆ ให้รู้สึกเป็นเจ้าของงานจริง",
    ],
    bodyEn: [
      "Some projects do not begin with a character. They begin with real people and memories.",
      "The important part is keeping posture, clothes, and small details personal.",
    ],
    heroImage: "/images/memory-twins.jpg",
    galleryImages: ["/images/memory-twins.jpg", "/images/portfolio/portfolio-13.png"],
    relatedPieceSlug: "lover",
    seoTitleTh: "Memory Twin Figure | Collector Dream Factory",
    seoTitleEn: "Memory Twin Figure | Collector Dream Factory",
    seoDescriptionTh: "รับทำฟิกเกอร์คนจริงและของสะสมจากรูปถ่ายหรือความทรงจำ",
    seoDescriptionEn: "Custom memory figure made from photos and personal references.",
  },
  {
    id: "custom-couple-collectible",
    slug: "custom-couple-collectible",
    titleTh: "Custom Couple Collectible",
    titleEn: "Custom Couple Collectible",
    excerptTh: "งานคู่ที่เก็บท่าทาง เสื้อผ้า และรายละเอียดเล็ก ๆ ให้เป็นของสะสมเฉพาะตัว",
    excerptEn: "A couple piece that keeps posture, clothes, and small personal details.",
    bodyTh: [
      "งานคู่ต้องดูความสัมพันธ์ของท่าทางและรายละเอียดของทั้งสองคนพร้อมกัน",
      "เราใช้รูปอ้างอิงเพื่อวางโครงก่อน แล้วค่อยเก็บรายละเอียดที่ทำให้งานรู้สึกเฉพาะตัว",
    ],
    bodyEn: [
      "Couple pieces need the posture and details of both people to work together.",
      "We start from references, then refine the personal details that make the piece feel specific.",
    ],
    heroImage: "/images/lover.png",
    galleryImages: ["/images/lover.png", "/images/portfolio/portfolio-01.jpg"],
    relatedPieceSlug: "lover",
    seoTitleTh: "Custom Couple Collectible | Collector Dream Factory",
    seoTitleEn: "Custom Couple Collectible | Collector Dream Factory",
    seoDescriptionTh: "เรื่องราวงานรับทำโมเดลจากรูปและฟิกเกอร์คู่แบบสั่งทำ",
    seoDescriptionEn: "Story of a custom couple collectible made from reference photos.",
  },
] as const satisfies readonly Story[];

export type StorySlug = (typeof stories)[number]["slug"];

export function getStoryBySlug(slug: string) {
  return stories.find((story) => story.slug === slug);
}
