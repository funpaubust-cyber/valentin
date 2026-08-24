"""Replace white studio backgrounds with a shared Valentin showcase backdrop."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageFilter
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "public" / "images" / "catalog"
BG_PATH = CATALOG / "_showcase-bg.png"
BACKUP = CATALOG / "_original"
OUT_W, OUT_H = 1200, 1600

# Skip these folders / files
SKIP_NAMES = {"_original", "_showcase-bg.png", "_showcase-bg.jpg"}


def is_white_studio(img: Image.Image, sample: int = 36) -> bool:
    """True for cutout-style product shots (white / milk studio fill)."""
    rgb = img.convert("RGB").resize((sample, sample), Image.Resampling.BILINEAR)
    pixels = list(rgb.getdata())
    near_white = 0
    bright = 0
    for r, g, b in pixels:
        if min(r, g, b) > 210 and max(r, g, b) - min(r, g, b) < 18:
            near_white += 1
        if (r + g + b) / 3 > 200:
            bright += 1
    n = max(1, len(pixels))
    # Kitchen room shots are darker / more colorful → skip.
    return near_white / n >= 0.28 or bright / n >= 0.55


def fit_product(cutout: Image.Image) -> Image.Image:
    """Scale product into showcase frame with padding."""
    cutout = cutout.convert("RGBA")
    # Trim transparent margins a bit for nicer placement
    bbox = cutout.getbbox()
    if bbox:
        cutout = cutout.crop(bbox)

    max_w = int(OUT_W * 0.86)
    max_h = int(OUT_H * 0.78)
    cutout.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    x = (OUT_W - cutout.width) // 2
    # Sit slightly above the wood floor (lower third of backdrop)
    y = int(OUT_H * 0.58) - cutout.height // 2
    y = max(int(OUT_H * 0.08), min(y, OUT_H - cutout.height - int(OUT_H * 0.06)))
    canvas.paste(cutout, (x, y), cutout)
    return canvas


def soft_shadow(alpha_src: Image.Image) -> Image.Image:
    a = alpha_src.split()[-1]
    shadow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    shade = Image.new("L", (OUT_W, OUT_H), 0)
    # Offset down a bit
    shade.paste(a, (0, 18))
    shade = shade.filter(ImageFilter.GaussianBlur(28))
    shade = shade.point(lambda v: int(v * 0.28))
    shadow.putalpha(shade)
    return shadow


def process_one(src: Path, bg: Image.Image) -> bool:
    img = Image.open(src)
    if not is_white_studio(img):
        return False

    rel = src.relative_to(CATALOG)
    backup_path = BACKUP / rel
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    if not backup_path.exists():
        shutil.copy2(src, backup_path)

    cut = remove(img.convert("RGBA"))
    product = fit_product(cut)
    shadow = soft_shadow(product)

    frame = bg.copy()
    frame.alpha_composite(shadow)
    frame.alpha_composite(product)

    # Keep jpg for site paths
    out = frame.convert("RGB")
    out.save(src, quality=90, optimize=True)
    return True


def main() -> None:
    if not BG_PATH.exists():
        raise SystemExit(f"Missing backdrop: {BG_PATH}")

    bg = Image.open(BG_PATH).convert("RGBA").resize((OUT_W, OUT_H), Image.Resampling.LANCZOS)
    files = sorted(
        p
        for p in CATALOG.rglob("*")
        if p.is_file()
        and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        and "_original" not in p.parts
        and p.name not in SKIP_NAMES
        and not p.name.startswith("_")
    )

    changed = 0
    skipped = 0
    for i, path in enumerate(files, 1):
        try:
            ok = process_one(path, bg)
            if ok:
                changed += 1
                print(f"[{i}/{len(files)}] OK  {path.relative_to(CATALOG)}")
            else:
                skipped += 1
                print(f"[{i}/{len(files)}] skip (not white studio) {path.relative_to(CATALOG)}")
        except Exception as exc:  # noqa: BLE001
            print(f"[{i}/{len(files)}] FAIL {path}: {exc}")

    print(f"Done. changed={changed} skipped={skipped} total={len(files)}")


if __name__ == "__main__":
    main()
