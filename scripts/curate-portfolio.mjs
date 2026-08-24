/**
 * Cluster project photos by perceptual hash, emit manifest for curation.
 * Run: node scripts/curate-portfolio.mjs
 */
import { readdir, readFile, writeFile, mkdir, copyFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "projectphotos");
const outDir = path.join(root, "scripts", "portfolio-curation");
const publicRoot = path.join(root, "public", "images", "portfolio");

async function dHash(filePath) {
  const { data, info } = await sharp(filePath)
    .rotate()
    .greyscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  let hash = 0n;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = data[y * 9 + x];
      const right = data[y * 9 + x + 1];
      hash = (hash << 1n) | BigInt(left > right ? 1 : 0);
    }
  }
  return hash;
}

function hamming(a, b) {
  let x = a ^ b;
  let n = 0;
  while (x) {
    n += Number(x & 1n);
    x >>= 1n;
  }
  return n;
}

async function main() {
  const files = (await readdir(srcDir))
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort();

  console.log("Files:", files.length);
  const items = [];

  for (const name of files) {
    const full = path.join(srcDir, name);
    const stat = await sharp(full).metadata();
    const hash = await dHash(full);
    items.push({
      name,
      path: full,
      hash: hash.toString(16),
      hashBig: hash,
      width: stat.width,
      height: stat.height,
    });
  }

  // Union-find clustering by hash similarity
  const parent = items.map((_, i) => i);
  const find = (i) => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  const union = (a, b) => {
    parent[find(a)] = find(b);
  };

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (hamming(items[i].hashBig, items[j].hashBig) <= 8) union(i, j);
    }
  }

  const clustersMap = new Map();
  for (let i = 0; i < items.length; i++) {
    const rootId = find(i);
    if (!clustersMap.has(rootId)) clustersMap.set(rootId, []);
    clustersMap.get(rootId).push(items[i]);
  }

  const clusters = [...clustersMap.values()]
    .map((group, idx) => {
      const sorted = [...group].sort(
        (a, b) => b.width * b.height - a.width * a.width,
      );
      return {
        id: `cluster-${String(idx + 1).padStart(3, "0")}`,
        count: group.length,
        files: sorted.map((f) => f.name),
        best: sorted[0].name,
        bestPath: sorted[0].path,
      };
    })
    .sort((a, b) => b.count - a.count);

  console.log("Clusters:", clusters.length);
  await mkdir(outDir, { recursive: true });
  await writeFile(
    path.join(outDir, "clusters.json"),
    JSON.stringify(clusters, null, 2),
  );

  // Export thumbnails for manual / agent review
  const thumbDir = path.join(outDir, "thumbs");
  await mkdir(thumbDir, { recursive: true });
  for (const c of clusters) {
    await sharp(c.bestPath)
      .rotate()
      .resize(480, 360, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toFile(path.join(thumbDir, `${c.id}.jpg`));
  }

  console.log("Wrote", path.join(outDir, "clusters.json"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
