"""Scale catalog card photos so the product fills the 3:4 frame evenly."""
from pathlib import Path

from PIL import Image, ImageFilter, ImageChops

ROOT = Path(__file__).resolve().parents[1]
DST = ROOT / "public" / "images" / "cards"
OUT = ROOT / "public" / "images" / "catalog"
CANVAS = (1200, 1600)
FILL = 0.90  # product occupies this fraction of the canvas


def content_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    rgb = im.convert("RGB")
    w, h = rgb.size
    # Sample corners for background
    s = max(8, min(w, h) // 40)
    corners = [
        rgb.crop((0, 0, s, s)),
        rgb.crop((w - s, 0, w, s)),
        rgb.crop((0, h - s, s, h)),
        rgb.crop((w - s, h - s, w, h)),
    ]
    acc = [0, 0, 0]
    n = 0
    for c in corners:
        px = list(c.getdata())
        for p in px:
            acc[0] += p[0]
            acc[1] += p[1]
            acc[2] += p[2]
            n += 1
    bg = tuple(v // n for v in acc)
    bg_im = Image.new("RGB", rgb.size, bg)
    diff = ImageChops.difference(rgb, bg_im).convert("L")
    diff = diff.point(lambda x: 255 if x > 18 else 0)
    diff = diff.filter(ImageFilter.MaxFilter(5))
    box = diff.getbbox()
    if not box:
        return (0, 0, w, h)
    return box


def tighten(src: Path) -> None:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    l, t, r, b = content_bbox(im)
    coverage = ((r - l) * (b - t)) / (w * h)
    if coverage >= 0.78:
        if (w, h) != CANVAS:
            dest = OUT / src.relative_to(DST)
            dest.parent.mkdir(parents=True, exist_ok=True)
            im.resize(CANVAS, Image.Resampling.LANCZOS).save(
                dest, "JPEG", quality=92, optimize=True, subsampling=0
            )
            return
        dest = OUT / src.relative_to(DST)
        dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest, "JPEG", quality=92, optimize=True, subsampling=0)
        return
    crop = im.crop((l, t, r, b))
    max_w = int(CANVAS[0] * FILL)
    max_h = int(CANVAS[1] * FILL)
    fitted = crop.copy()
    fitted.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", CANVAS, (250, 249, 245))
    # Prefer sampling crop-edge color for studio shots
    edge = crop.resize((1, 1), Image.Resampling.BOX).getpixel((0, 0))
    if sum(edge) > 600:
        canvas = Image.new("RGB", CANVAS, edge)
    x = (CANVAS[0] - fitted.width) // 2
    y = (CANVAS[1] - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    dest = OUT / src.relative_to(DST)
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, "JPEG", quality=92, optimize=True, subsampling=0)


def main() -> None:
    files = sorted(DST.rglob("*.jpg"))
    for p in files:
        tighten(p)
        print(p.relative_to(ROOT))
    print("tightened", len(files))


if __name__ == "__main__":
    main()
