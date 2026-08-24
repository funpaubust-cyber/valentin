"""Studio plates for cutouts; multi-crop for full room photos."""
from __future__ import annotations

import math
import re
import shutil
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "public" / "images" / "catalog"
PRODUCTS_TS = ROOT / "src" / "data" / "products.ts"
BACKDROP = ROOT / "public" / "images" / "real" / "studio-backdrop-gray.png"

W, H = 1200, 1600
FLOOR_Y = int(H * 0.76)

VARIANTS = [
    {"suffix": "0", "scale": 1.0, "x_shift": 0.0, "skew": 0.0, "brightness": 1.0, "crop": 0.0},
    {"suffix": "1", "scale": 0.95, "x_shift": -0.035, "skew": 0.04, "brightness": 1.02, "crop": 0.06},
    {"suffix": "2", "scale": 0.97, "x_shift": 0.04, "skew": -0.035, "brightness": 0.98, "crop": 0.08},
]


def load_backdrop() -> Image.Image:
    if BACKDROP.exists():
        return Image.open(BACKDROP).convert("RGB")
    # assets fallback
    alt = Path.home() / ".cursor/projects/c-Users-ransomeware-Projects-valentin/assets/studio-backdrop-gray.png"
    if alt.exists():
        shutil.copy2(alt, BACKDROP)
        return Image.open(BACKDROP).convert("RGB")
    raise FileNotFoundError("studio backdrop missing")


def source_file(folder: Path) -> Path:
    for name in (
        "0.source-backup.png",
        "0.source-backup.jpg",
        "0.png",
        "0.jpg",
    ):
        p = folder / name
        if p.exists():
            return p
    raise FileNotFoundError(folder)


def is_cutout(src: Path, im: Image.Image) -> bool:
    if src.suffix.lower() == ".png" or src.name.endswith(".png"):
        if im.mode == "RGBA":
            alpha = im.split()[-1]
            # meaningful transparency
            extrema = alpha.getextrema()
            return extrema[0] < 200
    return False


def trim_alpha(im: Image.Image, pad: int = 4) -> Image.Image:
    bbox = im.split()[-1].getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    return im.crop(
        (
            max(0, l - pad),
            max(0, t - pad),
            min(im.width, r + pad),
            min(im.height, b + pad),
        )
    )


def clean_cutout(im: Image.Image) -> Image.Image:
    """Slightly contract alpha to kill white fringes."""
    r, g, b, a = im.split()
    a = a.filter(ImageFilter.MinFilter(3))
    a = a.filter(ImageFilter.GaussianBlur(0.6))
    return Image.merge("RGBA", (r, g, b, a))


def place_cutout(
    backdrop: Image.Image,
    product: Image.Image,
    *,
    scale: float,
    x_shift: float,
    skew: float,
    brightness: float,
) -> Image.Image:
    canvas = backdrop.resize((W, H), Image.Resampling.LANCZOS).convert("RGBA")
    prod = product.copy()
    if abs(skew) > 0.001:
        w, h = prod.size
        dx = int(w * skew)
        prod = prod.transform(
            (w + abs(dx), h),
            Image.Transform.AFFINE,
            (1, skew, -dx if dx > 0 else 0, 0, 1, 0),
            resample=Image.Resampling.BICUBIC,
        )

    max_w = int(W * 0.82 * scale)
    max_h = int(H * 0.62 * scale)
    prod.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)

    if brightness != 1:
        rgb = ImageEnhance.Brightness(prod.convert("RGB")).enhance(brightness)
        prod = Image.merge("RGBA", (*rgb.split(), prod.split()[-1]))

    # contact shadow
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sw = int(prod.width * 0.9)
    sh = max(22, int(prod.height * 0.07))
    blob = Image.new("L", (sw, sh), 0)
    bp = blob.load()
    for y in range(sh):
        for x in range(sw):
            nx = (x / max(1, sw - 1) - 0.5) * 2
            ny = (y / max(1, sh - 1) - 0.5) * 2
            bp[x, y] = int(math.exp(-(nx * nx * 2.4 + ny * ny * 5.0)) * 130)
    blob = blob.filter(ImageFilter.GaussianBlur(10))
    sx = int((W - sw) / 2 + x_shift * W)
    sy = FLOOR_Y - sh // 2
    shadow.paste(Image.merge("RGBA", (Image.new("L", blob.size, 0),) * 3 + (blob,)), (sx, sy))
    canvas = Image.alpha_composite(canvas, shadow)

    px = int((W - prod.width) / 2 + x_shift * W)
    py = FLOOR_Y - prod.height + 3
    canvas.alpha_composite(prod, (max(0, px), max(0, min(py, H - prod.height))))
    return canvas.convert("RGB")


