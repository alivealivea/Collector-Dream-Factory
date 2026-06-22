const playwright = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RENDERS_DIR = path.join(__dirname, 'renders');
const FRAMES_DIR = path.join(RENDERS_DIR, 'frames');

// Ensure directories exist
if (!fs.existsSync(RENDERS_DIR)) {
  fs.mkdirSync(RENDERS_DIR, { recursive: true });
}
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

async function run() {
  console.log('🚀 Step 1: Generating synthetic sound effects using FFmpeg...');
  
  const clickPath = path.join(RENDERS_DIR, 'click.wav');
  const popPath = path.join(RENDERS_DIR, 'pop.wav');
  const whooshPath = path.join(RENDERS_DIR, 'whoosh.wav');

  // Generate click: stereo, 1200Hz sine wave, 40ms duration with rapid decay
  console.log(' - Generating click.wav...');
  execSync(`ffmpeg -y -f lavfi -i "sine=frequency=1200:duration=0.04" -ac 2 -af "volume=0.8, afade=t=out:st=0.01:d=0.03" "${clickPath}"`, { stdio: 'ignore' });

  // Generate pop: stereo, 800Hz sine wave, 60ms duration with smooth decay
  console.log(' - Generating pop.wav...');
  execSync(`ffmpeg -y -f lavfi -i "sine=frequency=800:duration=0.06" -ac 2 -af "volume=0.6, afade=t=out:st=0.02:d=0.04" "${popPath}"`, { stdio: 'ignore' });

  // Generate whoosh: stereo, 300Hz sine wave, 250ms duration with fade in/out
  console.log(' - Generating whoosh.wav...');
  execSync(`ffmpeg -y -f lavfi -i "sine=frequency=300:duration=0.25" -ac 2 -af "volume=0.5, afade=t=in:st=0:d=0.1, afade=t=out:st=0.15:d=0.1" "${whooshPath}"`, { stdio: 'ignore' });

  console.log('✓ Sound effects generated successfully.');

  console.log('\n🚀 Step 2: Running Playwright to capture frames from GSAP timeline...');
  
  // Start a local HTTP server to serve index.html and its local assets
  const http = require('http');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    console.log('    [Server Request]:', req.url);
    
    // Rewrite requests coming from compiled subfolder to look in the root folder
    reqPath = reqPath.replace(/\/renders\/work-[a-f0-9-]+\/compiled\//, '/');
    
    if (reqPath === '/') {
      reqPath = '/index.html';
    }
    const filePath = path.join(__dirname, decodeURIComponent(reqPath));
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('    [Server 404]:', req.url, '-> tried:', filePath);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      
      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'text/html';
      if (ext === '.js') contentType = 'application/javascript';
      else if (ext === '.css') contentType = 'text/css';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.ttf') contentType = 'font/ttf';
      else if (ext === '.wav') contentType = 'audio/wav';
      else if (ext === '.mp3') contentType = 'audio/mpeg';
      
      let servedData = data;
      if (ext === '.html') {
        // Strip audio tags to prevent range-request hanging in headless browser
        let html = data.toString();
        html = html.replace(/<audio[^>]*>([\s\S]*?)<\/audio>/gi, '');
        // Hide captions / subtitles completely
        html = html.replace('</style>', '\n.caption-zone { display: none !important; }\n</style>');
        servedData = Buffer.from(html);
        console.log('    [Server info]: Stripped audio tags and hid captions from HTML');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(servedData);
    });
  });

  // Get a free port and start the server
  let serverClosed = false;
  const url = await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve(`http://127.0.0.1:${port}/`);
    });
  });
  console.log(` - Local server started at ${url}`);

  try {
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 2 // High resolution retinal scale
    });
    const page = await context.newPage();

    // Listen to browser console and page errors
    page.on('console', msg => console.log('  [Browser Log]:', msg.text()));
    page.on('pageerror', err => console.error('  [Browser Error]:', err));

    const targetUrl = `${url}renders/work-7e40153c-c443-4e32-b375-7c28d0bbfc4d/compiled/index.html`;
    console.log(` - Navigating browser to: ${targetUrl}`);
    await page.goto(targetUrl);

    console.log(' - Waiting 5 seconds for page load and GSAP timeline initialization...');
    await page.waitForTimeout(5000);
    
    const pageData = await page.evaluate(() => {
      return {
        hasGSAP: typeof gsap !== 'undefined',
        hasTimelines: typeof window.__timelines !== 'undefined',
        keys: window.__timelines ? Object.keys(window.__timelines) : []
      };
    });
    console.log(' - Browser State:', pageData);
    
    if (!pageData.hasTimelines || pageData.keys.indexOf('android18-anime-promo') === -1) {
      throw new Error(`GSAP Timeline 'android18-anime-promo' was not initialized. Browser state: ${JSON.stringify(pageData)}`);
    }
    await page.evaluate(() => document.fonts.ready);

    const duration = 30; // 30 seconds
    const fps = 30;
    const totalFrames = duration * fps; // 900 frames

    console.log(` - Capturing ${totalFrames + 1} frames frame-by-frame...`);
    
    // Clear any existing frames
    const files = fs.readdirSync(FRAMES_DIR);
    for (const file of files) {
      if (file.endsWith('.png')) {
        fs.unlinkSync(path.join(FRAMES_DIR, file));
      }
    }

    for (let frame = 0; frame <= totalFrames; frame++) {
      const time = frame / fps;
      
      // Seek the GSAP timeline on page to the exact time
      await page.evaluate((t) => {
        window.__timelines["android18-anime-promo"].seek(t);
      }, time);

      const frameFile = `frame-${String(frame).padStart(4, '0')}.png`;
      const framePath = path.join(FRAMES_DIR, frameFile);

      await page.screenshot({ path: framePath, type: 'png' });

      if (frame % 90 === 0) {
        console.log(`   [Progress] Captured ${frame}/${totalFrames} frames (${Math.round((frame/totalFrames)*100)}%)`);
      }
    }

    await browser.close();
    console.log('✓ All frames captured successfully.');

    console.log('\n🚀 Step 3: Compiling video-only file using FFmpeg...');
    const videoOnlyPath = path.join(RENDERS_DIR, 'video-only.mp4');
    
    // Stitch frames to mp4
    execSync(`ffmpeg -y -r ${fps} -f image2 -i "${path.join(FRAMES_DIR, 'frame-%04d.png')}" -c:v libx264 -pix_fmt yuv420p -r ${fps} "${videoOnlyPath}"`, { stdio: 'inherit' });
    console.log('✓ video-only.mp4 created.');

    console.log('\n🚀 Step 4: Mixing audio (Narration, BGM, and Sound Effects) using FFmpeg filter complex...');
    const narrationPath = path.join(__dirname, 'narration.wav');
    const soundbedPath = path.join(__dirname, 'sound-bed.wav');
    const finalVideoPath = path.join(RENDERS_DIR, 'android18-anime-promo-sfx.mp4');

    // Build audio filter complex with split/delay for multiple clicks, pops, and transitions
    const filterComplex = [
      // Split and delay clicks (8 clicks in total)
      `[3:a]asplit=8[c_in1][c_in2][c_in3][c_in4][c_in5][c_in6][c_in7][c_in8];`,
      `[c_in1]adelay=2150|2150[c1];`,
      `[c_in2]adelay=6350|6350[c2];`,
      `[c_in3]adelay=7800|7800[c3];`,
      `[c_in4]adelay=9300|9300[c4];`,
      `[c_in5]adelay=22100|22100[c5];`,
      `[c_in6]adelay=22650|22650[c6];`,
      `[c_in7]adelay=23200|23200[c7];`,
      `[c_in8]adelay=23750|23750[c8];`,
      
      // Split and delay pops (12 pops in total)
      `[4:a]asplit=12[p_in1][p_in2][p_in3][p_in4][p_in5][p_in6][p_in7][p_in8][p_in9][p_in10][p_in11][p_in12];`,
      `[p_in1]adelay=250|250[p1];`,
      `[p_in2]adelay=2950|2950[p2];`,
      `[p_in3]adelay=5950|5950[p3];`,
      `[p_in4]adelay=7600|7600[p4];`,
      `[p_in5]adelay=9100|9100[p5];`,
      `[p_in6]adelay=11420|11420[p6];`,
      `[p_in7]adelay=14350|14350[p7];`,
      `[p_in8]adelay=17200|17200[p8];`,
      `[p_in9]adelay=21400|21400[p9];`,
      `[p_in10]adelay=23800|23800[p10];`,
      `[p_in11]adelay=26320|26320[p11];`,
      `[p_in12]adelay=27800|27800[p12];`,

      // Split and delay whooshes (3 whooshes in total)
      `[5:a]asplit=3[w_in1][w_in2][w_in3];`,
      `[w_in1]adelay=5720|5720[w1];`,
      `[w_in2]adelay=14250|14250[w2];`,
      `[w_in3]adelay=21320|21320[w3];`,

      // Adjust volumes: narration slightly louder, BGM softer
      `[1:a]volume=1.2[vo];`,
      `[2:a]volume=0.35[bg];`,

      // Mix all 25 audio streams (narration, BGM, 8 clicks, 12 pops, 3 whooshes)
      `[vo][bg][c1][c2][c3][c4][c5][c6][c7][c8][p1][p2][p3][p4][p5][p6][p7][p8][p9][p10][p11][p12][w1][w2][w3]amix=inputs=25:normalize=0[a]`
    ].join('');

    const audioCmd = `ffmpeg -y -i "${videoOnlyPath}" -i "${narrationPath}" -i "${soundbedPath}" -i "${clickPath}" -i "${popPath}" -i "${whooshPath}" -filter_complex "${filterComplex}" -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 192k "${finalVideoPath}"`;
    
    execSync(audioCmd, { stdio: 'inherit' });
    console.log('✓ Final video with SFX created successfully.');

    console.log('\n🚀 Step 5: Cleaning up temporary assets...');
    
    // Clean frames
    console.log(' - Removing temporary frame screenshots...');
    const frameFiles = fs.readdirSync(FRAMES_DIR);
    for (const file of frameFiles) {
      fs.unlinkSync(path.join(FRAMES_DIR, file));
    }
    fs.rmdirSync(FRAMES_DIR);

    // Clean intermediate audio/video
    console.log(' - Removing intermediate media files...');
    fs.unlinkSync(videoOnlyPath);
    fs.unlinkSync(clickPath);
    fs.unlinkSync(popPath);
    fs.unlinkSync(whooshPath);

    console.log('\n🎉 Promotional video compilation complete!');
    console.log(`📁 File location: ${finalVideoPath}`);
  } finally {
    if (!serverClosed) {
      serverClosed = true;
      server.close();
      console.log(' - Local server stopped.');
    }
  }
}

run().catch((err) => {
  console.error('❌ Compilation failed:', err);
  process.exit(1);
});
