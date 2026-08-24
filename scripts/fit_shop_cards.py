"""Make 3:4 catalog cards from the original shop photos without cropping the product."""
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images" / "shop"
DST = ROOT / "public" / "images" / "shop-fit"

CANVAS_W, CANVAS_H = 1200, 1600  # 3:4
INSET = 0.055


def median_color(im: Image.Image) -> tuple[int, int, int]:
    w, h = im.size
    band = max(10, min(w, h) // 20)
    patches = [
        im.crop((0, 0, w, band)),
        im.crop((0, h - band, w, h)),
        im.crop((0, 0, band, h)),
        im.crop((w - band, 0, w, h)),
    ]
    pixels: list[tuple[int, int, int]] = []
    for p in patches:
        pixels.extend(list(p.getdata()))
    pixels.sort()
    mid = pixels[len(pixels) // 2]
    return int(mid[0]), int(mid[1]), int(mid[2])


def border_variance(im: Image.Image) -> float:
    w, h = im.size
    s = max(12, min(w, h) // 16)
    corners = [
        im.crop((0, 0, s, s)),
        im.crop((w - s, 0, w, s)),
        im.crop((0, h - s, s, h)),
        im.crop((w - s, h - s, w, h)),
    ]
    values = []
    for c in corners:
        stat = ImageStat.Stat(c)
        values.extend(stat.stddev)
    return sum(values) / len(values)


def vertical_gradient(
    top: tuple[int, int, int], bottom: tuple[int, int, int], size: tuple[int, int]
) -> Image.Image:
    w, h = size
    grad = Image.new("RGB", (1, h))
    px = grad.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        # Ease toward the middle so the product sits on a calm field.
        t = t * t * (3 - 2 * t)
        px[0, y] = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
    return grad.resize((w, h), Image.Resampling.BILINEAR)


def fit_card(src: Path) -> Image.Image:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    studio = border_variance(im) < 18

    max_w = int(CANVAS_W * (1 - 2 * INSET))
    max_h = int(CANVAS_H * (1 - 2 * INSET))
    fitted = im.copy()
    fitted.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)

    if studio:
        canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), median_color(im))
    else:
        top = median_color(im.crop((0, 0, w, max(12, h // 16))))
        bot = median_color(im.crop((0, h - max(12, h // 16), w, h)))
        canvas = vertical_gradient(top, bot, (CANVAS_W, CANVAS_H))
        wash = Image.new("RGB", (CANVAS_W, CANVAS_H), (250, 249, 245))
        canvas = Image.blend(canvas, wash, 0.28)
        blur_src = ImageOps.fit(im, (CANVAS_W, CANVAS_H), method=Image.Resampling.LANCZOS)
        blur_src = blur_src.filter(ImageFilter.GaussianBlur(42))
        canvas = Image.blend(canvas, blur_src, 0.18)

    x = (CANVAS_W - fitted.width) // 2
    y = (CANVAS_H - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    return canvas


def main() -> None:
    files = sorted(
        list(SRC.rglob("*.jpg")) + list(SRC.rglob("*.jpeg")) + list(SRC.rglob("*.png"))
    )
    if not files:
        raise SystemExit(f"No shop images in {SRC}")
    DST.mkdir(parents=True, exist_ok=True)
    for src in files:
        rel = src.relative_to(SRC)
        dest = (DST / rel).with_suffix(".jpg")
        dest.parent.mkdir(parents=True, exist_ok=True)
        fit_card(src).save(dest, "JPEG", quality=92, optimize=True, subsampling=0)
        print(dest.relative_to(ROOT))
    print(f"Wrote {len(files)} card images")


if __name__ == "__main__":
    main()
