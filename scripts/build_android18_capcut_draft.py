import json
import math
import shutil
import subprocess
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(r"C:\Users\alive\OneDrive\เอกสาร\collector-dream-factory")
VIDEO_DIR = ROOT / "video-promo" / "android18-capcut-editable"
ASSET_DIR = VIDEO_DIR / "scene-assets"
PREVIEW_DIR = VIDEO_DIR / "preview"
CAPCUT_ROOT = Path(r"C:\Users\alive\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft")
SKELETON = CAPCUT_ROOT / "0612"
PROJECT_NAME = "CDF Android18 Voice2"
PROJECT_DIR = CAPCUT_ROOT / PROJECT_NAME
ROOT_META = CAPCUT_ROOT / "root_meta_info.json"
PYTHON_NOW = 1782100000000000

NARRATION = ROOT / "video-promo" / "android18-voice2" / "narration.mp3"
SOUNDBED = ROOT / "video-promo" / "android18-anime" / "sound-bed.wav"
FFMPEG = "ffmpeg"


@dataclass
class Scene:
    name: str
    duration: float
    file_name: str


SCENES: List[Scene] = [
    Scene("intro", 5.81, "scene-01-intro.png"),
    Scene("scale", 6.99, "scene-02-scale.png"),
    Scene("lifesize", 6.93, "scene-03-lifesize.png"),
    Scene("collection", 6.62, "scene-04-collection.png"),
    Scene("steps", 5.32, "scene-05-steps.png"),
    Scene("close", 6.21, "scene-06-close.png"),
]


def ensure_dirs() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    font_path = Path(r"C:\Windows\Fonts\leelawdb.ttf" if bold else r"C:\Windows\Fonts\LeelawUI.ttf")
    return ImageFont.truetype(str(font_path), size=size)


