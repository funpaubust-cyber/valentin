import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
clusters = {c["id"]: c for c in json.loads((ROOT / "clusters.json").read_text())}

selections = {
    "kitchens": [
        ("cluster-327", "неоклассика", "угловая с островом"),
        ("cluster-139", "неоклассика", "угловая"),
        ("cluster-144", "неоклассика", "прямая"),
        ("cluster-063", "современный", "угловая"),
        ("cluster-102", "современный", "прямая"),
        ("cluster-401", "современный", "П-образная с барной стойкой"),
        ("cluster-357", "современный", "прямая"),
        ("cluster-067", "современный", "угловая"),
    ],
    "hallways": [
        ("cluster-031", "неоклассика", "с зеркалом и сиденьем"),
        ("cluster-145", "классика", "с зеркалом и банкеткой"),
        ("cluster-182", "современный", "с круглым зеркалом"),
        ("cluster-151", "современный", "модульная с рейками"),
        ("cluster-049", "современный", "с мягкой панелью"),
        ("cluster-006", "современный", "с зеркалом"),
        ("cluster-291", "неоклассика", "модульная"),
        ("cluster-360", "классика", "модульная"),
    ],
    "sofas": [
        ("cluster-297", "неоклассика", "прямой"),
        ("cluster-292", "современный", "прямой"),
        ("cluster-257", "неоклассика", "прямой"),
        ("cluster-274", "современный", "прямой"),
        ("cluster-237", "классика", "прямой"),
        ("cluster-245", "классика", "кресло"),
        ("cluster-096", "современный", "прямой"),
        ("cluster-253", "классика", "прямой"),
    ],
}

prefix = {"kitchens": "kitchen", "hallways": "hallway", "sofas": "sofa"}
out = {}
for cat, items in selections.items():
    out[cat] = []
    for i, (cid, style, layout) in enumerate(items, 1):
        c = clusters[cid]
        out[cat].append(
            {
                "id": f"{prefix[cat]}-{i:02d}",
                "clusterId": cid,
                "style": style,
                "layout": layout,
                "files": c["files"],
            }
        )

print(json.dumps(out, ensure_ascii=False, indent=2))
