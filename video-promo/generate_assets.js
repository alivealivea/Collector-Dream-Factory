const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');
const TEMP_DIR = path.join(__dirname, 'temp_raw');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function getBase64Image(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${fileBuffer.toString('base64')}`;
}

async function run() {
  console.log('🚀 Starting video frame asset generation...');
  const browser = await chromium.launch({ headless: true });
  
  // Set viewport to vertical mobile 1080x1920
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2, // Retinal high resolution
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // 1. Capture Raw Screenshots from Vercel Web App
  console.log('📸 Capturing screenshots from the live web app...');

  // Frame 1: Home Hero
  console.log('Navigating to Home...');
  await page.goto('https://collector-dream-factory.vercel.app/', { waitUntil: 'networkidle' });
  // Wait a moment for animations
  await page.waitForTimeout(2000);
  const homeHeroPath = path.join(TEMP_DIR, 'home_hero.png');
  await page.screenshot({ path: homeHeroPath });
  console.log('✓ Home Hero captured');

  // Frame 2: Room Scale Preview
  console.log('Navigating to Room Scale Preview...');
  await page.goto('https://collector-dream-factory.vercel.app/#room-preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Locate the room preview element
  const roomPreview = page.locator('#room-preview');
  if (await roomPreview.count() > 0) {
    await roomPreview.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }
  const previewPath = path.join(TEMP_DIR, 'room_preview.png');
  await page.screenshot({ path: previewPath });
  console.log('✓ Room Scale Preview captured');

  // Frame 3: Collections
  console.log('Navigating to Collections page...');
  await page.goto('https://collector-dream-factory.vercel.app/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Scroll down slightly to show collections
  await page.evaluate(() => window.scrollBy(0, 150));
  await page.waitForTimeout(1000);
  const collectionsPath = path.join(TEMP_DIR, 'collections.png');
  await page.screenshot({ path: collectionsPath });
  console.log('✓ Collections page captured');

  // Frame 4: Story page
  console.log('Navigating to Story page...');
  await page.goto('https://collector-dream-factory.vercel.app/story', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(1000);
  const storyPath = path.join(TEMP_DIR, 'story.png');
  await page.screenshot({ path: storyPath });
  console.log('✓ Story page captured');

  // Frame 5: Dream Project form
  console.log('Navigating to Dream Project form...');
  await page.goto('https://collector-dream-factory.vercel.app/dream-project', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Scroll down slightly to show the start of form fields
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(1000);
  const dreamProjectPath = path.join(TEMP_DIR, 'dream_project.png');
  await page.screenshot({ path: dreamProjectPath });
  console.log('✓ Dream Project Form captured');

  // Frame 6: FAQ
  console.log('Navigating to FAQ page...');
  await page.goto('https://collector-dream-factory.vercel.app/faq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const faqPath = path.join(TEMP_DIR, 'faq.png');
  await page.screenshot({ path: faqPath });
  console.log('✓ FAQ page captured');

  // 2. Generate Finished 1080x1920 PNG frames
  console.log('🎨 Compiling final vertical video frames...');

  // Convert raw screenshots to Base64 for local HTML rendering
  const base64Home = getBase64Image(homeHeroPath);
  const base64Preview = getBase64Image(previewPath);
  const base64Collections = getBase64Image(collectionsPath);
  const base64Story = getBase64Image(storyPath);
  const base64Form = getBase64Image(dreamProjectPath);
  const base64Faq = getBase64Image(faqPath);

  // Define HTML templates for each frame
  const frames = [
    {
      name: 'frame-01.png',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,700&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 0; width: 1080px; height: 1920px;
              background: #0d0c0f; color: #f4f0ea;
              font-family: 'Kanit', sans-serif; overflow: hidden;
            }
            .background {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background-image: url('${base64Home}');
              background-size: cover; background-position: center;
              filter: blur(8px) brightness(0.35);
              z-index: 1;
            }
            .overlay {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background: linear-gradient(180deg, rgba(23, 19, 15, 0.4) 0%, rgba(23, 19, 15, 0.7) 60%, rgba(23, 19, 15, 0.95) 100%);
              z-index: 2;
            }
            .wrapper {
              position: relative; z-index: 3; width: 1080px; height: 1920px;
              display: flex; flex-direction: column; justify-content: center; align-items: center;
              padding: 120px 80px 240px 80px; box-sizing: border-box; text-align: center;
            }
            .eyebrow {
              font-size: 28px; font-weight: 700; color: #f2b85c;
              letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 30px;
            }
            .headline {
              font-size: 64px; font-weight: 800; line-height: 1.4;
              text-shadow: 0 4px 24px rgba(0,0,0,0.8); margin-bottom: 40px;
            }
            .gold { color: #f2b85c; }
            .subheadline {
              font-size: 34px; font-weight: 400; color: #a19d98; line-height: 1.6;
              max-width: 800px; margin: 0 auto;
            }
            .brand-badge {
              margin-top: 60px; padding: 12px 30px;
              border: 1px solid rgba(242, 184, 92, 0.4);
              border-radius: 40px; background: rgba(242, 184, 92, 0.08);
              font-size: 24px; font-weight: 600; color: #f4f0ea;
            }
          </style>
        </head>
        <body>
          <div class="background"></div>
          <div class="overlay"></div>
          <div class="wrapper">
            <div class="eyebrow">Collector Dream Factory</div>
            <div class="headline">
              ถ้าตัวละครที่คุณรัก...<br>
              <span class="gold">อยู่ในห้องคุณได้จริงล่ะ?</span>
            </div>
            <div class="subheadline">
              เนรมิตตัวละครจากหน้าจอ สู่ของสะสมจริงในสเกลที่ใช่สำหรับคุณ
            </div>
            <div class="brand-badge">ผลงานในฝัน สำหรับนักสะสมตัวจริง</div>
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'frame-02.png',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 0; width: 1080px; height: 1920px;
              background: #0d0c0f; color: #f4f0ea;
              font-family: 'Kanit', sans-serif; overflow: hidden;
            }
            .background {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background-image: url('${base64Preview}');
              background-size: cover; background-position: center;
              filter: blur(12px) brightness(0.3);
              z-index: 1;
            }
            .overlay {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background: linear-gradient(180deg, rgba(23, 19, 15, 0.45) 0%, rgba(23, 19, 15, 0.8) 70%, rgba(23, 19, 15, 0.95) 100%);
              z-index: 2;
            }
            .wrapper {
              position: relative; z-index: 3; width: 1080px; height: 1920px;
              display: flex; flex-direction: column; justify-content: space-between; align-items: center;
              padding: 120px 80px 240px 80px; box-sizing: border-box; text-align: center;
            }
            .header {
              width: 100%;
            }
            .eyebrow {
              font-size: 28px; font-weight: 700; color: #f2b85c;
              letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 20px;
            }
            .headline {
              font-size: 58px; font-weight: 800; line-height: 1.4;
              text-shadow: 0 4px 20px rgba(0,0,0,0.8);
            }
            .gold { color: #f2b85c; }
            .card {
              width: 920px; height: 1100px;
              border-radius: 36px; border: 1px solid rgba(244, 240, 234, 0.15);
              overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,0.7);
              background: #18171c;
            }
            .card img {
              width: 100%; height: 100%; object-fit: cover; object-position: center top;
            }
            .subline {
              font-size: 30px; color: #a19d98; line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="background"></div>
          <div class="overlay"></div>
          <div class="wrapper">
            <div class="header">
              <div class="eyebrow">Room Scale Preview</div>
              <div class="headline">เลือกตัวละคร เลือกขนาด<br><span class="gold">แล้วเห็นภาพในห้องจริงได้ทันที</span></div>
            </div>
            <div class="card">
              <img src="${base64Preview}" />
            </div>
            <div class="subline">ลองปรับขนาดเทียบสเกลตั้งแต่ 30 ซม. จนถึง 1.7 เมตร</div>
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'frame-03.png',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 0; width: 1080px; height: 1920px;
              background: #0d0c0f; color: #f4f0ea;
              font-family: 'Kanit', sans-serif; overflow: hidden;
            }
            .background {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background-image: url('${base64Collections}');
              background-size: cover; background-position: center;
              filter: blur(12px) brightness(0.3);
              z-index: 1;
            }
            .overlay {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background: linear-gradient(180deg, rgba(23, 19, 15, 0.45) 0%, rgba(23, 19, 15, 0.8) 70%, rgba(23, 19, 15, 0.95) 100%);
              z-index: 2;
            }
            .wrapper {
              position: relative; z-index: 3; width: 1080px; height: 1920px;
              display: flex; flex-direction: column; justify-content: space-between; align-items: center;
              padding: 120px 80px 240px 80px; box-sizing: border-box; text-align: center;
            }
            .header {
              width: 100%;
            }
            .eyebrow {
              font-size: 28px; font-weight: 700; color: #f2b85c;
              letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 20px;
            }
            .headline {
              font-size: 58px; font-weight: 800; line-height: 1.4;
            }
            .gold { color: #f2b85c; }
            .card {
              width: 920px; height: 1100px;
              border-radius: 36px; border: 1px solid rgba(244, 240, 234, 0.15);
              overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,0.7);
              background: #18171c;
            }
            .card img {
              width: 100%; height: 100%; object-fit: cover; object-position: center 20%;
            }
            .subline {
              font-size: 30px; color: #a19d98; line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="background"></div>
          <div class="overlay"></div>
          <div class="wrapper">
            <div class="header">
              <div class="eyebrow">Hero Pieces</div>
              <div class="headline"><span class="gold">ผลงานในฝัน</span> สำหรับนักสะสมตัวจริง</div>
            </div>
            <div class="card">
              <img src="${base64Collections}" />
            </div>
            <div class="subline">งานสะสมเกรดพรีเมียมที่เป็นเอกลักษณ์เฉพาะตัวคุณ</div>
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'frame-04.png',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 0; width: 1080px; height: 1920px;
              background: #0d0c0f; color: #f4f0ea;
              font-family: 'Kanit', sans-serif; overflow: hidden;
            }
            .background {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background-image: url('${base64Story}');
              background-size: cover; background-position: center;
              filter: blur(12px) brightness(0.3);
              z-index: 1;
            }
            .overlay {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background: linear-gradient(180deg, rgba(23, 19, 15, 0.45) 0%, rgba(23, 19, 15, 0.8) 70%, rgba(23, 19, 15, 0.95) 100%);
              z-index: 2;
            }
            .wrapper {
              position: relative; z-index: 3; width: 1080px; height: 1920px;
              display: flex; flex-direction: column; justify-content: space-between; align-items: center;
              padding: 120px 80px 240px 80px; box-sizing: border-box; text-align: center;
            }
            .header {
              width: 100%;
            }
            .eyebrow {
              font-size: 28px; font-weight: 700; color: #f2b85c;
              letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 20px;
            }
            .headline {
              font-size: 58px; font-weight: 800; line-height: 1.4;
            }
            .gold { color: #f2b85c; }
            .card {
              width: 920px; height: 1100px;
              border-radius: 36px; border: 1px solid rgba(244, 240, 234, 0.15);
              overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,0.7);
              background: #18171c;
            }
            .card img {
              width: 100%; height: 100%; object-fit: cover; object-position: center top;
            }
            .subline {
              font-size: 30px; color: #a19d98; line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="background"></div>
          <div class="overlay"></div>
          <div class="wrapper">
            <div class="header">
              <div class="eyebrow">Real Craftsmanship</div>
              <div class="headline">เปลี่ยนจากรูปภาพ... <span class="gold">สู่ของสะสมจริง</span></div>
            </div>
            <div class="card">
              <img src="${base64Story}" />
            </div>
            <div class="subline">ถ่ายทอดผลงานอย่างพิถีพิถันจากโมเดลสู่ชิ้นงานลงสีสุดประณีต</div>
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'frame-05.png',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 0; width: 1080px; height: 1920px;
              background: #0d0c0f; color: #f4f0ea;
              font-family: 'Kanit', sans-serif; overflow: hidden;
            }
            .background {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background-image: url('${base64Form}');
              background-size: cover; background-position: center;
              filter: blur(12px) brightness(0.3);
              z-index: 1;
            }
            .overlay {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background: linear-gradient(180deg, rgba(23, 19, 15, 0.45) 0%, rgba(23, 19, 15, 0.8) 70%, rgba(23, 19, 15, 0.95) 100%);
              z-index: 2;
            }
            .wrapper {
              position: relative; z-index: 3; width: 1080px; height: 1920px;
              display: flex; flex-direction: column; justify-content: space-between; align-items: center;
              padding: 120px 80px 240px 80px; box-sizing: border-box; text-align: center;
            }
            .header {
              width: 100%;
            }
            .eyebrow {
              font-size: 28px; font-weight: 700; color: #f2b85c;
              letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 20px;
            }
            .headline {
              font-size: 58px; font-weight: 800; line-height: 1.4;
            }
            .gold { color: #f2b85c; }
            .card {
              width: 920px; height: 1100px;
              border-radius: 36px; border: 1px solid rgba(244, 240, 234, 0.15);
              overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,0.7);
              background: #18171c;
            }
            .card img {
              width: 100%; height: 100%; object-fit: cover; object-position: center 25%;
            }
            .subline {
              font-size: 30px; color: #a19d98; line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="background"></div>
          <div class="overlay"></div>
          <div class="wrapper">
            <div class="header">
              <div class="eyebrow">Estimate Cost</div>
              <div class="headline">ส่งรูปอ้างอิงและขนาด<br><span class="gold">แล้วขอประเมินราคาเพื่อผลิต</span></div>
            </div>
            <div class="card">
              <img src="${base64Form}" />
            </div>
            <div class="subline">กรอกรายละเอียดสั้นๆ ในแบบฟอร์ม Dream Build ได้ง่ายๆ</div>
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'frame-06.png',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,700&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0; padding: 0; width: 1080px; height: 1920px;
              background: #0d0c0f; color: #f4f0ea;
              font-family: 'Kanit', sans-serif; overflow: hidden;
            }
            .background {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background-image: url('${base64Faq}');
              background-size: cover; background-position: center;
              filter: blur(12px) brightness(0.25);
              z-index: 1;
            }
            .overlay {
              position: absolute; top: 0; left: 0; width: 1080px; height: 1920px;
              background: linear-gradient(180deg, rgba(23, 19, 15, 0.45) 0%, rgba(23, 19, 15, 0.8) 60%, rgba(23, 19, 15, 0.98) 100%);
              z-index: 2;
            }
            .wrapper {
              position: relative; z-index: 3; width: 1080px; height: 1920px;
              display: flex; flex-direction: column; justify-content: center; align-items: center;
              padding: 120px 80px 240px 80px; box-sizing: border-box; text-align: center;
            }
            .eyebrow {
              font-size: 28px; font-weight: 700; color: #f2b85c;
              letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 40px;
            }
            .headline {
              font-size: 64px; font-weight: 800; line-height: 1.4;
              margin-bottom: 20px;
            }
            .gold { color: #f2b85c; }
            .tagline {
              font-size: 34px; font-weight: 400; color: #a19d98; margin-bottom: 80px;
            }
            .cta-button {
              padding: 30px 60px; font-size: 36px; font-weight: 800; color: #0d0c0f;
              background: linear-gradient(135deg, #f2b85c 0%, #dfaa4e 100%);
              border-radius: 50px; text-decoration: none;
              box-shadow: 0 16px 36px rgba(242, 184, 92, 0.35);
              border: none; margin-bottom: 40px;
            }
            .url-text {
              font-size: 38px; font-weight: 600; color: #f2b85c;
              letter-spacing: 0.05em;
            }
            .subtext {
              font-size: 24px; color: #5e5c58; margin-top: 60px;
            }
          </style>
        </head>
        <body>
          <div class="background"></div>
          <div class="overlay"></div>
          <div class="wrapper">
            <div class="eyebrow">Collector Dream Factory</div>
            <div class="headline">เริ่มสร้างของสะสม<br><span class="gold">ในฝันของคุณวันนี้</span></div>
            <div class="tagline">ของสะสมที่มีชิ้นเดียวในโลก เพื่อคุณโดยเฉพาะ</div>
            <div class="cta-button">เริ่มต้นโปรเจกต์</div>
            <div class="url-text">collector-dream-factory.vercel.app</div>
            <div class="subtext">ผลงานในฝัน สำหรับนักสะสมตัวจริง</div>
          </div>
        </body>
        </html>
      `
    }
  ];

  // Render each frame html and take screenshot
  for (const frame of frames) {
    console.log(`Rendering ${frame.name}...`);
    await page.setContent(frame.html);
    
    // Wait for google fonts to load
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    
    // Tiny delay to ensure fonts/images render fully
    await page.waitForTimeout(1000);
    
    const finalPath = path.join(OUTPUT_DIR, frame.name);
    await page.screenshot({ path: finalPath });
    console.log(`✓ Saved ${frame.name}`);
  }

  await browser.close();
  console.log('🎉 Frame generation complete!');
}

run().catch((err) => {
  console.error('❌ Error during generation:', err);
  process.exit(1);
});
