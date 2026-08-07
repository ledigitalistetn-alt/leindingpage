import { writeFileSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "public", "uploads", "seed");

function svg(width, height, from, to, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <text x="50%" y="50%" font-family="Georgia, serif" font-size="${Math.round(
    Math.min(width, height) / 12
  )}" fill="rgba(255,255,255,0.85)" text-anchor="middle" dominant-baseline="middle" letter-spacing="4">${label}</text>
</svg>`;
}

const images = [
  { name: "hero.svg", w: 1600, h: 1000, from: "#2b2b2b", to: "#5c5142", label: "COLLECTION" },
  { name: "about.svg", w: 1200, h: 1000, from: "#3a3a3a", to: "#6b5d4f", label: "ATELIER" },
  { name: "category-femme.svg", w: 900, h: 1100, from: "#8a7660", to: "#3f3a34", label: "FEMME" },
  { name: "category-homme.svg", w: 900, h: 1100, from: "#4a4a4a", to: "#232323", label: "HOMME" },
  { name: "category-accessoires.svg", w: 900, h: 1100, from: "#c9a882", to: "#7a6650", label: "ACCESSOIRES" },
  { name: "category-nouveautes.svg", w: 900, h: 1100, from: "#5c6b5f", to: "#2c332d", label: "NOUVEAUTÉS" },
  { name: "product-1.svg", w: 900, h: 1200, from: "#726a5e", to: "#2e2a25", label: "ROBE ÉTÉ" },
  { name: "product-2.svg", w: 900, h: 1200, from: "#4b4b4b", to: "#1c1c1c", label: "BLAZER" },
  { name: "product-3.svg", w: 900, h: 1200, from: "#a08a6f", to: "#4a3f33", label: "CHEMISE" },
  { name: "product-4.svg", w: 900, h: 1200, from: "#5a5a5a", to: "#232323", label: "PANTALON" },
  { name: "product-5.svg", w: 900, h: 1200, from: "#c9a882", to: "#8a7154", label: "SAC CUIR" },
  { name: "product-6.svg", w: 900, h: 1200, from: "#3f4a3f", to: "#1b201b", label: "MANTEAU" },
  { name: "product-7.svg", w: 900, h: 1200, from: "#8f6f5b", to: "#3a2b21", label: "FOULARD" },
  { name: "product-8.svg", w: 900, h: 1200, from: "#6b6b6b", to: "#2a2a2a", label: "BASKETS" },
];

for (const img of images) {
  writeFileSync(join(outDir, img.name), svg(img.w, img.h, img.from, img.to, img.label));
}

console.log(`Generated ${images.length} placeholder images in ${outDir}`);
