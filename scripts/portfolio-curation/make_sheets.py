import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
clusters = json.loads((ROOT / "clusters.json").read_text())
thumb_dir = ROOT / "thumbs"
out_dir = ROOT / "sheets"
out_dir.mkdir(exist_ok=True)

cols, rows, pad, label_h = 5, 4, 8, 22
cell_w, cell_h = 240, 180
per_sheet = cols * rows

for si, start in enumerate(range(0, len(clusters), per_sheet)):
    batch = clusters[start : start + per_sheet]
    sheet_w = cols * cell_w + (cols + 1) * pad
    sheet_h = rows * (cell_h + label_h) + (rows + 1) * pad
    sheet = Image.new("RGB", (sheet_w, sheet_h), (24, 24, 24))
    draw = ImageDraw.Draw(sheet)
    for i, c in enumerate(batch):
        r, col = divmod(i, cols)
        x = pad + col * (cell_w + pad)
        y = pad + r * (cell_h + label_h + pad)
        thumb = Image.open(thumb_dir / f"{c['id']}.jpg").convert("RGB")
        thumb.thumbnail((cell_w, cell_h), Image.Resampling.LANCZOS)
        tx = x + (cell_w - thumb.width) // 2
        ty = y + (cell_h - thumb.height) // 2
        sheet.paste(thumb, (tx, ty))
        draw.text((x + 4, y + cell_h + 2), c["id"], fill=(220, 220, 220))
    out = out_dir / f"sheet-{si + 1:02d}.jpg"
    sheet.save(out, quality=85)
    print(out.name, len(batch))

print("sheets", math.ceil(len(clusters) / per_sheet))
