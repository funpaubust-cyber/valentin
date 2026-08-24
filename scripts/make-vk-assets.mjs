/**
 * VK community assets for Салон Valentin
 * Cover 1590×400, avatar 800×800, menu tiles 640×280
 */
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "vk-assets");
const real = path.join(root, "public", "images", "real");

const FONT_SERIF = "C:/Windows/Fonts/constan.ttf";
const FONT_SERIF_B = "C:/Windows/Fonts/constanb.ttf";
const FONT_SANS = "C:/Windows/Fonts/segoeui.ttf";
const FONT_SANS_B = "C:/Windows/Fonts/segoeuib.ttf";

const WOOD = "#5C4034";
const WOOD_SOFT = "#7A5A4A";
const MILK = "#FAF9F5";
const GRAPHITE = "#1E1E1E";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fontFace(family, file, weight = "normal") {
  // sharp/svg uses file:// paths for fonts on Windows
  const href = file.replace(/\\/g, "/");
  return `@font-face{font-family:'${family}';src:url('file:///${href}');font-weight:${weight};font-style:normal;}`;
}

async function cover() {
  const W = 1590;
  const H = 400;
  const bgPath = path.join(real, "final-hero.jpg");
  const logoPath = path.join(real, "logo-v-script.png");

  const bg = await sharp(bgPath)
    .resize(W, H, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.68, saturation: 0.9 })
    .toBuffer();

  const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1a1210" stop-opacity="0.28"/>
      <stop offset="28%" stop-color="#2a1c18" stop-opacity="0.22"/>
      <stop offset="52%" stop-color="#1a1210" stop-opacity="0.58"/>
      <stop offset="100%" stop-color="#120c0a" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#120c0a" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#veil)"/>
  <rect width="${W}" height="${H}" fill="url(#bottom)"/>
</svg>`);

  const logo = await sharp(logoPath)
    .resize(78, 78, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Content on the right — left side free for VK avatar overlap
  const textSvg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    ${fontFace("ValSerif", FONT_SERIF_B, "700")}
    ${fontFace("ValSans", FONT_SANS)}
    ${fontFace("ValSansB", FONT_SANS_B, "700")}
    .brand { font-family: ValSerif, 'Times New Roman', serif; fill: ${MILK}; }
    .tag { font-family: ValSans, 'Segoe UI', sans-serif; fill: #E8D5B5; letter-spacing: 0.26em; }
    .line { font-family: ValSans, 'Segoe UI', sans-serif; fill: rgba(250,249,245,0.9); }
    .phone { font-family: ValSansB, 'Segoe UI', sans-serif; fill: ${MILK}; }
    .muted { font-family: ValSans, 'Segoe UI', sans-serif; fill: rgba(250,249,245,0.58); }
  </style>
  <rect x="720" y="86" width="52" height="2" fill="#C9A87A" opacity="0.95"/>
  <text x="720" y="140" class="brand" font-size="56">Салон Valentin</text>
  <text x="720" y="178" class="tag" font-size="14">КУХНИ  ·  ПРИХОЖИЕ  ·  ДИВАНЫ</text>
  <text x="720" y="236" class="line" font-size="18">Белгород · ул. Донецкая, 85А · МЦ «Мебельный город», 2 этаж</text>
  <text x="720" y="278" class="phone" font-size="24">+7 (951) 148-42-30</text>
  <text x="720" y="314" class="muted" font-size="15">mebelgorod.com/shops/valentin</text>
  <text x="720" y="350" class="muted" font-size="14">Корпусная и мягкая мебель премиум-класса</text>
</svg>`);

  const markBg = Buffer.from(`
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="w" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7A5A4A"/>
      <stop offset="100%" stop-color="#4B3128"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="49" fill="url(#w)" stroke="#C9A87A" stroke-width="1.5" stroke-opacity="0.6"/>
</svg>`);

  await sharp(bg)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: await sharp(markBg).png().toBuffer(), top: 98, left: 608 },
      { input: logo, top: 98 + 11, left: 608 + 11 },
      { input: await sharp(textSvg).png().toBuffer(), top: 0, left: 0 },
    ])
    .png()
    .toFile(path.join(outDir, "01-cover-1590x400.png"));

  // Also export JPG for lighter upload
  await sharp(path.join(outDir, "01-cover-1590x400.png"))
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(path.join(outDir, "01-cover-1590x400.jpg"));
}