def multi_crop(src: Image.Image, crop: float) -> Image.Image:
    """Zoomed crop → 3:4 plate (room photos stay photoreal)."""
    im = src.convert("RGB")
    target_ratio = W / H
    w, h = im.size
    # center crop to 3:4 first
    if w / h > target_ratio:
        nw = int(h * target_ratio)
        left = (w - nw) // 2
        im = im.crop((left, 0, left + nw, h))
    else:
        nh = int(w / target_ratio)
        top = (h - nh) // 2
        im = im.crop((0, top, w, top + nh))

    if crop > 0:
        w, h = im.size
        dx = int(w * crop / 2)
        dy = int(h * crop / 2)
        # slight pan for variety
        pan = int(w * crop * 0.35)
        im = im.crop((dx + pan, dy, w - dx + pan, h - dy))

    return im.resize((W, H), Image.Resampling.LANCZOS)


def process_folder(folder: Path, backdrop: Image.Image) -> list[str]:
    if not folder.name.isdigit():
        return []
    src = source_file(folder)
    raw = Image.open(src)
    cutout = is_cutout(src, raw.convert("RGBA") if raw.mode in ("RGBA", "LA", "P") else raw.convert("RGB"))

    # backup originals once
    if src.name == "0.png" and not (folder / "0.source-backup.png").exists():
        shutil.copy2(src, folder / "0.source-backup.png")
    if src.name == "0.jpg" and not (folder / "0.source-backup.jpg").exists():
        shutil.copy2(src, folder / "0.source-backup.jpg")

    out_rel: list[str] = []
    if cutout:
        rgba = clean_cutout(trim_alpha(raw.convert("RGBA")))
        for v in VARIANTS:
            shot = place_cutout(
                backdrop,
                rgba,
                scale=v["scale"],
                x_shift=v["x_shift"],
                skew=v["skew"],
                brightness=v["brightness"],
            )
            dest = folder / f'{v["suffix"]}.jpg'
            shot.save(dest, "JPEG", quality=90, optimize=True)
            out_rel.append(f"/images/catalog/{folder.name}/{v['suffix']}.jpg")
    else:
        base = Image.open(src).convert("RGB")
        for v in VARIANTS:
            shot = multi_crop(base, v["crop"])
            if v["suffix"] == "1":
                shot = ImageEnhance.Brightness(shot).enhance(1.03)
            if v["suffix"] == "2":
                shot = ImageEnhance.Contrast(shot).enhance(1.04)
            dest = folder / f'{v["suffix"]}.jpg'
            shot.save(dest, "JPEG", quality=90, optimize=True)
            out_rel.append(f"/images/catalog/{folder.name}/{v['suffix']}.jpg")
    return out_rel


def rewrite_products_ts(mapping: dict[str, list[str]]) -> None:
    text = PRODUCTS_TS.read_text(encoding="utf-8")
    parts = re.split(r'(\{\s*"id":)', text)
    out = [parts[0]]
    i = 1
    while i < len(parts):
        chunk = parts[i] + parts[i + 1]
        fm = re.search(r"/images/catalog/(\d+)/", chunk)
        if fm and fm.group(1) in mapping:
            paths = mapping[fm.group(1)]
            imgs = ",\n      ".join(f'"{p}"' for p in paths)
            chunk = re.sub(
                r'"images":\s*\[[^\]]*\]',
                f'"images": [\n      {imgs}\n    ]',
                chunk,
                count=1,
                flags=re.S,
            )
        out.append(chunk)
        i += 2
    PRODUCTS_TS.write_text("".join(out), encoding="utf-8")


def main() -> None:
    backdrop = load_backdrop()
    mapping: dict[str, list[str]] = {}
    for folder in sorted(
        [p for p in CATALOG.iterdir() if p.is_dir() and p.name.isdigit()],
        key=lambda p: int(p.name),
    ):
        try:
            rels = process_folder(folder, backdrop)
        except Exception as e:
            print(f"skip {folder.name}: {e}")
            continue
        if rels:
            mapping[folder.name] = rels
            kind = "cutout" if (folder / "0.source-backup.png").exists() or (folder / "0.png").exists() else "photo"
            print(f"ok {folder.name} [{kind}]")
    rewrite_products_ts(mapping)
    print(f"done {len(mapping)}")


if __name__ == "__main__":
    main()
