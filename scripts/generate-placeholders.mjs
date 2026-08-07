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
  ${
    label
      ? `<text x="50%" y="50%" font-family="Georgia, serif" font-size="${Math.round(
          Math.min(width, height) / 12
        )}" fill="rgba(255,255,255,0.85)" text-anchor="middle" dominant-baseline="middle" letter-spacing="4">${label}</text>`
      : ""
  }
</svg>`;
}

const images = [
  { name: "hero.svg", w: 1600, h: 1000, from: "#2f3b30", to: "#111111", label: "" },
  { name: "about.svg", w: 1200, h: 1000, from: "#3a3a3a", to: "#6b5d4f", label: "ATELIER" },

  { name: "category-fille.svg", w: 900, h: 1100, from: "#c98a9c", to: "#5a3a44", label: "FILLE" },
  { name: "category-garcon.svg", w: 900, h: 1100, from: "#6f9b7d", to: "#28362c", label: "GARÇON" },
  { name: "category-femme.svg", w: 900, h: 1100, from: "#8a7660", to: "#3f3a34", label: "FEMME" },
  { name: "category-accessoires.svg", w: 900, h: 1100, from: "#c9a882", to: "#7a6650", label: "ACCESSOIRES" },

  { name: "product-fille-1.svg", w: 900, h: 1200, from: "#d99aab", to: "#6b3f4a", label: "ENSEMBLE FILLE" },
  { name: "product-fille-2.svg", w: 900, h: 1200, from: "#e7b8c4", to: "#8a5563", label: "ROBE FILLE" },
  { name: "product-garcon-1.svg", w: 900, h: 1200, from: "#7fa88d", to: "#28362c", label: "ENSEMBLE MUSIC" },
  { name: "product-garcon-2.svg", w: 900, h: 1200, from: "#e0895a", to: "#7a3d20", label: "ENSEMBLE MUSIC" },
  { name: "product-garcon-3.svg", w: 900, h: 1200, from: "#9fa6ab", to: "#3c4144", label: "ENSEMBLE MUSIC" },
  { name: "product-femme-1.svg", w: 900, h: 1200, from: "#726a5e", to: "#2e2a25", label: "ROBE ÉTÉ" },
  { name: "product-femme-2.svg", w: 900, h: 1200, from: "#4b4b4b", to: "#1c1c1c", label: "BLAZER" },
  { name: "product-accessoire-1.svg", w: 900, h: 1200, from: "#c9a882", to: "#8a7154", label: "SAC" },
  { name: "product-accessoire-2.svg", w: 900, h: 1200, from: "#8f6f5b", to: "#3a2b21", label: "FOULARD" },
];

for (const img of images) {
  writeFileSync(join(outDir, img.name), svg(img.w, img.h, img.from, img.to, img.label));
}

console.log(`Generated ${images.length} placeholder images in ${outDir}`);