def hex_to_rgba(color: str, alpha: int = 255) -> Tuple[int, int, int, int]:
    color = color.lstrip("#")
    return tuple(int(color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def fit_cover(img: Image.Image, size: Tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    src_w, src_h = img.size
    scale = max(target_w / src_w, target_h / src_h)
    resized = img.resize((math.ceil(src_w * scale), math.ceil(src_h * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def round_mask(size: Tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def draw_text_block(draw: ImageDraw.ImageDraw, text: str, xy: Tuple[int, int], font: ImageFont.FreeTypeFont,
                    fill: Tuple[int, int, int, int], max_width: int, line_gap: int = 8) -> int:
    words = text.split(" ")
    lines = []
    current = ""
    for word in words:
      trial = word if not current else f"{current} {word}"
      bbox = draw.multiline_textbbox((0, 0), trial, font=font, spacing=line_gap)
      if bbox[2] - bbox[0] <= max_width:
          current = trial
      else:
          lines.append(current)
          current = word
    if current:
        lines.append(current)
    y = xy[1]
    for line in lines:
        draw.text((xy[0], y), line, font=font, fill=fill)
        bbox = draw.textbbox((xy[0], y), line, font=font)
        y = bbox[3] + line_gap
    return y


def card_shadow(size: Tuple[int, int], radius: int = 36) -> Image.Image:
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.rounded_rectangle((18, 18, size[0] - 18, size[1] - 18), radius=radius, fill=(72, 50, 24, 78))
    return shadow.filter(ImageFilter.GaussianBlur(18))


def add_phone_panel(base: Image.Image, shot_path: Path, box: Tuple[int, int, int, int]) -> None:
    panel_w = box[2] - box[0]
    panel_h = box[3] - box[1]
    shot = fit_cover(Image.open(shot_path).convert("RGB"), (panel_w, panel_h))
    shadow = card_shadow((panel_w + 80, panel_h + 80))
    base.alpha_composite(shadow, (box[0] - 40, box[1] - 30))
    panel = Image.new("RGBA", (panel_w, panel_h), (255, 255, 255, 255))
    panel_draw = ImageDraw.Draw(panel)
    panel_draw.rounded_rectangle((0, 0, panel_w - 1, panel_h - 1), radius=42, fill=(255, 255, 255, 255),
                                 outline=(214, 194, 170, 255), width=3)
    shot_rgba = shot.convert("RGBA")
    mask = round_mask((panel_w, panel_h), 42)
    shot_rgba.putalpha(mask)
    panel.alpha_composite(shot_rgba, (0, 0))
    base.alpha_composite(panel, (box[0], box[1]))


def add_host(base: Image.Image, host_path: Path, box: Tuple[int, int, int, int]) -> None:
    host = Image.open(host_path).convert("RGBA")
    host = fit_cover(host, (box[2] - box[0], box[3] - box[1]))
    shadow = host.copy().filter(ImageFilter.GaussianBlur(10))
    shadow = Image.new("RGBA", shadow.size, (72, 50, 24, 0)).paste(shadow)
    base.alpha_composite(host, (box[0], box[1]))


def create_scene_canvas() -> Image.Image:
    return Image.new("RGBA", (1080, 1920), hex_to_rgba("F7F3EE"))


def badge(draw: ImageDraw.ImageDraw, xy: Tuple[int, int], text: str) -> None:
    font = load_font(28, True)
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0] + 34
    h = bbox[3] - bbox[1] + 20
    draw.rounded_rectangle((xy[0], xy[1], xy[0] + w, xy[1] + h), radius=22, fill=hex_to_rgba("17130F"))
    draw.text((xy[0] + 17, xy[1] + 8), text, font=font, fill=hex_to_rgba("F7F3EE"))


def scene_intro() -> Path:
    base = create_scene_canvas()
    draw = ImageDraw.Draw(base)
    add_phone_panel(base, ROOT / "video-promo" / "android18-voice2" / "capture" / "screenshots" / "scroll-000.png",
                    (70, 260, 700, 1500))
    host = Image.open(ROOT / "video-promo" / "android18-voice2" / "assets" / "android-host-1.png").convert("RGBA")
    host = fit_cover(host, (410, 980))
    base.alpha_composite(host, (660, 760))
    badge(draw, (76, 84), "ANDROID 18 / WEBSITE INSPECTION")
    draw_text_block(draw, "ลองวางในห้อง ก่อนเถียงกันทีหลัง", (78, 150), load_font(64, True),
                    hex_to_rgba("17130F"), 850, 10)
    draw.ellipse((570, 980, 660, 1070), outline=hex_to_rgba("B9822B"), width=8)
    draw.ellipse((548, 958, 682, 1092), outline=hex_to_rgba("B9822B", 120), width=4)
    path = ASSET_DIR / "scene-01-intro.png"
    base.save(path)
    return path


def scene_scale() -> Path:
    bg = Image.open(ROOT / "video-promo" / "android18-voice2" / "capture" / "assets" / "premium-isometric-living-room-for-room-s.jpg").convert("RGB")
    base = fit_cover(bg, (1080, 1920)).convert("RGBA")
    overlay = Image.new("RGBA", base.size, (247, 243, 238, 62))
    base.alpha_composite(overlay)
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle((44, 1120, 1036, 1710), radius=42, fill=(255, 255, 255, 232), outline=(214, 194, 170, 255), width=3)
    badge(draw, (72, 84), "ROOM SCALE PREVIEW")
    draw_text_block(draw, "ขนาดใหญ่ขึ้น เหตุผลจะเริ่มน้อยลง", (76, 150), load_font(60, True),
                    hex_to_rgba("17130F"), 840, 10)
    host = Image.open(ROOT / "video-promo" / "android18-voice2" / "assets" / "android-host-2.png").convert("RGBA")
    host = fit_cover(host, (360, 820))
    base.alpha_composite(host, (650, 720))
    draw.rectangle((935, 720, 946, 1490), fill=hex_to_rgba("3AAFA9"))
    pills = [("30", False), ("60", False), ("100", False), ("170", True)]
    x = 90
    for label, active in pills:
        fill = hex_to_rgba("B9822B") if active else hex_to_rgba("F7F3EE")
        text_fill = hex_to_rgba("17130F") if active else hex_to_rgba("6D6258")
        draw.rounded_rectangle((x, 1588, x + 190, 1666), radius=38, fill=fill, outline=hex_to_rgba("D9C6AF"), width=3)
        font = load_font(34, True)
        bbox = draw.textbbox((0, 0), f"{label} cm", font=font)
        draw.text((x + (190 - (bbox[2]-bbox[0])) / 2, 1607), f"{label} cm", font=font, fill=text_fill)
        x += 220
    path = ASSET_DIR / "scene-02-scale.png"
    base.save(path)
    return path


def scene_lifesize() -> Path:
    photo = Image.open(ROOT / "video-promo" / "android18-voice2" / "capture" / "assets" / "life-size-android-18-collectible-display.jpg").convert("RGB")
    base = fit_cover(photo, (1080, 1920)).convert("RGBA")
    dark = Image.new("RGBA", base.size, (23, 19, 15, 55))
    base.alpha_composite(dark)
    draw = ImageDraw.Draw(base)
    badge(draw, (72, 86), "LIFE-SIZE MODE")
    draw.rounded_rectangle((70, 1320, 720, 1504), radius=28, fill=hex_to_rgba("F2B85C"), outline=hex_to_rgba("17130F"), width=6)
    draw_text_block(draw, "170 เซน? ไม่ต้องถามแล้วค่ะ", (98, 1360), load_font(46, True), hex_to_rgba("17130F"), 580, 8)
    draw.rounded_rectangle((72, 1518, 490, 1628), radius=20, fill=hex_to_rgba("17130F"))
    draw.text((100, 1546), "ฉันอยู่บ้านนี้", font=load_font(42, True), fill=hex_to_rgba("FFF1CE"))
    path = ASSET_DIR / "scene-03-lifesize.png"
    base.save(path)
    return path


def add_piece_card(base: Image.Image, img_path: Path, title: str, subtitle: str, pos: Tuple[int, int]) -> None:
    card = Image.new("RGBA", (286, 720), (255, 255, 255, 255))
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle((0, 0, 285, 719), radius=34, fill=(255, 255, 255, 255), outline=(214, 194, 170, 255), width=3)
    piece = fit_cover(Image.open(img_path).convert("RGB"), (286, 450)).convert("RGBA")
    mask = round_mask((286, 450), 34)
    piece.putalpha(mask)
    card.alpha_composite(piece, (0, 0))
    draw.text((22, 480), title, font=load_font(42, True), fill=hex_to_rgba("17130F"))
    draw_text_block(draw, subtitle, (22, 540), load_font(24, False), hex_to_rgba("6D6258"), 238, 6)
    shadow = card_shadow((340, 790), 34)
    base.alpha_composite(shadow, (pos[0] - 28, pos[1] - 18))
    base.alpha_composite(card, pos)


def scene_collection() -> Path:
    base = create_scene_canvas()
    draw = ImageDraw.Draw(base)
    badge(draw, (72, 84), "SELECT YOUR HERO PIECE")
    draw_text_block(draw, "เลือกตามรสนิยม และตามแรงต้านในบ้าน", (76, 148), load_font(60, True),
                    hex_to_rgba("17130F"), 890, 10)
    add_piece_card(base, ROOT / "video-promo" / "android18-voice2" / "capture" / "assets" / "akaza.jpg",
                   "Akaza", "ท่าใหญ่ รายละเอียดชัด พื้นที่ก็ชัดเหมือนกัน", (56, 520))
    add_piece_card(base, ROOT / "video-promo" / "android18-voice2" / "capture" / "assets" / "goku.jpg",
                   "Goku", "ความทรงจำวัยเด็ก ในขนาดที่ผู้ใหญ่ต้องคุยกัน", (396, 460))
    add_piece_card(base, ROOT / "video-promo" / "android18-voice2" / "capture" / "assets" / "r2-d2.jpg",
                   "R2-D2", "ไม่แกล้งทำเป็นเล็ก และไม่แอบอยู่มุมบ้าน", (736, 580))
    draw.rounded_rectangle((500, 1430, 1016, 1600), radius=28, fill=hex_to_rgba("17130F"))
    draw_text_block(draw, "ระดับความเข้าใจ ของคนที่บ้าน", (540, 1472), load_font(34, True),
                    hex_to_rgba("F7F3EE"), 430, 6)
    path = ASSET_DIR / "scene-04-collection.png"
    base.save(path)
    return path


def scene_steps() -> Path:
    base = create_scene_canvas()
    draw = ImageDraw.Draw(base)
    badge(draw, (72, 84), "HOW IT WORKS")
    draw_text_block(draw, "สั่งง่ายกว่า อธิบายว่าซื้อมาทำไม", (76, 148), load_font(58, True),
                    hex_to_rgba("17130F"), 900, 10)
    steps = [("01", "ส่งรูปอ้างอิง"), ("02", "เลือกขนาด"), ("03", "ขอประเมิน"), ("04", "วางมัดจำ")]
    positions = [(70, 480), (560, 480), (70, 910), (560, 910)]
    for (num, label), (x, y) in zip(steps, positions):
        draw.rounded_rectangle((x, y, x + 450, y + 320), radius=34, fill=(255, 255, 255, 255),
                               outline=(214, 194, 170, 255), width=3)
        draw.text((x + 36, y + 32), num, font=load_font(58, True), fill=hex_to_rgba("B9822B"))
        draw_text_block(draw, label, (x + 36, y + 120), load_font(40, True), hex_to_rgba("17130F"), 360, 8)
    draw.rounded_rectangle((222, 1356, 1010, 1515), radius=26, fill=hex_to_rgba("17130F"))
    draw_text_block(draw, "ง่ายกว่าการอธิบายว่า ซื้อมาทำไมค่ะ", (268, 1398), load_font(36, True),
                    hex_to_rgba("F7F3EE"), 690, 8)
    path = ASSET_DIR / "scene-05-steps.png"
    base.save(path)
    return path


def scene_close() -> Path:
    base = create_scene_canvas()
    draw = ImageDraw.Draw(base)
    photo = fit_cover(Image.open(ROOT / "video-promo" / "android18-voice2" / "assets" / "android-proof-final.jpg").convert("RGB"), (940, 1120)).convert("RGBA")
    mask = round_mask(photo.size, 40)
    photo.putalpha(mask)
    shadow = card_shadow((1020, 1180), 40)
    base.alpha_composite(shadow, (26, 120))
    base.alpha_composite(photo, (70, 150))
    badge(draw, (72, 1300), "CUSTOM COLLECTIBLE THAILAND")
    draw_text_block(draw, "Collector Dream Factory", (72, 1380), load_font(68, True),
                    hex_to_rgba("17130F"), 920, 10)
    draw.text((74, 1498), "collector-dream-factory.vercel.app", font=load_font(28, True), fill=hex_to_rgba("B9822B"))
    draw_text_block(draw, "ของสะสมในฝัน ที่อาจใหญ่กว่าพื้นที่ใช้สอยจริง", (72, 1560), load_font(38, True),
                    hex_to_rgba("17130F"), 880, 8)
    path = ASSET_DIR / "scene-06-close.png"
    base.save(path)
    return path


def build_scene_assets() -> List[Path]:
    return [
        scene_intro(),
        scene_scale(),
        scene_lifesize(),
        scene_collection(),
        scene_steps(),
        scene_close(),
    ]


def run(cmd: List[str]) -> None:
    subprocess.run(cmd, check=True)


def build_preview(scene_paths: List[Path]) -> Path:
    clips = []
    for scene, scene_path in zip(SCENES, scene_paths):
        clip_path = PREVIEW_DIR / f"{scene.name}.mp4"
        cmd = [
            FFMPEG, "-y",
            "-loop", "1",
            "-i", str(scene_path),
            "-t", f"{scene.duration:.2f}",
            "-vf", "scale=1080:1920,format=yuv420p",
            "-r", "30",
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "18",
            str(clip_path),
        ]
        run(cmd)
        clips.append(clip_path)
    concat_txt = PREVIEW_DIR / "concat.txt"
    concat_txt.write_text("\n".join(f"file '{clip.as_posix()}'" for clip in clips), encoding="utf-8")
    preview_path = VIDEO_DIR / "android18-capcut-preview.mp4"
    cmd = [
        FFMPEG, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_txt),
        "-i", str(NARRATION),
        "-stream_loop", "-1",
        "-i", str(SOUNDBED),
        "-filter_complex", "[2:a]atrim=0:37.88,volume=0.18[bg];[1:a]volume=1.1[vo];[vo][bg]amix=inputs=2:normalize=0,alimiter=limit=0.93[a]",
        "-map", "0:v:0",
        "-map", "[a]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", "37.88",
        str(preview_path),
    ]
    run(cmd)
    return preview_path


def uid() -> str:
    return str(uuid.uuid4()).upper()


def micros(seconds: float) -> int:
    return int(round(seconds * 1_000_000))


def build_draft_json(scene_paths: List[Path]) -> Tuple[dict, dict, dict]:
    timeline_id = uid()
    draft_id = uid()
    create_time = PYTHON_NOW

    video_track_id = uid()
    narration_track_id = uid()
    bgm_track_id = uid()

    segments = []
    video_materials = []
    scene_placeholders = []
    scene_speeds = []
    scene_canvases = []
    scene_material_colors = []
    offset = 0
    for scene, scene_path in zip(SCENES, scene_paths):
        material_id = uid()
        speed_id = uid()
        placeholder_id = uid()
        canvas_id = uid()
        color_id = uid()
        segment_id = uid()
        duration_us = micros(scene.duration)
        video_materials.append({
            "id": material_id,
            "unique_id": "",
            "type": "photo",
            "duration": 10800000000,
            "path": str(scene_path).replace("\\", "/"),
            "media_path": "",
            "local_id": "",
            "has_audio": False,
            "reverse_path": "",
            "intensifies_path": "",
            "reverse_intensifies_path": "",
            "intensifies_audio_path": "",
            "cartoon_path": "",
            "width": 1080,
            "height": 1920,
            "category_id": "",
            "category_name": "local",
            "material_id": "",
            "material_name": scene.file_name,
            "material_url": "",
            "crop": {
                "upper_left_x": 0.0, "upper_left_y": 0.0,
                "upper_right_x": 1.0, "upper_right_y": 0.0,
                "lower_left_x": 0.0, "lower_left_y": 1.0,
                "lower_right_x": 1.0, "lower_right_y": 1.0
            },
            "crop_ratio": "free",
            "audio_fade": None,
            "crop_scale": 1.0,
            "extra_type_option": 0,
            "stable": {"stable_level": 0, "matrix_path": "", "time_range": {"start": 0, "duration": 0}},
            "matting": {"flag": 0, "path": "", "interactiveTime": [], "has_use_quick_brush": False, "strokes": [],
                        "has_use_quick_eraser": False, "expansion": 0, "feather": 0, "reverse": False,
                        "custom_matting_id": "", "enable_matting_stroke": False, "is_clould": False,
                        "mask_video_path": "", "cloud_product_fps": 0.0},
            "source": 0,
            "source_platform": 0,
            "formula_id": "",
            "check_flag": 62978047,
            "video_algorithm": {
                "algorithms": [], "time_range": None, "path": "", "gameplay_configs": [],
                "ai_in_painting_config": [], "complement_frame_config": None, "motion_blur_config": None,
                "deflicker": None, "noise_reduction": None, "quality_enhance": None, "super_resolution": None,
                "ai_background_configs": [], "smart_complement_frame": None, "aigc_generate": None,
                "aigc_generate_list": [], "mouth_shape_driver": None, "ai_expression_driven": None,
                "ai_motion_driven": None, "image_interpretation": None,
                "story_video_modify_video_config": {"task_id": "", "is_overwrite_last_video": False, "tracker_task_id": "", "generate_id": "", "generate_card_id": ""},
                "skip_algorithm_index": []
            },
            "is_unified_beauty_mode": False,
            "is_set_beauty_mode": False,
            "object_locked": None,
            "smart_motion": None,
            "multi_camera_info": None,
            "freeze": None,
            "picture_from": "none",
            "picture_set_category_id": "",
            "picture_set_category_name": "",
            "team_id": "",
            "local_material_id": "",
            "origin_material_id": "",
            "request_id": "",
            "has_sound_separated": False,
            "is_text_edit_overdub": False,
            "is_ai_generate_content": False,
            "aigc_type": "none",
            "is_copyright": False,
            "aigc_history_id": "",
            "aigc_item_id": "",
            "local_material_from": "",
            "smart_match_info": None,
            "beauty_face_preset_infos": [],
            "beauty_body_preset_id": "",
            "beauty_face_auto_preset": {"preset_id": "", "name": "", "rate_map": "", "scene": ""},
            "beauty_face_auto_preset_infos": [],
            "beauty_body_auto_preset": None,
            "live_photo_timestamp": -1,
            "live_photo_cover_path": "",
            "content_feature_info": None,
            "corner_pin": None,
            "surface_trackings": [],
            "video_mask_stroke": {"resource_id": "", "path": "", "type": "", "color": "", "size": 0.0, "alpha": 0.0, "distance": 0.0, "texture": 0.0, "horizontal_shift": 0.0, "vertical_shift": 0.0},
            "video_mask_shadow": {"resource_id": "", "path": "", "color": "", "alpha": 0.0, "blur": 0.0, "distance": 0.0, "angle": 0.0}
        })
        segments.append({
            "id": segment_id,
            "source_timerange": {"start": 0, "duration": duration_us},
            "target_timerange": {"start": offset, "duration": duration_us},
            "render_timerange": {"start": 0, "duration": 0},
            "desc": "",
            "state": 0,
            "speed": 1.0,
            "is_loop": False,
            "is_tone_modify": False,
            "reverse": False,
            "intensifies_audio": False,
            "cartoon": False,
            "volume": 1.0,
            "last_nonzero_volume": 1.0,
            "clip": {
                "scale": {"x": 1.0, "y": 1.0},
                "rotation": 0.0,
                "transform": {"x": 0.0, "y": 0.0},
                "flip": {"vertical": False, "horizontal": False},
                "alpha": 1.0
            },
            "uniform_scale": {"on": True, "value": 1.0},
            "material_id": material_id,
            "extra_material_refs": [speed_id, placeholder_id, canvas_id, color_id],
            "render_index": 0,
            "keyframe_refs": [],
            "enable_lut": False,
            "enable_adjust": False,
            "enable_hsl": False,
            "visible": True,
            "group_id": "",
            "enable_color_curves": True,
            "enable_hsl_curves": True,
            "track_render_index": 0,
            "hdr_settings": {"mode": 1, "intensity": 1.0, "nits": 1000},
            "enable_color_wheels": True,
            "track_attribute": 0,
            "is_placeholder": False,
            "template_id": "",
            "enable_smart_color_adjust": False,
            "template_scene": "default",
            "common_keyframes": [],
            "caption_info": None,
            "responsive_layout": {"enable": False, "target_follow": "", "size_layout": 0, "horizontal_pos_layout": 0, "vertical_pos_layout": 0},
            "enable_color_match_adjust": False,
            "enable_color_correct_adjust": False,
            "enable_adjust_mask": False,
            "raw_segment_id": "",
            "lyric_keyframes": None,
            "enable_video_mask": True,
            "digital_human_template_group_id": "",
            "color_correct_alg_result": "",
            "source": "segmentsourcenormal",
            "enable_mask_stroke": False,
            "enable_mask_shadow": False,
            "enable_color_adjust_pro": False
        })
        scene_speeds.append({"id": speed_id, "type": "speed", "mode": 0, "speed": 1.0, "curve_speed": None})
        scene_placeholders.append({"id": placeholder_id, "type": "placeholder_info", "meta_type": "none", "res_path": "", "res_text": "", "error_path": "", "error_text": ""})
        scene_canvases.append({"id": canvas_id, "type": "canvas_color", "color": "", "blur": 0.0, "image": "", "album_image": "", "image_id": "", "image_name": "", "source_platform": 0, "team_id": ""})
        scene_material_colors.append({"id": color_id, "is_color_clip": False, "is_gradient": False, "solid_color": "", "gradient_colors": [], "gradient_percents": [], "gradient_angle": 90.0, "width": 0.0, "height": 0.0})
        offset += duration_us

    narration_material_id = uid()
    narration_speed_id = uid()
    narration_fade_id = uid()
    narration_placeholder_id = uid()
    narration_seg_id = uid()

    bgm_material_id = uid()
    bgm_speed_id = uid()
    bgm_fade_id = uid()
    bgm_beats_id = uid()
    bgm_placeholder_id = uid()
    bgm_seg_id = uid()

    total_duration = micros(sum(scene.duration for scene in SCENES))

    audios = [
        {
            "id": narration_material_id,
            "unique_id": "",
            "type": "extract_music",
            "name": NARRATION.name,
            "duration": total_duration,
            "path": str(NARRATION).replace("\\", "/"),
            "category_name": "local",
            "wave_points": [],
            "music_id": uid().lower(),
            "app_id": 0,
            "text_id": "",
            "tone_type": "",
            "source_platform": 0,
            "video_id": "",
            "effect_id": "",
            "resource_id": "",
            "third_resource_id": "",
            "category_id": "",
            "intensifies_path": "",
            "formula_id": "",
            "check_flag": 1,
            "team_id": "",
            "local_material_id": uid().lower(),
            "tone_speaker": "",
            "mock_tone_speaker": "",
            "tone_effect_id": "",
            "tone_effect_name": "",
            "tone_platform": "",
            "cloned_model_type": "",
            "tone_category_id": "",
            "tone_category_name": "",
            "tone_second_category_id": "",
            "tone_second_category_name": "",
            "tone_emotion_name_key": "",
            "tone_emotion_style": "",
            "tone_emotion_role": "",
            "tone_emotion_selection": "",
            "tone_emotion_scale": 0.0,
            "moyin_emotion": "",
            "request_id": "",
            "query": "",
            "search_id": "",
            "sound_separate_type": "",
            "is_text_edit_overdub": False,
            "is_ugc": False,
            "is_ai_clone_tone": False,
            "is_ai_clone_tone_post": False,
            "source_from": "",
            "copyright_limit_type": "none",
            "aigc_history_id": "",
            "aigc_item_id": "",
            "music_source": "",
            "pgc_id": "",
            "pgc_name": "",
            "similiar_music_info": {"original_song_id": "", "original_song_name": ""},
            "ai_music_type": 0,
            "ai_music_enter_from": "",
            "lyric_type": 0,
            "tts_task_id": "",
            "tts_generate_scene": "",
            "ai_music_generate_scene": 0,
            "tts_benefit_info": {"benefit_type": "none", "benefit_log_id": "", "benefit_log_extra": "", "benefit_amount": -1}
        },
        {
            "id": bgm_material_id,
            "unique_id": "",
            "type": "extract_music",
            "name": SOUNDBED.name,
            "duration": 30000000,
            "path": str(SOUNDBED).replace("\\", "/"),
            "category_name": "local",
            "wave_points": [],
            "music_id": uid().lower(),
            "app_id": 0,
            "text_id": "",
            "tone_type": "",
            "source_platform": 0,
            "video_id": "",
            "effect_id": "",
            "resource_id": "",
            "third_resource_id": "",
            "category_id": "",
            "intensifies_path": "",
            "formula_id": "",
            "check_flag": 1,
            "team_id": "",
            "local_material_id": uid().lower(),
            "tone_speaker": "",
            "mock_tone_speaker": "",
            "tone_effect_id": "",
            "tone_effect_name": "",
            "tone_platform": "",
            "cloned_model_type": "",
            "tone_category_id": "",
            "tone_category_name": "",
            "tone_second_category_id": "",
            "tone_second_category_name": "",
            "tone_emotion_name_key": "",
            "tone_emotion_style": "",
            "tone_emotion_role": "",
            "tone_emotion_selection": "",
            "tone_emotion_scale": 0.0,
            "moyin_emotion": "",
            "request_id": "",
            "query": "",
            "search_id": "",
            "sound_separate_type": "",
            "is_text_edit_overdub": False,
            "is_ugc": False,
            "is_ai_clone_tone": False,
            "is_ai_clone_tone_post": False,
            "source_from": "",
            "copyright_limit_type": "none",
            "aigc_history_id": "",
            "aigc_item_id": "",
            "music_source": "",
            "pgc_id": "",
            "pgc_name": "",
            "similiar_music_info": {"original_song_id": "", "original_song_name": ""},
            "ai_music_type": 0,
            "ai_music_enter_from": "",
            "lyric_type": 0,
            "tts_task_id": "",
            "tts_generate_scene": "",
            "ai_music_generate_scene": 0,
            "tts_benefit_info": {"benefit_type": "none", "benefit_log_id": "", "benefit_log_extra": "", "benefit_amount": -1}
        }
    ]

    draft_content = {
        "id": timeline_id,
        "version": 360000,
        "new_version": "173.0.0",
        "name": "",
        "duration": total_duration,
        "create_time": 0,
        "update_time": 0,
        "fps": 30.0,
        "is_drop_frame_timecode": False,
        "color_space": 0,
        "config": {
            "video_mute": False,
            "record_audio_last_index": 1,
            "extract_audio_last_index": 2,
            "original_sound_last_index": 1,
            "subtitle_recognition_id": "",
            "subtitle_taskinfo": [],
            "lyrics_recognition_id": "",
            "lyrics_taskinfo": [],
            "subtitle_sync": True,
            "lyrics_sync": True,
            "voice_change_sync": False,
            "sticker_max_index": 1,
            "adjust_max_index": 1,
            "material_save_mode": 0,
            "export_range": {"start": 0, "duration": total_duration},
            "maintrack_adsorb": False,
            "combination_max_index": 1,
            "attachment_info": [],
            "zoom_info_params": None,
            "system_font_list": [],
            "multi_language_mode": "none",
            "multi_language_main": "none",
            "multi_language_current": "none",
            "multi_language_list": [],
            "subtitle_keywords_config": None,
            "use_float_render": False
        },
        "canvas_config": {"ratio": "9:16", "width": 1080, "height": 1920, "background": None},
        "tracks": [
            {"id": video_track_id, "type": "video", "segments": segments, "flag": 0, "attribute": 0, "name": "", "is_default_name": True},
            {
                "id": narration_track_id,
                "type": "audio",
                "segments": [{
                    "id": narration_seg_id,
                    "source_timerange": {"start": 0, "duration": total_duration},
                    "target_timerange": {"start": 0, "duration": total_duration},
                    "render_timerange": {"start": 0, "duration": 0},
                    "desc": "",
                    "state": 0,
                    "speed": 1.0,
                    "is_loop": False,
                    "is_tone_modify": False,
                    "reverse": False,
                    "intensifies_audio": False,
                    "cartoon": False,
                    "volume": 1.0,
                    "last_nonzero_volume": 1.0,
                    "clip": None,
                    "uniform_scale": None,
                    "material_id": narration_material_id,
                    "extra_material_refs": [narration_speed_id, narration_fade_id, narration_placeholder_id],
                    "render_index": 0,
                    "keyframe_refs": [],
                    "enable_lut": False,
                    "enable_adjust": False,
                    "enable_hsl": False,
                    "visible": True,
                    "group_id": "",
                    "enable_color_curves": True,
                    "enable_hsl_curves": True,
                    "track_render_index": 1,
                    "hdr_settings": None,
                    "enable_color_wheels": True,
                    "track_attribute": 0,
                    "is_placeholder": False,
                    "template_id": "",
                    "enable_smart_color_adjust": False,
                    "template_scene": "default",
                    "common_keyframes": [],
                    "caption_info": None,
                    "responsive_layout": {"enable": False, "target_follow": "", "size_layout": 0, "horizontal_pos_layout": 0, "vertical_pos_layout": 0},
                    "enable_color_match_adjust": False,
                    "enable_color_correct_adjust": False,
                    "enable_adjust_mask": False,
                    "raw_segment_id": "",
                    "lyric_keyframes": None,
                    "enable_video_mask": True,
                    "digital_human_template_group_id": "",
                    "color_correct_alg_result": "",
                    "source": "segmentsourcenormal",
                    "enable_mask_stroke": False,
                    "enable_mask_shadow": False,
                    "enable_color_adjust_pro": False
                }],
                "flag": 0, "attribute": 0, "name": "", "is_default_name": True
            },
            {
                "id": bgm_track_id,
                "type": "audio",
                "segments": [{
                    "id": bgm_seg_id,
                    "source_timerange": {"start": 0, "duration": 30000000},
                    "target_timerange": {"start": 0, "duration": total_duration},
                    "render_timerange": {"start": 0, "duration": 0},
                    "desc": "",
                    "state": 0,
                    "speed": 0.7920792079207921,
                    "is_loop": False,
                    "is_tone_modify": False,
                    "reverse": False,
                    "intensifies_audio": False,
                    "cartoon": False,
                    "volume": 0.23,
                    "last_nonzero_volume": 0.23,
                    "clip": None,
                    "uniform_scale": None,
                    "material_id": bgm_material_id,
                    "extra_material_refs": [bgm_speed_id, bgm_fade_id, bgm_beats_id, bgm_placeholder_id],
                    "render_index": 0,
                    "keyframe_refs": [],
                    "enable_lut": False,
                    "enable_adjust": False,
                    "enable_hsl": False,
                    "visible": True,
                    "group_id": "",
                    "enable_color_curves": True,
                    "enable_hsl_curves": True,
                    "track_render_index": 2,
                    "hdr_settings": None,
                    "enable_color_wheels": True,
                    "track_attribute": 0,
                    "is_placeholder": False,
                    "template_id": "",
                    "enable_smart_color_adjust": False,
                    "template_scene": "default",
                    "common_keyframes": [],
                    "caption_info": None,
                    "responsive_layout": {"enable": False, "target_follow": "", "size_layout": 0, "horizontal_pos_layout": 0, "vertical_pos_layout": 0},
                    "enable_color_match_adjust": False,
                    "enable_color_correct_adjust": False,
                    "enable_adjust_mask": False,
                    "raw_segment_id": "",
                    "lyric_keyframes": None,
                    "enable_video_mask": True,
                    "digital_human_template_group_id": "",
                    "color_correct_alg_result": "",
                    "source": "segmentsourcenormal",
                    "enable_mask_stroke": False,
                    "enable_mask_shadow": False,
                    "enable_color_adjust_pro": False
                }],
                "flag": 0, "attribute": 0, "name": "", "is_default_name": True
            }
        ],
        "group_container": None,
        "materials": {
            "flowers": [],
            "videos": video_materials,
            "tail_leaders": [],
            "audios": audios,
            "images": [],
            "texts": [],
            "effects": [],
            "stickers": [],
            "canvases": scene_canvases,
            "transitions": [],
            "audio_effects": [],
            "audio_fades": [
                {"id": narration_fade_id, "type": "audio_fade", "fade_type": 0, "fade_in_duration": 0, "fade_out_duration": 0},
                {"id": bgm_fade_id, "type": "audio_fade", "fade_type": 0, "fade_in_duration": 1800000, "fade_out_duration": 2200000}
            ],
            "beats": [{"id": bgm_beats_id, "type": "beats", "enable_ai_beats": False, "gear": 404, "gear_count": 0, "mode": 404, "user_beats": [], "user_delete_ai_beats": None, "ai_beats": {"melody_url": "", "melody_path": "", "beats_url": "", "beats_path": "", "melody_percents": [0.0], "beat_speed_infos": []}}],
            "material_animations": [],
            "placeholders": [],
            "placeholder_infos": scene_placeholders + [
                {"id": narration_placeholder_id, "type": "placeholder_info", "meta_type": "none", "res_path": "", "res_text": "", "error_path": "", "error_text": ""},
                {"id": bgm_placeholder_id, "type": "placeholder_info", "meta_type": "none", "res_path": "", "res_text": "", "error_path": "", "error_text": ""}
            ],
            "speeds": [
                {"id": narration_speed_id, "type": "speed", "mode": 0, "speed": 1.0, "curve_speed": None},
                {"id": bgm_speed_id, "type": "speed", "mode": 0, "speed": 0.7920792079207921, "curve_speed": None},
            ] + scene_speeds,
            "common_mask": [],
            "chromas": [],
            "text_templates": [],
            "realtime_denoises": [],
            "audio_pannings": [],
            "audio_pitch_shifts": [],
            "video_trackings": [],
            "hsl": [],
            "drafts": [],
            "color_curves": [],
            "hsl_curves": [],
            "primary_color_wheels": [],
            "log_color_wheels": [],
            "video_effects": [],
            "audio_balances": [],
            "handwrites": [],
            "manual_deformations": [],
            "manual_beautys": [],
            "plugin_effects": [],
            "sound_channel_mappings": [],
            "green_screens": [],
            "shapes": [],
            "material_colors": scene_material_colors,
            "digital_humans": [],
            "digital_human_model_dressing": [],
            "smart_crops": [],
            "ai_translates": [],
            "audio_track_indexes": [],
            "loudnesses": [],
            "vocal_beautifys": [],
            "vocal_separations": [],
            "smart_relights": [],
            "time_marks": [],
            "multi_language_refs": [],
            "video_shadows": [],
            "video_strokes": [],
            "video_radius": []
        },
        "keyframes": {"videos": [], "audios": [], "texts": [], "stickers": [], "filters": [], "adjusts": [], "handwrites": [], "effects": []},
        "keyframe_graph_list": [],
        "platform": {"os": "windows", "os_version": "10.0.26200", "app_id": 359289, "app_version": "8.8.0", "app_source": "cc", "device_id": "8d57a7b58cdc24e12b69763153b56d22", "hard_disk_id": "2164845af2616fb4471926255e275967", "mac_address": "d5e2a334bb86e8173c54adcf6fe217ac"},
        "last_modified_platform": {"os": "windows", "os_version": "10.0.26200", "app_id": 359289, "app_version": "8.8.0", "app_source": "cc", "device_id": "8d57a7b58cdc24e12b69763153b56d22", "hard_disk_id": "2164845af2616fb4471926255e275967", "mac_address": "d5e2a334bb86e8173c54adcf6fe217ac"},
        "mutable_config": None,
        "cover": None,
        "retouch_cover": None,
        "extra_info": None,
        "relationships": [],
        "mixed_track_mode_on": False,
        "render_index_track_mode_on": True,
        "free_render_index_mode_on": False,
        "static_cover_image_path": "",
        "source": "default",
        "time_marks": None,
        "path": "",
        "lyrics_effects": [],
        "uneven_animation_template_info": {"composition": "", "content": "", "order": "", "sub_template_info_list": []},
        "draft_type": "video",
        "smart_ads_info": {"page_from": "", "routine": "", "draft_url": ""},
        "function_assistant_info": {"smart_rec_applied": False, "fixed_rec_applied": False, "auto_adjust": False, "auto_adjust_segid_list": [], "color_correction": False, "color_correction_segid_list": [], "enhance_quality": False, "smooth_slow_motion": False, "deflicker_segid_list": [], "video_noise_segid_list": [], "enhance_quality_segid_list": [], "smart_segid_list": [], "retouch": False, "retouch_segid_list": [], "enhande_voice": False, "enhance_voice_segid_list": [], "audio_noise_segid_list": [], "auto_caption": False, "auto_caption_segid_list": [], "auto_caption_template_id": "", "caption_opt": False, "caption_opt_segid_list": [], "eye_correction": False, "eye_correction_segid_list": [], "normalize_loudness": False, "normalize_loudness_segid_list": [], "normalize_loudness_audio_denoise_segid_list": [], "auto_adjust_fixed": False, "auto_adjust_fixed_value": 50.0, "color_correction_fixed": False, "color_correction_fixed_value": 50.0, "normalize_loudness_fixed": False, "enhande_voice_fixed": False, "retouch_fixed": False, "enhance_quality_fixed": False, "smooth_slow_motion_fixed": False, "fps": {"num": 0, "den": 1}}
    }

    draft_meta = {
        "cloud_draft_cover": False,
        "cloud_draft_sync": False,
        "cloud_package_completed_time": "",
        "draft_cloud_capcut_purchase_info": "",
        "draft_cloud_last_action_download": False,
        "draft_cloud_package_type": "",
        "draft_cloud_purchase_info": "",
        "draft_cloud_template_id": "",
        "draft_cloud_tutorial_info": "",
        "draft_cloud_videocut_purchase_info": "",
        "draft_cover": "draft_cover.jpg",
        "draft_deeplink_url": "",
        "draft_enterprise_info": {"draft_enterprise_extra": "", "draft_enterprise_id": "", "draft_enterprise_name": "", "enterprise_material": []},
        "draft_fold_path": str(PROJECT_DIR).replace("\\", "/"),
        "draft_id": draft_id,
        "draft_is_ae_produce": False,
        "draft_is_ai_packaging_used": False,
        "draft_is_ai_shorts": False,
        "draft_is_ai_translate": False,
        "draft_is_article_video_draft": False,
        "draft_is_cloud_temp_draft": False,
        "draft_is_from_deeplink": "false",
        "draft_is_invisible": False,
        "draft_is_pippit_draft": False,
        "draft_is_web_article_video": False,
        "draft_materials": [{"type": 0, "value": []}, {"type": 1, "value": []}, {"type": 2, "value": []}, {"type": 3, "value": []}, {"type": 6, "value": []}, {"type": 7, "value": []}, {"type": 8, "value": []}],
        "draft_materials_copied_info": [],
        "draft_name": PROJECT_NAME,
        "draft_need_rename_folder": False,
        "draft_new_version": "",
        "draft_removable_storage_device": "",
        "draft_root_path": str(CAPCUT_ROOT).replace("\\", "/"),
        "draft_segment_extra_info": [],
        "draft_timeline_materials_size_": sum(path.stat().st_size for path in scene_paths) + NARRATION.stat().st_size + SOUNDBED.stat().st_size,
        "draft_type": "",
        "draft_web_article_video_enter_from": "",
        "pippit_avatar_url": "",
        "pippit_extra_info": "",
        "pippit_id": "",
        "pippit_user_name": "",
        "tm_draft_cloud_completed": "",
        "tm_draft_cloud_entry_id": -1,
        "tm_draft_cloud_modified": 0,
        "tm_draft_cloud_parent_entry_id": -1,
        "tm_draft_cloud_space_id": -1,
        "tm_draft_cloud_user_id": -1,
        "tm_draft_create": create_time,
        "tm_draft_modified": create_time,
        "tm_draft_removed": 0,
        "tm_duration": total_duration
    }

    timeline_layout = {
        "config": {"color_space": -1, "render_index_track_mode_on": False, "use_float_render": False},
        "create_time": create_time,
        "id": uid(),
        "main_timeline_id": timeline_id,
        "timelines": [{"create_time": create_time, "id": timeline_id, "is_marked_delete": False, "name": "Timeline 01", "update_time": create_time}],
        "update_time": create_time,
        "version": 0
    }

    return draft_meta, draft_content, timeline_layout


def register_in_root_meta(meta: dict) -> None:
    root_meta = json.loads(ROOT_META.read_text(encoding="utf-8"))
    draft_store = root_meta.get("all_draft_store", [])
    draft_store = [item for item in draft_store if item.get("draft_name") != PROJECT_NAME]
    draft_store.insert(0, {
        "cloud_draft_cover": False,
        "cloud_draft_sync": False,
        "draft_cloud_last_action_download": False,
        "draft_cloud_purchase_info": "",
        "draft_cloud_template_id": "",
        "draft_cloud_tutorial_info": "",
        "draft_cloud_videocut_purchase_info": "",
        "draft_cover": f"{PROJECT_DIR.as_posix()}/draft_cover.jpg",
        "draft_fold_path": PROJECT_DIR.as_posix(),
        "draft_id": meta["draft_id"],
        "draft_is_ai_shorts": False,
        "draft_is_cloud_temp_draft": False,
        "draft_is_invisible": False,
        "draft_is_pippit_draft": False,
        "draft_is_web_article_video": False,
        "draft_json_file": f"{PROJECT_DIR.as_posix()}/draft_content.json",
        "draft_name": PROJECT_NAME,
        "draft_new_version": "",
        "draft_root_path": CAPCUT_ROOT.as_posix(),
        "draft_timeline_materials_size": meta["draft_timeline_materials_size_"],
        "draft_type": "",
        "draft_web_article_video_enter_from": "",
        "pippit_avatar_url": "",
        "pippit_extra_info": "",
        "pippit_id": "",
        "pippit_user_name": "",
        "streaming_edit_draft_ready": True,
        "tm_draft_cloud_completed": "",
        "tm_draft_cloud_entry_id": -1,
        "tm_draft_cloud_modified": 0,
        "tm_draft_cloud_parent_entry_id": -1,
        "tm_draft_cloud_space_id": -1,
        "tm_draft_cloud_user_id": -1,
        "tm_draft_create": meta["tm_draft_create"],
        "tm_draft_modified": meta["tm_draft_modified"],
        "tm_draft_removed": 0,
        "tm_duration": meta["tm_duration"]
    })
    root_meta["all_draft_store"] = draft_store
    root_meta["draft_ids"] = len(draft_store)
    ROOT_META.write_text(json.dumps(root_meta, ensure_ascii=False), encoding="utf-8")


def build_capcut_draft(scene_paths: List[Path]) -> Path:
    if PROJECT_DIR.exists():
        shutil.rmtree(PROJECT_DIR)
    shutil.copytree(SKELETON, PROJECT_DIR)
    draft_meta, draft_content, timeline_layout = build_draft_json(scene_paths)
    (PROJECT_DIR / "draft_meta_info.json").write_text(json.dumps(draft_meta, ensure_ascii=False), encoding="utf-8")
    (PROJECT_DIR / "draft_content.json").write_text(json.dumps(draft_content, ensure_ascii=False), encoding="utf-8")
    (PROJECT_DIR / "Timelines" / "project.json").write_text(json.dumps(timeline_layout, ensure_ascii=False), encoding="utf-8")
    shutil.copy2(scene_paths[-1], PROJECT_DIR / "draft_cover.jpg")
    register_in_root_meta(draft_meta)
    return PROJECT_DIR


def write_note(scene_paths: List[Path], preview_path: Path, draft_path: Path) -> None:
    lines = [
        f"# {PROJECT_NAME}",
        "",
        f"- Preview MP4: {preview_path}",
        f"- CapCut Draft: {draft_path}",
        f"- Narration: {NARRATION}",
        "",
        "## Scene Timing",
        "",
    ]
    for scene, scene_path in zip(SCENES, scene_paths):
        lines.append(f"- {scene.name}: {scene.duration:.2f}s -> {scene_path}")
    (VIDEO_DIR / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    ensure_dirs()
    scene_paths = build_scene_assets()
    preview_path = build_preview(scene_paths)
    draft_path = build_capcut_draft(scene_paths)
    write_note(scene_paths, preview_path, draft_path)
    print(preview_path)
    print(draft_path)


if __name__ == "__main__":
    main()
