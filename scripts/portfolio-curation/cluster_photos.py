"""Cluster project photos by perceptual hash (mirrors curate-portfolio.mjs)."""
import json
import os
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SRC_DIR = ROOT / "projectphotos"
OUT_DIR = ROOT / "scripts" / "portfolio-curation"
THUMB_DIR = OUT_DIR / "thumbs"


def dhash(file_path: Path) -> int:
    img = ImageOps.exif_transpose(Image.open(file_path).convert("L"))
    img = img.resize((9, 8), Image.Resampling.LANCZOS)
    pixels = list(img.getdata())
    h = 0
    for y in range(8):
        for x in range(8):
            left = pixels[y * 9 + x]
            right = pixels[y * 9 + x + 1]
            h = (h << 1) | (1 if left > right else 0)
    return h


def hamming(a: int, b: int) -> int:
    x = a ^ b
    n = 0
    while x:
        n += x & 1
        x >>= 1
    return n


def find(parent, i):
    while parent[i] != i:
        parent[i] = parent[parent[i]]
        i = parent[i]
    return i


def union(parent, a, b):
    parent[find(parent, a)] = find(parent, b)


def main():
    files = sorted(
        f.name for f in SRC_DIR.iterdir() if f.suffix.lower() in {".jpg", ".jpeg"}
    )
    print("Files:", len(files))

    items = []
    for name in files:
        full = SRC_DIR / name
        with Image.open(full) as img:
            img = ImageOps.exif_transpose(img)
            w, h = img.size
        hval = dhash(full)
        items.append(
            {
                "name": name,
                "path": str(full),
                "hash": format(hval, "x"),
                "hash_int": hval,
                "width": w,
                "height": h,
            }
        )

    parent = list(range(len(items)))
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if hamming(items[i]["hash_int"], items[j]["hash_int"]) <= 8:
                union(parent, i, j)

    clusters_map: dict[int, list] = {}
    for i, item in enumerate(items):
        root_id = find(parent, i)
        clusters_map.setdefault(root_id, []).append(item)

    clusters = []
    for idx, group in enumerate(clusters_map.values()):
        sorted_group = sorted(group, key=lambda f: f["width"] * f["height"], reverse=True)
        clusters.append(
            {
                "id": f"cluster-{idx + 1:03d}",
                "count": len(group),
                "files": [f["name"] for f in sorted_group],
                "best": sorted_group[0]["name"],
                "bestPath": sorted_group[0]["path"],
            }
        )
    clusters.sort(key=lambda c: c["count"], reverse=True)

    print("Clusters:", len(clusters))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "clusters.json").write_text(json.dumps(clusters, indent=2), encoding="utf-8")

    for c in clusters:
        img = ImageOps.exif_transpose(Image.open(c["bestPath"]))
        img.thumbnail((480, 360), Image.Resampling.LANCZOS)
        out = THUMB_DIR / f"{c['id']}.jpg"
        img.convert("RGB").save(out, "JPEG", quality=82)

    print("Wrote", OUT_DIR / "clusters.json")


if __name__ == "__main__":
    main()
