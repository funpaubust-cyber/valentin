const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(dir, { recursive: true });

function svg(w, h, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4A3B32"/>
      <stop offset="55%" stop-color="#8C7A6B"/>
      <stop offset="100%" stop-color="#C5A880"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E1E1E"/>
      <stop offset="100%" stop-color="#4A3B32"/>
    </linearGradient>
    <linearGradient id="marble" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FAF9F5"/>
      <stop offset="50%" stop-color="#F4F1EA"/>
      <stop offset="100%" stop-color="#E8E2D6"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${body}
</svg>`;
}

const assets = {
  "kitchen-1.svg": svg(
    1600,
    1200,
    `<rect width="1600" height="1200" fill="url(#g2)"/>
     <rect x="120" y="280" width="1360" height="720" fill="#2A221E"/>
     <rect x="160" y="320" width="420" height="640" fill="#4A3B32"/>
     <rect x="600" y="320" width="420" height="640" fill="#3F322B"/>
     <rect x="1040" y="320" width="400" height="640" fill="#4A3B32"/>
     <rect x="160" y="300" width="1280" height="36" fill="url(#marble)"/>
     <rect x="160" y="336" width="1280" height="8" fill="#D4AF37" opacity="0.55"/>
     <rect x="180" y="420" width="380" height="8" fill="#C5A880" opacity="0.35"/>
     <rect x="620" y="420" width="380" height="8" fill="#C5A880" opacity="0.35"/>
     <rect x="1060" y="420" width="360" height="8" fill="#C5A880" opacity="0.35"/>
     <circle cx="1280" cy="220" r="180" fill="url(#glow)"/>
     <text x="160" y="180" fill="#C5A880" font-family="Georgia, serif" font-size="42" letter-spacing="8">VALENTIN · NOCTURNE</text>`
  ),
  "kitchen-2.svg": svg(
    1600,
    1200,
    `<rect width="1600" height="1200" fill="#F4F1EA"/>
     <rect x="0" y="0" width="1600" height="1200" fill="url(#glow)"/>
     <rect x="200" y="340" width="900" height="560" fill="#8C7A6B"/>
     <rect x="1120" y="420" width="280" height="480" fill="#4A3B32"/>
     <rect x="240" y="700" width="820" height="48" fill="url(#marble)"/>
     <rect x="260" y="480" width="180" height="180" fill="#1E1E1E" opacity="0.85"/>
     <rect x="470" y="480" width="180" height="180" fill="#1E1E1E" opacity="0.75"/>
     <line x1="220" y1="360" x2="1080" y2="360" stroke="#D4AF37" stroke-width="2" opacity="0.5"/>
     <text x="200" y="220" fill="#4A3B32" font-family="Georgia, serif" font-size="42" letter-spacing="6">SOLENNE</text>`
  ),
  "kitchen-3.svg": svg(
    1600,
    1200,
    `<rect width="1600" height="1200" fill="#1E1E1E"/>
     <rect x="280" y="300" width="1040" height="640" fill="#4A3B32"/>
     <rect x="320" y="360" width="300" height="520" fill="#3A2E28"/>
     <rect x="650" y="360" width="300" height="520" fill="#4A3B32"/>
     <rect x="980" y="360" width="300" height="520" fill="#3A2E28"/>
     <rect x="320" y="340" width="960" height="28" fill="#FAF9F5"/>
     <path d="M320 340 H1280" stroke="#D4AF37" stroke-width="3"/>
     <text x="280" y="220" fill="#C5A880" font-family="Georgia, serif" font-size="40">ATELIER</text>`
  ),
  "hallway-1.svg": svg(
    1200,
    1500,
    `<rect width="1200" height="1500" fill="#2A221E"/>
     <rect x="180" y="180" width="840" height="1140" fill="#3D2A28"/>
     ${Array.from({ length: 5 }, (_, r) =>
       Array.from({ length: 4 }, (_, c) => {
         const cx = 300 + c * 200;
         const cy = 320 + r * 200;
         return `<ellipse cx="${cx}" cy="${cy}" rx="78" ry="78" fill="#4A3030" opacity="0.9"/>
                 <circle cx="${cx}" cy="${cy}" r="14" fill="#D4AF37"/>
                 <path d="M${cx - 70} ${cy} Q${cx} ${cy - 40} ${cx + 70} ${cy}" stroke="#5A3A38" stroke-width="2" fill="none" opacity="0.5"/>
                 <path d="M${cx} ${cy - 70} Q${cx + 40} ${cy} ${cx} ${cy + 70}" stroke="#5A3A38" stroke-width="2" fill="none" opacity="0.5"/>`;
       }).join("")
     ).join("")}
     <text x="180" y="120" fill="#C5A880" font-family="Georgia, serif" font-size="36">CAPITONE</text>`
  ),
  "hallway-2.svg": svg(
    1200,
    1500,
    `<rect width="1200" height="1500" fill="#F4F1EA"/>
     <rect x="160" y="200" width="880" height="1100" fill="#8C7A6B"/>
     <rect x="200" y="240" width="800" height="900" fill="#5A4338"/>
     ${Array.from({ length: 4 }, (_, r) =>
       Array.from({ length: 3 }, (_, c) => {
         const cx = 360 + c * 240;
         const cy = 380 + r * 220;
         return `<circle cx="${cx}" cy="${cy}" r="70" fill="#4A3B32"/><circle cx="${cx}" cy="${cy}" r="12" fill="#C5A880"/>`;
       }).join("")
     ).join("")}
     <rect x="200" y="1160" width="800" height="80" fill="#4A3B32"/>
     <text x="160" y="140" fill="#4A3B32" font-family="Georgia, serif" font-size="34">VESTIBULE</text>`
  ),
  "hallway-3.svg": svg(
    1200,
    1500,
    `<rect width="1200" height="1500" fill="#FAF9F5"/>
     <rect x="220" y="260" width="760" height="980" fill="#E8DFD2"/>
     <rect x="260" y="300" width="680" height="820" fill="#D9CFC0"/>
     <text x="220" y="180" fill="#8C7A6B" font-family="Georgia, serif" font-size="34">FOYER SOFT</text>`
  ),
  "sofa-lux-1.svg": svg(
    1600,
    1200,
    `<rect width="1600" height="1200" fill="#F4F1EA"/>
     <ellipse cx="800" cy="860" rx="520" ry="40" fill="#4A3B32" opacity="0.12"/>
     <rect x="320" y="420" width="960" height="320" rx="28" fill="#4A3B32"/>
     <rect x="360" y="460" width="880" height="180" rx="20" fill="#5A4840"/>
     <rect x="300" y="700" width="200" height="160" rx="18" fill="#4A3B32"/>
     <rect x="1100" y="700" width="200" height="160" rx="18" fill="#4A3B32"/>
     <circle cx="380" cy="870" r="10" fill="#D4AF37"/>
     <circle cx="1220" cy="870" r="10" fill="#D4AF37"/>
     <text x="320" y="260" fill="#8C7A6B" font-family="Georgia, serif" font-size="40">IMPERIAL</text>`
  ),
  "sofa-lux-2.svg": svg(
    1600,
    1200,
    `<rect width="1600" height="1200" fill="#1E1E1E"/>
     <rect x="280" y="400" width="1040" height="360" rx="32" fill="#8C7A6B"/>
     <rect x="320" y="440" width="960" height="200" rx="24" fill="#A09080"/>
     <rect x="260" y="720" width="220" height="180" rx="20" fill="#8C7A6B"/>
     <rect x="1120" y="720" width="220" height="180" rx="20" fill="#8C7A6B"/>
     <text x="280" y="240" fill="#C5A880" font-family="Georgia, serif" font-size="40">CASHMERE</text>`
  ),
  "sofa-lux-3.svg": svg(
    1600,
    1200,
    `<rect width="1600" height="1200" fill="#FAF9F5"/>
     <rect x="300" y="440" width="1000" height="300" rx="16" fill="#3D2B1F"/>
     <rect x="340" y="480" width="920" height="160" rx="12" fill="#4A3B32"/>
     <line x1="340" y1="760" x2="1260" y2="760" stroke="#D4AF37" stroke-width="2"/>
     <text x="300" y="280" fill="#4A3B32" font-family="Georgia, serif" font-size="40">VELVET LINE</text>`
  ),
  "before.svg": svg(
    1920,
    1080,
    `<rect width="1920" height="1080" fill="#EDE8DF"/>
     <rect x="0" y="820" width="1920" height="260" fill="#D9D0C2"/>
     <rect x="120" y="160" width="1680" height="660" fill="#F4F1EA" stroke="#C5A880" stroke-opacity="0.25"/>
     <line x1="120" y1="820" x2="1800" y2="820" stroke="#8C7A6B" stroke-opacity="0.3"/>
     <text x="140" y="140" fill="#8C7A6B" font-family="Georgia, serif" font-size="36">ДО</text>`
  ),
  "after.svg": svg(
    1920,
    1080,
    `<rect width="1920" height="1080" fill="#2A221E"/>
     <rect x="0" y="820" width="1920" height="260" fill="#1E1E1E"/>
     <rect x="220" y="240" width="700" height="580" fill="#4A3B32"/>
     <rect x="960" y="300" width="740" height="520" fill="#3D2A28"/>
     ${Array.from({ length: 3 }, (_, r) =>
       Array.from({ length: 3 }, (_, c) => {
         const cx = 1080 + c * 180;
         const cy = 400 + r * 140;
         return `<circle cx="${cx}" cy="${cy}" r="40" fill="#4A3030"/><circle cx="${cx}" cy="${cy}" r="8" fill="#D4AF37"/>`;
       }).join("")
     ).join("")}
     <rect x="240" y="260" width="660" height="40" fill="#FAF9F5"/>
     <rect x="240" y="300" width="660" height="6" fill="#D4AF37" opacity="0.6"/>
     <text x="140" y="140" fill="#C5A880" font-family="Georgia, serif" font-size="36">ПОСЛЕ</text>`
  ),
  "hero-kitchen.svg": svg(
    1920,
    1080,
    `<rect width="1920" height="1080" fill="url(#g2)"/>
     <rect x="80" y="200" width="1760" height="760" fill="#241C18"/>
     <rect x="140" y="260" width="520" height="640" fill="#4A3B32"/>
     <rect x="700" y="260" width="520" height="640" fill="#3F322B"/>
     <rect x="1260" y="260" width="520" height="640" fill="#4A3B32"/>
     <rect x="140" y="240" width="1640" height="42" fill="url(#marble)"/>
     <rect x="140" y="282" width="1640" height="10" fill="#D4AF37" opacity="0.55"/>
     <circle cx="1500" cy="180" r="220" fill="url(#glow)"/>
     <text x="140" y="160" fill="#C5A880" font-family="Georgia, serif" font-size="28" letter-spacing="10">PREMIUM KITCHEN ARCHITECTURE</text>`
  ),
};

for (const [name, content] of Object.entries(assets)) {
  fs.writeFileSync(path.join(dir, name), content);
  console.log("wrote", name);
}
console.log("done");
