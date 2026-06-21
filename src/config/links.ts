export const links = {
  youtube: "https://www.youtube.com/results?search_query=meme_Premium123",
  tiktok: "https://www.tiktok.com/@memepremium123",
  facebook: "https://facebook.com/",
  facebookInbox: "https://m.me/61557714339022",
  instagram: "https://www.instagram.com/meme_Premium123",
  line: "https://line.me/R/ti/p/@299ckiiy",
  fastwork: "https://fastwork.co/user/arobot/3d-printing-70196979",
  shopee: "https://shopee.co.th/shop/111198034",
  depositLink: "https://m.me/61557714339022?ref=deposit",
} as const;

export const socialLinks = [
  {
    name: "YouTube",
    handle: "meme_Premium123",
    href: links.youtube,
  },
  {
    name: "TikTok",
    handle: "meme_Premium123",
    href: links.tiktok,
  },
  {
    name: "Facebook",
    handle: "meme_Premium123",
    href: links.facebookInbox,
  },
  {
    name: "Instagram",
    handle: "meme_Premium123",
    href: links.instagram,
  },
  {
    name: "LINE",
    handle: "@299ckiiy",
    href: links.line,
  },
  {
    name: "Fastwork",
    handle: "arobot / 3D Printing",
    href: links.fastwork,
  },
  {
    name: "Shopee",
    handle: "shop/111198034",
    href: links.shopee,
  },
] as const;

export const contactLinks = [
  {
    platform: "Facebook Messenger",
    handle: "meme_Premium123",
    description: "เหมาะสำหรับส่งรายละเอียดและคุยต่อแบบรวดเร็ว",
    href: links.facebook,
    shortLabel: "FB",
  },
  {
    platform: "TikTok",
    handle: "@meme_Premium123",
    description: "ดูผลงานและทักคุยจากช่อง TikTok ได้ทันที",
    href: links.tiktok,
    shortLabel: "TT",
  },
  {
    platform: "Instagram",
    handle: "@meme_Premium123",
    description: "เหมาะสำหรับส่งรูปอ้างอิงและดูภาพผลงาน",
    href: links.instagram,
    shortLabel: "IG",
  },
  {
    platform: "LINE Official",
    handle: "@299ckiiy",
    description: "ช่องทางคุยต่อที่สะดวกสำหรับรายละเอียดงาน",
    href: links.line,
    shortLabel: "LINE",
  },
  {
    platform: "YouTube",
    handle: "meme_Premium123",
    description: "ดูวิดีโอขั้นตอนและผลงานเพิ่มเติม",
    href: links.youtube,
    shortLabel: "YT",
  },
] as const;
