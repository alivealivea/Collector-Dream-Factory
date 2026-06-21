const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'output');
const VIDEO_PATH = path.join(OUTPUT_DIR, 'collector-dream-factory-promo.mp4');

// Construct the ffmpeg command
// We use a clean crossfade slideshow of 6 frames, 5 seconds each, totaling 30 seconds.
const ffmpegCommand = `ffmpeg -y \
-framerate 30 -loop 1 -t 5 -i "${path.join(OUTPUT_DIR, 'frame-01.png')}" \
-framerate 30 -loop 1 -t 5 -i "${path.join(OUTPUT_DIR, 'frame-02.png')}" \
-framerate 30 -loop 1 -t 5 -i "${path.join(OUTPUT_DIR, 'frame-03.png')}" \
-framerate 30 -loop 1 -t 5 -i "${path.join(OUTPUT_DIR, 'frame-04.png')}" \
-framerate 30 -loop 1 -t 5 -i "${path.join(OUTPUT_DIR, 'frame-05.png')}" \
-framerate 30 -loop 1 -t 5 -i "${path.join(OUTPUT_DIR, 'frame-06.png')}" \
-filter_complex "[0:v]fade=t=out:st=4.5:d=0.5[v0]; \
[1:v]fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v1]; \
[2:v]fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v2]; \
[3:v]fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v3]; \
[4:v]fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v4]; \
[5:v]fade=t=in:st=0:d=0.5[v5]; \
[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[v]" \
-map "[v]" -c:v libx264 -pix_fmt yuv420p -r 30 "${VIDEO_PATH}"`;

console.log('🎬 Starting video compilation with FFmpeg...');

exec(ffmpegCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ FFmpeg execution failed:', error);
    process.exit(1);
  }
  console.log('✓ Video output created successfully at:', VIDEO_PATH);
  console.log('🎉 Done compiling promotional video!');
});
