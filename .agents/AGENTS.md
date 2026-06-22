# Workspace Rules - Video Promotion Guidelines

These rules govern how to generate promotional video walkthroughs for **Collector Dream Factory** to prevent duplicate work, save tokens, and ensure high-quality custom videos.

---

## 🚫 What NOT to Do (แบบที่ไม่ควรทำ)

1. **Do NOT Re-Compile Static Slide Templates by Default**:
   * If the user requests a promo video showing "page transitions, scrolls, and clicks," do NOT simply re-compile the old GSAP template slide deck (`index.html`). This produces duplicate videos that are visually identical to previous versions, wasting resources and tokens.
2. **Do NOT Leave Unused Captions**:
   * If the user requests "no captions/subtitles" (ขอแต่ภาพ), do NOT just hide the text in the script while leaving empty boxes or executing caption functions. The captions must be completely hidden visually from the screen.
3. **Do NOT Mix Audio Without Timeline Sync**:
   * Do NOT overlay sound effects blindly. Timings must be calculated precisely down to the millisecond to match real screen clicks and scrolls.

---

## 🚀 Correct Workflow (แบบที่ควรทำ)

1. **Capture Actual Live Website Walkthroughs**:
   * Use Playwright's `recordVideo` feature in vertical HD (`1080x1920`) mobile view to record the **actual live website** (`https://collector-dream-factory.vercel.app/`).
   * Program realistic browser interactions:
     * **Smooth Scrolling**: Scroll pages down using step-wise loops or `requestAnimationFrame` to simulate a real human scroll.
     * **Interactions**: Click actual buttons (e.g., room preview character cards, scale buttons, navigation links) and allow enough wait time for pages/assets to load.
2. **Handle Caption-Free Requests Dynamically**:
   * If the user requests no captions/subtitles, inject a CSS rule `.caption-zone { display: none !important; }` into the served HTML on-the-fly, or programmatically disable caption overlays in the browser during screenshot/recording loops.
3. **Audio-Visual Synchronization (SFX)**:
   * Keep a precise log of the timestamps (in milliseconds) where clicks and transitions occur during the Playwright walkthrough.
   * Use FFmpeg's `filter_complex` with `asplit` and `adelay` to insert synthetic click (`click.wav`) and transition (`whoosh.wav`) sound effects at those exact timestamps.
4. **Volume Levels & Outputs**:
   * Set BGM (`sound-bed.wav`) to a soft volume (`0.35`) and voiceover narration (`narration.wav`) to a clear volume (`1.2`).
   * Trim the final output to exactly 30 seconds (`-t 30`) and copy it to the project root for easy user access.
