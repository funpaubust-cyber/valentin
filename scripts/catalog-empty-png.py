"""Re-composite only previously changed catalog shots onto empty transparent PNG."""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageFilter
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "public" / "images" / "catalog"
BACKUP = CATALOG / "_original"
PRODUCTS = ROOT / "src" / "data" / "products.ts"
OUT_W, OUT_H = 1200, 1600


def fit_product(cutout: Image.Image) -> Image.Image:
    cutout = cutout.convert("RGBA")
    bbox = cutout.getbbox()
    if bbox:
        cutout = cutout.crop(bbox)
    cutout.thumbnail((int(OUT_W * 0.86), int(OUT_H * 0.78)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    x = (OUT_W - cutout.width) // 2
    y = int(OUT_H * 0.58) - cutout.height // 2
    y = max(int(OUT_H * 0.08), min(y, OUT_H - cutout.height - int(OUT_H * 0.06)))
    canvas.paste(cutout, (x, y), cutout)
    return canvas


def soft_shadow(product: Image.Image) -> Image.Image:
    a = product.split()[-1]
    shade = Image.new("L", (OUT_W, OUT_H), 0)
    shade.paste(a, (0, 14))
    shade = shade.filter(ImageFilter.GaussianBlur(22))
    shade = shade.point(lambda v: int(v * 0.18))
    shadow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    shadow.putalpha(shade)
    return shadow


def main() -> None:
    originals = sorted(BACKUP.rglob("*.jpg"))
    if not originals:
        raise SystemExit("No backups in _original — nothing to convert")

    changed_ids: list[str] = []
    for i, src in enumerate(originals, 1):
        shop_id = src.parent.name
        dest_dir = CATALOG / shop_id
        dest_png = dest_dir / "0.png"
        print(f"[{i}/{len(originals)}] {shop_id}")

        img = Image.open(src).convert("RGBA")
        cut = remove(img)
        product = fit_product(cut)
        frame = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
        frame.alpha_composite(soft_shadow(product))
        frame.alpha_composite(product)
        dest_dir.mkdir(parents=True, exist_ok=True)
        frame.save(dest_png, optimize=True)

        # restore jpg from backup so unused jpg stays original; site will point to png
        jpg_live = dest_dir / "0.jpg"
        jpg_live.write_bytes(src.read_bytes())
        changed_ids.append(shop_id)

    text = PRODUCTS.read_text(encoding="utf-8")
    for shop_id in changed_ids:
        text = re.sub(
            rf'("/images/catalog/{shop_id}/)0\.jpg(")',
            rf"\g<1>0.png\2",
            text,
        )
    PRODUCTS.write_text(text, encoding="utf-8")
    print("Updated products.ts for:", ", ".join(changed_ids))
    print("Done", len(changed_ids))


if __name__ == "__main__":
    main()
