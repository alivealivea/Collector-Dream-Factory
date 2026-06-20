export type Lang = "th" | "en";

import { pricing } from "@/src/config/pricing";

export const dictionary = {
  th: {
    nav: {
      collections: "คอลเลกชัน",
      story: "เรื่องราว",
      start: "เริ่มโปรเจกต์",
      backToStory: "กลับไปหน้าเรื่องราว",
      language: "TH / EN",
    },
    image: {
      open: "ดูเต็มภาพ",
      close: "ปิด",
    },
    story: {
      metaTitle: "เรื่องราวจากของสะสม | Collector Dream Factory",
      metaDescription: "จากรูป สู่ของจริง โดย Collector Dream Factory",
      heroEyebrow: "COLLECTOR STORIES",
      title: "เรื่องราวจากของสะสม",
      subtitle: "จากรูป สู่ของจริง",
      heroBody:
        "บางงานเริ่มจากรูปเดียว บางงานเริ่มจากโมเดลเก่า บางงานเป็นความทรงจำของคนจริง หน้าที่ของเราคือช่วยทำให้มันออกมาเป็นชิ้นงานที่จับต้องได้",
      behindEyebrow: "BEHIND THE DREAM",
      behindTitle: "จากภาพในใจ สู่งานจริง",
      behindSubtitle: "มีภาพในใจ ที่เหลือเราช่วยทำให้เป็นจริง",
      storyEyebrow: "COLLECTOR STORIES",
      storyTitle: "เรื่องของแต่ละชิ้นงาน",
      readStory: "อ่านเรื่องนี้",
      videoEyebrow: "VIDEO GALLERY",
      videoTitle: "วิดีโอจาก meme_Premium123",
      openYoutube: "เปิด YouTube",
      instagramEyebrow: "INSTAGRAM FEED",
      instagramTitle: "ภาพล่าสุดจากสตูดิโอ",
      finalEyebrow: "START THE NEXT STORY",
      finalTitle: "พร้อมสร้างผลงานในฝันชิ้นต่อไปหรือยัง?",
      finalCta: "เริ่มโปรเจกต์ของคุณ",
      detailCta: "เริ่มโปรเจกต์แบบนี้",
      detailBody: [
        "งานแต่ละชิ้นเริ่มจากสิ่งที่เจ้าของอยากเห็นจริง ๆ อาจเป็นรูปตัวละคร รูปคน หรือโมเดลที่อยากทำให้ใหญ่ขึ้น",
        "เราช่วยดูสเกล รายละเอียด และวิธีผลิตให้เหมาะกับงานจริง ก่อนเริ่มทำชิ้นงาน",
      ],
      behindCards: [
        {
          title: "จากรูปสู่โมเดล",
          description: "เริ่มจากรูปอ้างอิง แล้วค่อยสร้างเป็นโมเดลสามมิติ",
        },
        {
          title: "เตรียมสำหรับการผลิต",
          description: "แบ่งชิ้นงานให้พร้อมสำหรับการพิมพ์และประกอบ",
        },
        {
          title: "เก็บรายละเอียด",
          description: "ประกอบ ขัด และทำสีทีละขั้น",
        },
        {
          title: "พร้อมส่งมอบ",
          description: "ชิ้นงานที่พร้อมไปอยู่ในบ้านของเจ้าของ",
        },
      ],
      stories: {
        "android-18-life-size-project": {
          title: "Android 18 Life-size Project",
          eyebrow: "LIFE-SIZE PROJECT",
          description:
            "งานขนาดใหญ่ที่ต้องดูทั้งสัดส่วน พื้นที่ตั้ง และความรู้สึกเวลาอยู่ในห้องจริง",
        },
        "akaza-hero-piece": {
          title: "Akaza Hero Piece",
          eyebrow: "HERO PIECE",
          description:
            "งานที่เน้นท่าทาง กล้ามเนื้อ และขนาด เพื่อให้ตัวละครดูมีแรงเมื่อวางโชว์",
        },
        "r2d2-collection": {
          title: "R2-D2 Collection",
          eyebrow: "COLLECTOR SCALE",
          description:
            "งานหุ่นยนต์ขนาดใหญ่ที่ต้องเห็นสเกลชัดเมื่อเทียบกับคนและพื้นที่ในบ้าน",
        },
        "memory-twin-figure": {
          title: "Memory Twin Figure",
          eyebrow: "MEMORY PIECE",
          description:
            "งานที่เริ่มจากภาพและความทรงจำ แล้วทำให้กลายเป็นฟิกเกอร์ที่เก็บไว้ได้",
        },
        "custom-couple-collectible": {
          title: "Custom Couple Collectible",
          eyebrow: "CUSTOM STORY",
          description:
            "งานคู่ที่เก็บท่าทาง เสื้อผ้า และรายละเอียดเล็ก ๆ ให้เป็นของสะสมเฉพาะตัว",
        },
      },
      videos: [
        {
          title: "Process highlights",
          description: "บรรยากาศการทำงานและการเก็บรายละเอียด",
        },
        {
          title: "Scale comparison",
          description: "ดูขนาดงานจริงเมื่อเทียบกับคน",
        },
        {
          title: "Collector room preview",
          description: "ตัวอย่างการวางงานสะสมในพื้นที่จริง",
        },
      ],
      instagram: [
        "Watermelon scale check",
        "R2-D2 large build",
        "Akaza finishing process",
        "Stitch showcase",
      ],
    },
    thankYou: {
      navBack: "กลับหน้าแรก",
      language: "TH / EN",
      headline: "ได้รับข้อมูลแล้ว",
      subheadline: "เราจะติดต่อกลับผ่านช่องทางที่คุณสะดวกที่สุด",
      note: "ถ้าต้องการคุยเร็ว สามารถทัก inbox ช่องทางที่สะดวกได้ทันที",
      nextTitle: "ขั้นตอนต่อไป",
      steps: [
        {
          title: "ตรวจรูปอ้างอิง",
          description: "เราจะดูรูปและไอเดียที่ส่งมา",
        },
        {
          title: "ประเมินขนาดและราคา",
          description: "คำนวณตามขนาด รายละเอียด และความซับซ้อน",
        },
        {
          title: "คุยรายละเอียด",
          description: "สรุปแบบ ขนาด สี และระยะเวลาผลิต",
        },
        {
          title: "เริ่มผลิต",
          description: "หลังคอนเฟิร์มและวางมัดจำ จึงเริ่มงานจริง",
        },
      ],
      openChannel: "เปิดช่องทางนี้",
      ctaTitle: "อยากดูผลงานเพิ่มเติม?",
      collection: "ดูคอลเลกชัน",
      stories: "อ่านเรื่องราวจากของสะสม",
    },
    faq: {
      metaTitle: "คำถามที่พบบ่อย | Collector Dream Factory",
      metaDescription: "ข้อมูลเบื้องต้นสำหรับนักสะสมที่กำลังเริ่มโปรเจกต์ 3D print และ Hero Piece สั่งทำ",
      navBack: "กลับหน้าแรก",
      language: "TH / EN",
      eyebrow: "FAQ",
      title: "คำถามที่พบบ่อย",
      subtitle: "ข้อมูลเบื้องต้นสำหรับนักสะสมที่กำลังเริ่มโปรเจกต์",
      contactTitle: "ยังมีคำถามเพิ่มเติม?",
      startProject: "เริ่มโปรเจกต์",
      openChannel: "เปิดช่องทางนี้",
      items: [
        {
          question: "รับทำจากรูปได้ไหม",
          answer:
            "ได้ เพียงส่งรูปอ้างอิงหรือไอเดียมา เราจะช่วยประเมินและวางแนวทางการผลิตให้",
        },
        {
          question: "ราคาเริ่มต้นเท่าไร",
          answer:
            `${pricing["30"].label}: ${pricing["30"].price}\n${pricing["60"].label}: ${pricing["60"].price}\n${pricing["100"].label}: ${pricing["100"].price}\n${pricing["170"].label}: ${pricing["170"].price}\n\nราคาจริงขึ้นอยู่กับรายละเอียด ขนาด และงานทำสี`,
        },
        {
          question: "ใช้เวลาผลิตกี่วัน",
          answer: "โดยทั่วไปประมาณ 7-30 วัน ขึ้นอยู่กับขนาดและรายละเอียดของชิ้นงาน",
        },
        {
          question: "ทำสีได้ไหม",
          answer: "สามารถเลือกได้ทั้งงานดิบ สีพื้น และงานทำสีเต็ม",
        },
        {
          question: "ส่งต่างจังหวัดได้ไหม",
          answer: "ได้ ลูกค้าสามารถเรียกรถรับเอง เช่น Lalamove หรือบริษัทขนส่งที่สะดวก",
        },
        {
          question: "ต้องมัดจำไหม",
          answer: "เริ่มผลิตหลังจากยืนยันรายละเอียดและวางมัดจำ",
        },
        {
          question: "รับทำขนาด Life-size ไหม",
          answer: "รับทำ รวมถึงงานขนาด 170 cm และขนาดพิเศษตามต้องการ",
        },
        {
          question: "ส่งไฟล์ STL หรือไม่",
          answer: "บางโปรเจกต์สามารถจัดส่งไฟล์ได้ กรุณาสอบถามเพิ่มเติม",
        },
      ],
    },
  },
  en: {
    nav: {
      collections: "Collections",
      story: "Story",
      start: "Start Project",
      backToStory: "Back to stories",
      language: "EN / TH",
    },
    image: {
      open: "View full image",
      close: "Close",
    },
    story: {
      metaTitle: "Collector Stories | Collector Dream Factory",
      metaDescription: "From reference images to real collectible pieces.",
      heroEyebrow: "COLLECTOR STORIES",
      title: "Collector Stories",
      subtitle: "From image to real piece",
      heroBody:
        "Some projects begin with one reference image. Some begin with an old model. Some begin with a real memory. Our job is to turn that idea into something you can actually keep.",
      behindEyebrow: "BEHIND THE DREAM",
      behindTitle: "From idea to real work",
      behindSubtitle: "Bring the idea. We help make it real.",
      storyEyebrow: "COLLECTOR STORIES",
      storyTitle: "Stories behind each piece",
      readStory: "Read story",
      videoEyebrow: "VIDEO GALLERY",
      videoTitle: "Videos from meme_Premium123",
      openYoutube: "Open YouTube",
      instagramEyebrow: "INSTAGRAM FEED",
      instagramTitle: "Latest studio posts",
      finalEyebrow: "START THE NEXT STORY",
      finalTitle: "Ready to create the next dream piece?",
      finalCta: "Start your project",
      detailCta: "Start a project like this",
      detailBody: [
        "Every piece starts with what the owner wants to see in real life. It may be a character, a person, or a model that should become larger.",
        "We help review scale, details, and production method before building the actual piece.",
      ],
      behindCards: [
        {
          title: "From photo to model",
          description: "We start from references, then build a 3D model.",
        },
        {
          title: "Prepare for production",
          description: "The model is split for printing and assembly.",
        },
        {
          title: "Finish the details",
          description: "Assembly, sanding, and painting happen step by step.",
        },
        {
          title: "Ready to deliver",
          description: "The piece is ready to live in its owner's home.",
        },
      ],
      stories: {
        "android-18-life-size-project": {
          title: "Android 18 Life-size Project",
          eyebrow: "LIFE-SIZE PROJECT",
          description:
            "A large piece where scale, room placement, and presence all matter.",
        },
        "akaza-hero-piece": {
          title: "Akaza Hero Piece",
          eyebrow: "HERO PIECE",
          description:
            "A piece focused on pose, muscle form, and display presence.",
        },
        "r2d2-collection": {
          title: "R2-D2 Collection",
          eyebrow: "COLLECTOR SCALE",
          description:
            "A large robot build that needs to read clearly beside a person and furniture.",
        },
        "memory-twin-figure": {
          title: "Memory Twin Figure",
          eyebrow: "MEMORY PIECE",
          description:
            "A piece that begins with photos and memories, then becomes a figure to keep.",
        },
        "custom-couple-collectible": {
          title: "Custom Couple Collectible",
          eyebrow: "CUSTOM STORY",
          description:
            "A couple piece that keeps posture, clothes, and small personal details.",
        },
      },
      videos: [
        {
          title: "Process highlights",
          description: "Work process and finishing details.",
        },
        {
          title: "Scale comparison",
          description: "See the real size beside a person.",
        },
        {
          title: "Collector room preview",
          description: "How collectibles feel inside real spaces.",
        },
      ],
      instagram: [
        "Watermelon scale check",
        "R2-D2 large build",
        "Akaza finishing process",
        "Stitch showcase",
      ],
    },
    thankYou: {
      navBack: "Back home",
      language: "EN / TH",
      headline: "We received your details",
      subheadline: "We will contact you through your preferred channel.",
      note: "If you want to talk sooner, you can message any inbox that works for you.",
      nextTitle: "Next steps",
      steps: [
        {
          title: "Review references",
          description: "We review the images and ideas you sent.",
        },
        {
          title: "Estimate size and price",
          description: "We calculate based on size, details, and model complexity.",
        },
        {
          title: "Discuss details",
          description: "We confirm the design, size, paint, and production timeline.",
        },
        {
          title: "Begin production",
          description: "After confirmation and deposit, real production begins.",
        },
      ],
      openChannel: "Open this channel",
      ctaTitle: "Want to see more work?",
      collection: "View collections",
      stories: "Read collector stories",
    },
    faq: {
      metaTitle: "Frequently Asked Questions | Collector Dream Factory",
      metaDescription:
        "Basic information for collectors starting a custom 3D printed Hero Piece project.",
      navBack: "Back home",
      language: "EN / TH",
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Basic information for collectors starting a project",
      contactTitle: "Have more questions?",
      startProject: "Start project",
      openChannel: "Open this channel",
      items: [
        {
          question: "Can you create a piece from photos?",
          answer:
            "Yes. Send reference photos or an idea, and we will help estimate the project and plan the production approach.",
        },
        {
          question: "What is the starting price?",
          answer:
            `${pricing["30"].label}: ${pricing["30"].price}\n${pricing["60"].label}: ${pricing["60"].price}\n${pricing["100"].label}: ${pricing["100"].price}\n${pricing["170"].label}: ${pricing["170"].price}\n\nThe final price depends on details, size, and painting work.`,
        },
        {
          question: "How long does production take?",
          answer: "Usually around 7-30 days, depending on the size and detail of the piece.",
        },
        {
          question: "Can you paint the piece?",
          answer: "Yes. You can choose raw finish, basic color, or full painting.",
        },
        {
          question: "Can you deliver outside Bangkok?",
          answer:
            "Yes. Customers can arrange pickup with services such as Lalamove or another preferred delivery provider.",
        },
        {
          question: "Is a deposit required?",
          answer: "Production starts after details are confirmed and a deposit is placed.",
        },
        {
          question: "Do you make life-size pieces?",
          answer: "Yes, including 170 cm pieces and special sizes on request.",
        },
        {
          question: "Do you provide STL files?",
          answer: "Some projects can include files. Please ask for details.",
        },
      ],
    },
  },
} as const;
