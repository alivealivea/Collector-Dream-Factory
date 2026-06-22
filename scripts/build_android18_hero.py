import subprocess
from pathlib import Path


ROOT = Path(r"C:\Users\alive\OneDrive\เอกสาร\collector-dream-factory")
SCENE_DIR = ROOT / "video-promo" / "android18-capcut-editable" / "scene-assets"
OUT_DIR = ROOT / "video-promo" / "android18-hero"
TMP_DIR = OUT_DIR / "temp"
FFMPEG = "ffmpeg"

NARRATION = ROOT / "video-promo" / "android18-voice2" / "narration.mp3"
SOUNDBED = ROOT / "video-promo" / "android18-anime" / "sound-bed.wav"

SCENES = [
    ("scene-01-intro.png", 6.26, "min(zoom+0.00055,1.11)", "iw/2-(iw/zoom/2)+sin(on/18)*20", "ih/2-(ih/zoom/2)-on*0.10"),
    ("scene-02-scale.png", 7.44, "if(lte(on,120),1+on*0.00095,1.114-(on-120)*0.00018)", "iw/2-(iw/zoom/2)-on*0.18", "ih/2-(ih/zoom/2)+sin(on/10)*8"),
    ("scene-03-lifesize.png", 7.38, "if(lte(on,24),1+on*0.003,1.072+0.015*sin(on/3))", "iw/2-(iw/zoom/2)+18*sin(on/1.5)", "ih/2-(ih/zoom/2)+12*sin(on/1.9)"),
    ("scene-04-collection.png", 7.07, "min(zoom+0.00045,1.09)", "iw/2-(iw/zoom/2)-on*0.32", "ih/2-(ih/zoom/2)+sin(on/12)*10"),
    ("scene-05-steps.png", 5.77, "1.02+0.018*sin(on/9)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)+6*sin(on/8)"),
    ("scene-06-close.png", 6.21, "min(zoom+0.00038,1.08)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)-on*0.06"),
]

TRANSITION = 0.45


def run(cmd):
    subprocess.run(cmd, check=True)


def ensure_dirs():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)


def render_scene_clip(name, duration, z_expr, x_expr, y_expr):
    src = SCENE_DIR / name
    dst = TMP_DIR / f"{Path(name).stem}.mp4"
    frames = int(duration * 30)
    fade_in = "fade=t=in:st=0:d=0.18,"
    fade_out = f"fade=t=out:st={max(duration - 0.22, 0):.2f}:d=0.22,"
    vf = (
        f"zoompan=z='{z_expr}':x='{x_expr}':y='{y_expr}':d={frames}:s=1080x1920:fps=30,"
        f"{fade_in}{fade_out}"
        f"eq=contrast=1.04:saturation=1.06:brightness=0.015,"
        f"unsharp=5:5:0.5:5:5:0.0,"
        f"vignette=PI/5"
    )
    cmd = [
        FFMPEG, "-y",
        "-loop", "1",
        "-i", str(src),
        "-t", f"{duration:.2f}",
        "-vf", vf,
        "-r", "30",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "16",
        "-pix_fmt", "yuv420p",
        str(dst),
    ]
    run(cmd)
    return dst


def build_video(clips):
    concat_txt = TMP_DIR / "hero_concat.txt"
    concat_txt.write_text("\n".join(f"file '{clip.as_posix()}'" for clip in clips), encoding="utf-8")
    concat_base = TMP_DIR / "hero_concat.mp4"
    run([
        FFMPEG, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_txt),
        "-c", "copy",
        str(concat_base),
    ])

    out = TMP_DIR / "hero_video.mp4"
    hero_fx = (
        f"[0:v]split[base][fx];"
        f"[fx]crop=1040:1860:'20+10*sin(60*t)*between(t,12.75,14.20)':'30+14*sin(54*t)*between(t,12.75,14.20)',"
        f"scale=1080:1920,"
        f"drawbox=x=0:y=0:w=iw:h=ih:color=white@0.10:t=fill:enable='between(t,12.88,13.00)+between(t,13.06,13.12)',"
        f"drawbox=x=0:y=0:w=iw:h=ih:color=#17130F@0.14:t=fill:enable='between(t,19.55,19.80)',"
        f"noise=alls=8:allf=t+u:enable='between(t,12.75,14.10)+between(t,19.70,20.10)'[fx2];"
        f"[base][fx2]blend=all_mode=normal:all_opacity=1[hero]"
    )
    cmd = [
        FFMPEG, "-y",
        "-i", str(concat_base),
        "-filter_complex", hero_fx,
        "-map", "[hero]",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "15",
        "-pix_fmt", "yuv420p",
        str(out),
    ]
    run(cmd)
    return out


