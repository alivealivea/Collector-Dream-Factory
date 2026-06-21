const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'output-v2');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Frame definitions with captions
const FRAMES = [
  { file: 'frame-01.png', caption: 'ถ้าตัวละครที่คุณรัก อยู่ในห้องคุณได้จริงล่ะ?' },
  { file: 'frame-02.png', caption: 'เลือกตัวละคร เลือกขนาด แล้วเห็นภาพในห้องจริงได้ทันที' },
  { file: 'frame-03.png', caption: 'ผลงานในฝัน สำหรับนักสะสมตัวจริง' },
  { file: 'frame-04.png', caption: 'เปลี่ยนจากรูปภาพสู่ของสะสมจริง' },
  { file: 'frame-05.png', caption: 'ส่งรูปอ้างอิงและขนาด แล้วขอประเมินราคาเพื่อผลิต' },
  { file: 'frame-06.png', caption: 'เริ่มสร้างของสะสมในฝันของคุณวันนี้' },
];

// Helper to generate a segment video for a single frame
function createSegment(index, frame, callback) {
  const inputPath = path.join(__dirname, 'output', frame.file);
  const segmentPath = path.join(OUTPUT_DIR, `segment${index}.mp4`);
  // Zoompan (gentle zoom) + kinetic drawtext (fade/slide)
  const vf = `zoompan=z='if(lte(zoom,1.2),zoom+0.0008,zoom)':d=125:x='if(lte(in,0),0,if(lte(zoom,1.2),x+0.8, x))':y='if(lte(in,0),0,if(lte(zoom,1.2),y+0.5, y))',drawtext=text='${frame.caption}':fontfile=/Windows/Fonts/arial.ttf:fontcolor=white:fontsize=58:box=1:boxcolor=0x00000099:boxborderw=10:x='(w-text_w)/2':y='if(gte(t,1), h-250-(t-0)*30, h-250)':enable='between(t,0,5)':alpha='if(lte(t,0.5),(t)/0.5,if(gte(t,4.5),(5-t)/0.5,1))'`;
  const cmd = `ffmpeg -y -loop 1 -t 5 -i "${inputPath}" -vf "${vf}" -c:v libx264 -pix_fmt yuv420p -r 30 "${segmentPath}"`;
  exec(cmd, (err) => {
    if (err) {
      console.error(`Segment ${index} failed:`, err);
      callback(err);
    } else {
      console.log(`Segment ${index} created.`);
      callback(null, segmentPath);
    }
  });
}

// Create all segments sequentially
function createAllSegments(frames, done) {
  const segmentPaths = [];
  let idx = 0;
  function next() {
    if (idx >= frames.length) {
      return done(null, segmentPaths);
    }
    createSegment(idx, frames[idx], (err, segPath) => {
      if (err) return done(err);
      segmentPaths.push(segPath);
      idx++;
      next();
    });
  }
  next();
}

// Concatenate segments using concat demuxer
function concatSegments(segmentPaths, outputPath, callback) {
  const listFile = path.join(OUTPUT_DIR, 'segments.txt');
  const listContent = segmentPaths.map(p => `file '${p.replace(/\\/g, '\\\\')}'`).join('\n');
  fs.writeFileSync(listFile, listContent);
  const cmd = `ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${outputPath}"`;
  exec(cmd, (err) => {
    if (err) {
      console.error('Concat failed:', err);
      callback(err);
    } else {
      console.log('Final video created at', outputPath);
      callback(null);
    }
  });
}

// Main execution flow
const finalVideo = path.join(OUTPUT_DIR, 'collector-dream-factory-promo-v2.mp4');
createAllSegments(FRAMES, (err, segmentPaths) => {
  if (err) process.exit(1);
  concatSegments(segmentPaths, finalVideo, (err) => {
    if (err) process.exit(1);
    console.log('✅ V2 promotional video generation complete.');
  });
});
