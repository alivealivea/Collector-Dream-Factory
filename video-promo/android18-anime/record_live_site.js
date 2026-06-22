const playwright = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RENDERS_DIR = path.join(__dirname, 'renders');
const RAW_CAPTURE_DIR = path.join(RENDERS_DIR, 'raw_capture');

// Ensure directories exist
if (!fs.existsSync(RENDERS_DIR)) {
  fs.mkdirSync(RENDERS_DIR, { recursive: true });
}
if (!fs.existsSync(RAW_CAPTURE_DIR)) {
  fs.mkdirSync(RAW_CAPTURE_DIR, { recursive: true });
}

// Helper to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Step 1: Generating synthetic sound effects using FFmpeg...');
  
  const clickPath = path.join(RENDERS_DIR, 'click.wav');
  const whooshPath = path.join(RENDERS_DIR, 'whoosh.wav');

  // Generate click: stereo, 1200Hz sine wave, 40ms duration with rapid decay
  execSync(`ffmpeg -y -f lavfi -i "sine=frequency=1200:duration=0.04" -ac 2 -af "volume=0.8, afade=t=out:st=0.01:d=0.03" "${clickPath}"`, { stdio: 'ignore' });

  // Generate whoosh: stereo, 300Hz sine wave, 250ms duration with fade in/out
  execSync(`ffmpeg -y -f lavfi -i "sine=frequency=300:duration=0.25" -ac 2 -af "volume=0.5, afade=t=in:st=0:d=0.1, afade=t=out:st=0.15:d=0.1" "${whooshPath}"`, { stdio: 'ignore' });

  console.log('✓ Sound effects generated successfully.');

  console.log('\n🚀 Step 2: Running Playwright to record the live website walkthrough...');
  
  // Clean old captures
  const oldFiles = fs.readdirSync(RAW_CAPTURE_DIR);
  for (const file of oldFiles) {
    fs.unlinkSync(path.join(RAW_CAPTURE_DIR, file));
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2, // High resolution retinal scale
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    recordVideo: {
      dir: RAW_CAPTURE_DIR,
      size: { width: 1080, height: 1920 }
    }
  });

  const page = await context.newPage();

  console.log(' - Navigating to: https://collector-dream-factory.vercel.app/');
  await page.goto('https://collector-dream-factory.vercel.app/', { waitUntil: 'networkidle' });

  // Timeline starting:
  // 0s - 2s: Hero load
  console.log(' - 0s: Hero loaded. Waiting 2 seconds...');
  await delay(2000);

  // 2s - 6s: Smooth scroll to Room Preview
  console.log(' - 2s: Smooth scrolling down to Room Preview...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 25;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= 1150) {
          clearInterval(timer);
          resolve();
        }
      }, 40); // 40ms intervals = ~4 seconds to scroll 1150px
    });
  });
  await delay(500); // Buffer delay

  // 6s - 7s: Hover/wait
  console.log(' - 6s: Hovering over room simulator options...');
  await delay(500);

  // 7s: Click Goku (Click 1)
  console.log(' - 7s: Clicking Goku card...');
  // Find Goku selector button or click it based on coordinates/element
  // Let's click Goku button by tapping it
  const gokuCard = page.locator('text=Goku').first();
  if (await gokuCard.count() > 0) {
    await gokuCard.click();
  } else {
    // Fallback tap on coordinates
    await page.mouse.click(360, 1600);
  }
  await delay(2000); // Show Goku for 2s

  // 9s: Click Android 18 (Click 2)
  console.log(' - 9s: Clicking Android 18 card...');
  const a18Card = page.locator('text=Android 18').first();
  if (await a18Card.count() > 0) {
    await a18Card.click();
  } else {
    await page.mouse.click(180, 1600);
  }
  await delay(2000); // Show Android 18 for 2s

  // 11s: Click 170cm scale (Click 3)
  console.log(' - 11s: Clicking 170cm scale button...');
  const scaleButton = page.locator('text=170 cm').first();
  if (await scaleButton.count() > 0) {
    await scaleButton.click();
  } else {
    await page.mouse.click(850, 1720);
  }
  await delay(3000); // Show scale for 3s

  // 14s - 16s: Scroll down showing Collections
  console.log(' - 14s: Scrolling down to Collections...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 30;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= 900) {
          clearInterval(timer);
          resolve();
        }
      }, 40); // 2s scroll
    });
  });
  await delay(2000); // Show collections for 2s (16s - 18s)

  // 18s: Navigate to Dream Project (Click 4)
  console.log(' - 18s: Navigating directly to Dream Project form page...');
  await page.goto('https://collector-dream-factory.vercel.app/dream-project', { waitUntil: 'networkidle' });
  await delay(3000); // Load form (18s - 21s)

  // 21s - 25s: Scroll form fields
  console.log(' - 21s: Smooth scrolling form fields...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 25;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= 600) {
          clearInterval(timer);
          resolve();
        }
      }, 50); // 3s scroll
    });
  });
  await delay(1000);

  // 25s: Click a form field (Click 5)
  console.log(' - 25s: Clicking on Height input field...');
  const heightField = page.locator('input[placeholder*="ความสูง"], input[type="number"]').first();
  if (await heightField.count() > 0) {
    await heightField.focus();
    await heightField.click();
  }
  await delay(5000); // Wait on form until 30s mark

  console.log(' - 30s: Finished walkthrough action sequence.');
  await context.close();
  await browser.close();

  // Find the recorded webm file
  const webmFiles = fs.readdirSync(RAW_CAPTURE_DIR).filter(f => f.endsWith('.webm'));
  if (webmFiles.length === 0) {
    throw new Error('No recorded webm video found in capture directory!');
  }
  const rawWebmPath = path.join(RAW_CAPTURE_DIR, webmFiles[0]);
  console.log(`✓ Walkthrough recorded: ${rawWebmPath}`);

  console.log('\n🚀 Step 3: Converting WebM to raw MP4 at 30 fps...');
  const rawMp4Path = path.join(RENDERS_DIR, 'raw-capture.mp4');
  execSync(`ffmpeg -y -i "${rawWebmPath}" -c:v libx264 -pix_fmt yuv420p -r 30 "${rawMp4Path}"`, { stdio: 'ignore' });
  console.log('✓ raw-capture.mp4 created.');

  console.log('\n🚀 Step 4: Mixing Audio & Video with FFmpeg complex filter...');
  const narrationPath = path.join(__dirname, 'narration.wav');
  const soundbedPath = path.join(__dirname, 'sound-bed.wav');
  
  // Output locations
  const finalVideoPath = path.join(RENDERS_DIR, 'android18-anime-promo-sfx.mp4');
  const rootVideoPath = path.join(__dirname, '..', '..', 'android18-anime-promo-sfx.mp4');
  const publicVideoPath = path.join(__dirname, '..', '..', 'public', 'android18-anime-promo-sfx.mp4');

  // Build complex filter for:
  // Clicks at: 7s (7000ms), 9s (9000ms), 11s (11000ms), 18s (18000ms), 25s (25000ms)
  // Whoosh at: 18s (18000ms)
  const filterComplex = [
    // Split clicks (5 clicks)
    `[3:a]asplit=5[c1_in][c2_in][c3_in][c4_in][c5_in];`,
    `[c1_in]adelay=7000|7000[c1];`,
    `[c2_in]adelay=9000|9000[c2];`,
    `[c3_in]adelay=11000|11000[c3];`,
    `[c4_in]adelay=18000|18000[c4];`,
    `[c5_in]adelay=25000|25000[c5];`,
    
    // Whoosh at 18s
    `[4:a]adelay=18000|18000[w1];`,
    
    // Narration & BGM volumes
    `[1:a]volume=1.2[vo];`,
    `[2:a]volume=0.35[bg];`,
    
    // Mix narration, bgm, 5 clicks, 1 whoosh
    `[vo][bg][c1][c2][c3][c4][c5][w1]amix=inputs=8:normalize=0[a]`
  ].join('');

  // Combine video with audio, limit duration to exactly 30 seconds
  const mixCmd = `ffmpeg -y -i "${rawMp4Path}" -i "${narrationPath}" -i "${soundbedPath}" -i "${clickPath}" -i "${whooshPath}" -filter_complex "${filterComplex}" -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 192k -t 30 "${finalVideoPath}"`;
  
  execSync(mixCmd, { stdio: 'inherit' });
  console.log('✓ Final video with SFX compiled successfully.');

  console.log('\n🚀 Step 5: Copying final files to project root and public folder...');
  fs.copyFileSync(finalVideoPath, rootVideoPath);
  console.log(` - Copied to Root: ${rootVideoPath}`);
  
  fs.copyFileSync(finalVideoPath, publicVideoPath);
  console.log(` - Copied to Public: ${publicVideoPath}`);

  console.log('\n🚀 Step 6: Cleaning up temporary capture assets...');
  fs.unlinkSync(rawWebmPath);
  fs.unlinkSync(rawMp4Path);
  fs.unlinkSync(clickPath);
  fs.unlinkSync(whooshPath);
  fs.rmdirSync(RAW_CAPTURE_DIR);

  console.log('\n🎉 Clean website walkthrough video compilation complete!');
  console.log(`📁 Final file: ${finalVideoPath}`);
}

run().catch((err) => {
  console.error('❌ Compilation failed:', err);
  process.exit(1);
});