def generate_sfx():
    click = TMP_DIR / "click.wav"
    pop = TMP_DIR / "pop.wav"
    whoosh = TMP_DIR / "whoosh.wav"
    run([FFMPEG, "-y", "-f", "lavfi", "-i", "sine=frequency=1220:duration=0.04", "-ac", "2", "-af", "volume=0.75,afade=t=out:st=0.01:d=0.03", str(click)])
    run([FFMPEG, "-y", "-f", "lavfi", "-i", "sine=frequency=840:duration=0.07", "-ac", "2", "-af", "volume=0.60,afade=t=out:st=0.03:d=0.04", str(pop)])
    run([FFMPEG, "-y", "-f", "lavfi", "-i", "sine=frequency=290:duration=0.25", "-ac", "2", "-af", "volume=0.48,afade=t=in:st=0:d=0.08,afade=t=out:st=0.15:d=0.10", str(whoosh)])
    return click, pop, whoosh


def build_final(video_only, click, pop, whoosh):
    out = OUT_DIR / "android18-hero.mp4"
    filter_complex = (
        "[1:a]volume=1.12[vo];"
        "[2:a]atrim=0:37.88,volume=0.22[bg];"
        "[3:a]asplit=6[c1i][c2i][c3i][c4i][c5i][c6i];"
        "[c1i]adelay=2240|2240[c1];"
        "[c2i]adelay=6470|6470[c2];"
        "[c3i]adelay=10820|10820[c3];"
        "[c4i]adelay=20140|20140[c4];"
        "[c5i]adelay=27080|27080[c5];"
        "[c6i]adelay=31420|31420[c6];"
        "[4:a]asplit=5[p1i][p2i][p3i][p4i][p5i];"
        "[p1i]adelay=3100|3100[p1];"
        "[p2i]adelay=12430|12430[p2];"
        "[p3i]adelay=17180|17180[p3];"
        "[p4i]adelay=29400|29400[p4];"
        "[p5i]adelay=35120|35120[p5];"
        "[5:a]asplit=4[w1i][w2i][w3i][w4i];"
        "[w1i]adelay=5600|5600[w1];"
        "[w2i]adelay=12480|12480[w2];"
        "[w3i]adelay=19690|19690[w3];"
        "[w4i]adelay=31450|31450[w4];"
        "[vo][bg][c1][c2][c3][c4][c5][c6][p1][p2][p3][p4][p5][w1][w2][w3][w4]amix=inputs=17:normalize=0,alimiter=limit=0.93[a]"
    )
    cmd = [
        FFMPEG, "-y",
        "-i", str(video_only),
        "-i", str(NARRATION),
        "-stream_loop", "-1", "-i", str(SOUNDBED),
        "-i", str(click),
        "-i", str(pop),
        "-i", str(whoosh),
        "-filter_complex", filter_complex,
        "-map", "0:v:0",
        "-map", "[a]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", "37.88",
        str(out),
    ]
    run(cmd)
    return out


def main():
    ensure_dirs()
    clips = [render_scene_clip(*scene) for scene in SCENES]
    hero_video = build_video(clips)
    click, pop, whoosh = generate_sfx()
    final = build_final(hero_video, click, pop, whoosh)
    print(final)


if __name__ == "__main__":
    main()
