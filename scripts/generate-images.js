const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(dir, { recursive: true });

const palettes = [
  ["#EFECE6", "#6B7C5C", "#1A1A1A", "#C4B8A5"],
  ["#D9D2C5", "#556348", "#2A2118", "#8B7355"],
  ["#F2EDE4", "#8A9A7A", "#3D2B1F", "#A89880"],
  ["#E8E2D8", "#6B7C5C", "#1A1A1A", "#B8A990"],
  ["#F5F1EA", "#4A5540", "#2C241C", "#9C8B72"],
  ["#EDE8DF", "#6B7C5C", "#1F1A14", "#C9BBA8"],
  ["#F0EBE3", "#556348", "#1A1A1A", "#A68B6A"],
  ["#EAE4DA", "#6B7C5C", "#241C16", "#D4C4B0"],
];

function shapes(kind, accent, soft, dark, bg) {
  switch (kind) {
    case "sofa":
      return `
        <rect x="80" y="220" width="640" height="160" rx="28" fill="${accent}" opacity="0.85"/>
        <rect x="100" y="160" width="260" height="120" rx="24" fill="${soft}"/>
        <rect x="400" y="160" width="260" height="120" rx="24" fill="${soft}"/>
        <rect x="120" y="250" width="560" height="90" rx="18" fill="${dark}" opacity="0.2"/>`;
    case "chair":
      return `
        <rect x="260" y="150" width="280" height="220" rx="40" fill="${accent}"/>
        <rect x="280" y="280" width="240" height="120" rx="24" fill="${soft}"/>
        <rect x="300" y="400" width="24" height="80" rx="8" fill="${dark}" opacity="0.55"/>
        <rect x="476" y="400" width="24" height="80" rx="8" fill="${dark}" opacity="0.55"/>`;
    case "table":
      return `
        <rect x="140" y="240" width="520" height="36" rx="10" fill="${soft}"/>
        <rect x="180" y="276" width="28" height="160" rx="6" fill="${accent}"/>
        <rect x="592" y="276" width="28" height="160" rx="6" fill="${accent}"/>
        <ellipse cx="400" cy="248" rx="250" ry="18" fill="${dark}" opacity="0.12"/>`;
    case "bed":
      return `
        <rect x="120" y="200" width="560" height="220" rx="18" fill="${soft}"/>
        <rect x="120" y="150" width="560" height="70" rx="18" fill="${accent}"/>
        <rect x="160" y="230" width="200" height="40" rx="12" fill="${bg}"/>
        <rect x="400" y="230" width="200" height="40" rx="12" fill="${bg}"/>`;
    case "shelf":
      return `
        <rect x="220" y="100" width="360" height="360" rx="8" fill="none" stroke="${accent}" stroke-width="18"/>
        <rect x="250" y="180" width="300" height="14" fill="${soft}"/>
        <rect x="250" y="270" width="300" height="14" fill="${soft}"/>
        <rect x="250" y="360" width="300" height="14" fill="${soft}"/>`;
    case "console":
      return `
        <rect x="120" y="260" width="560" height="70" rx="8" fill="${soft}"/>
        <rect x="150" y="330" width="18" height="110" rx="4" fill="${accent}"/>
        <rect x="632" y="330" width="18" height="110" rx="4" fill="${accent}"/>`;
    case "roomEmpty":
      return `
        <rect x="60" y="80" width="680" height="400" fill="${soft}" opacity="0.35"/>
        <rect x="60" y="420" width="680" height="20" fill="${dark}" opacity="0.15"/>
        <rect x="100" y="120" width="120" height="180" fill="${bg}" opacity="0.5"/>`;
    case "roomFull":
      return `
        <rect x="60" y="80" width="680" height="400" fill="${soft}" opacity="0.25"/>
        <rect x="140" y="260" width="320" height="140" rx="20" fill="${accent}"/>
        <rect x="500" y="220" width="160" height="180" rx="24" fill="${dark}" opacity="0.45"/>
        <rect x="180" y="180" width="120" height="80" rx="12" fill="${bg}"/>`;
    default:
      return "";
  }
}

function svg(w, h, bg, accent, dark, soft, kind, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${soft}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="120" cy="100" r="90" fill="${accent}" opacity="0.12"/>
  <circle cx="680" cy="420" r="140" fill="${dark}" opacity="0.06"/>
  ${shapes(kind, accent, soft, dark, bg)}
  <text x="40" y="${h - 36}" font-family="Georgia, serif" font-size="28" fill="${dark}" opacity="0.55">${label}</text>
</svg>`;
}

const files = [
  ["sofa-1.svg", 0, "sofa", "Yume"],
  ["sofa-2.svg", 1, "sofa", "Yume II"],
  ["chair-1.svg", 2, "chair", "Kanso"],
  ["chair-2.svg", 3, "chair", "Kanso II"],
  ["table-1.svg", 4, "table", "Ma"],
  ["table-2.svg", 5, "table", "Ma II"],
  ["bed-1.svg", 6, "bed", "Shizuka"],
  ["bed-2.svg", 7, "bed", "Shizuka II"],
  ["shelf-1.svg", 0, "shelf", "Wabi"],
  ["shelf-2.svg", 1, "shelf", "Wabi II"],
  ["console-1.svg", 2, "console", "Hiki"],
  ["console-2.svg", 3, "console", "Hiki II"],
  ["armchair-1.svg", 4, "chair", "Sabi"],
  ["armchair-2.svg", 5, "chair", "Sabi II"],
  ["bench-1.svg", 6, "console", "En"],
  ["bench-2.svg", 7, "console", "En II"],
  ["hero-1.svg", 0, "sofa", "Yume Sofa"],
  ["hero-2.svg", 2, "chair", "Kanso Chair"],
  ["hero-3.svg", 4, "table", "Ma Table"],
  ["before.svg", 1, "roomEmpty", "Do"],
  ["after.svg", 0, "roomFull", "Posle"],
  ["story-frame.svg", 3, "shelf", "Karkas"],
  ["story-fill.svg", 5, "sofa", "Napolnitel"],
  ["story-upholstery.svg", 0, "sofa", "Obivka"],
  ["parallax-1.svg", 2, "chair", ""],
  ["parallax-2.svg", 6, "bed", ""],
  ["parallax-3.svg", 4, "table", ""],
  ["config-sofa.svg", 0, "sofa", "Constructor"],
];

for (const [name, pi, kind, label] of files) {
  const [bg, accent, dark, soft] = palettes[pi];
  fs.writeFileSync(path.join(dir, name), svg(800, 1000, bg, accent, dark, soft, kind, label));
}

console.log("Generated", files.length, "images in", dir);