async function avatar() {
  const S = 800;
  const logoPath = path.join(real, "logo-v-script.png");
  const logo = await sharp(logoPath)
    .resize(520, 520, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const base = Buffer.from(`
<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="wood" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#8B6B55"/>
      <stop offset="45%" stop-color="#5C4034"/>
      <stop offset="100%" stop-color="#3A261E"/>
    </radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8D5B5"/>
      <stop offset="50%" stop-color="#C9A87A"/>
      <stop offset="100%" stop-color="#7A5A4A"/>
    </linearGradient>
  </defs>
  <circle cx="400" cy="400" r="400" fill="url(#wood)"/>
  <circle cx="400" cy="400" r="388" fill="none" stroke="url(#ring)" stroke-width="3" opacity="0.65"/>
  <circle cx="400" cy="400" r="372" fill="none" stroke="#FAF9F5" stroke-width="1" opacity="0.12"/>
</svg>`);

  const text = Buffer.from(`
<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <style>
    ${fontFace("ValSans", FONT_SANS)}
    .t { font-family: ValSans, 'Segoe UI', sans-serif; fill: rgba(250,249,245,0.72); letter-spacing: 0.22em; }
  </style>
  <text x="400" y="700" text-anchor="middle" class="t" font-size="28">VALENTIN</text>
</svg>`);

  await sharp(Buffer.from(base))
    .png()
    .composite([
      { input: logo, top: 110, left: 140 },
      { input: await sharp(text).png().toBuffer(), top: 0, left: 0 },
    ])
    .toFile(path.join(outDir, "02-avatar-800.png"));
}

async function menuButton(filename, title, subtitle) {
  const W = 640;
  const H = 280;
  const svg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6B4A3C"/>
      <stop offset="55%" stop-color="#5C4034"/>
      <stop offset="100%" stop-color="#3F2A22"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8D5B5"/>
      <stop offset="100%" stop-color="#8B6B4A"/>
    </linearGradient>
    ${fontFace("ValSerif", FONT_SERIF_B, "700")}
    ${fontFace("ValSans", FONT_SANS)}
  </defs>
  <rect width="${W}" height="${H}" rx="18" ry="18" fill="url(#bg)"/>
  <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="12" ry="12"
        fill="none" stroke="url(#edge)" stroke-width="1.5" opacity="0.7"/>
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="8" ry="8"
        fill="none" stroke="#FAF9F5" stroke-width="0.75" opacity="0.12"/>
  <!-- corner marks -->
  <path d="M40 52 H56 M40 52 V68" stroke="#C9A87A" stroke-width="1.25" fill="none" opacity="0.8"/>
  <path d="M${W - 40} 52 H${W - 56} M${W - 40} 52 V68" stroke="#C9A87A" stroke-width="1.25" fill="none" opacity="0.8"/>
  <path d="M40 ${H - 52} H56 M40 ${H - 52} V${H - 68}" stroke="#C9A87A" stroke-width="1.25" fill="none" opacity="0.8"/>
  <path d="M${W - 40} ${H - 52} H${W - 56} M${W - 40} ${H - 52} V${H - 68}" stroke="#C9A87A" stroke-width="1.25" fill="none" opacity="0.8"/>
  <text x="${W / 2}" y="${subtitle ? 138 : 158}" text-anchor="middle"
        font-family="ValSerif, Constantia, serif" font-size="42" fill="${MILK}">${esc(title)}</text>
  ${
    subtitle
      ? `<text x="${W / 2}" y="178" text-anchor="middle"
        font-family="ValSans, 'Segoe UI', sans-serif" font-size="16"
        fill="#E8D5B5" letter-spacing="0.18em">${esc(subtitle)}</text>`
      : ""
  }
</svg>`);

  await sharp(svg).png().toFile(path.join(outDir, filename));
}

async function menuSet() {
  await menuButton("03-menu-akcii.png", "Акции", "СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ");
  await menuButton("04-menu-otzyvy.png", "Отзывы", "МНЕНИЕ КЛИЕНТОВ");
  await menuButton("05-menu-raschet.png", "Расчёт стоимости", "БЕСПЛАТНО");
  await menuButton("06-menu-zamer.png", "Замер", "ВЫЕЗД МАСТЕРА");
}

async function readme() {
  const text = `# Салон Valentin — материалы для VK

Файлы готовы к загрузке в сообщество. Никуда не прикреплялись — только локальная папка.

## Что загружать

| Файл | Куда в VK | Размер |
|------|-----------|--------|
| \`01-cover-1590x400.jpg\` (или .png) | Обложка сообщества | 1590×400 |
| \`02-avatar-800.png\` | Аватар сообщества | 800×800 (круг обрежет VK) |
| \`03-menu-akcii.png\` | Кнопка / приложение «Акции» | 640×280 |
| \`04-menu-otzyvy.png\` | «Отзывы» | 640×280 |
| \`05-menu-raschet.png\` | «Расчёт стоимости» | 640×280 |
| \`06-menu-zamer.png\` | «Замер» | 640×280 |

## Текст на обложке

- Салон Valentin
- Кухни · Прихожие · Диваны
- Белгород · ул. Донецкая, 85А · МЦ «Мебельный город», 2 этаж
- +7 (951) 148-42-30
- mebelgorod.com/shops/valentin

Стиль: древесный коричневый #5C4034, молоко, тонкая латунь — как на сайте.
`;
  await writeFile(path.join(outDir, "README.txt"), text, "utf8");
}

await mkdir(outDir, { recursive: true });
console.log("Building cover…");
await cover();
console.log("Building avatar…");
await avatar();
console.log("Building menu tiles…");
await menuSet();
await readme();
console.log("Done →", outDir);
