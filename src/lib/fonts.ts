export const FONT_OPTIONS = [
  "Playfair Display",
  "Cormorant Garamond",
  "DM Serif Display",
  "Inter",
  "Poppins",
  "Montserrat",
  "Lora",
  "Raleway",
  "Work Sans",
] as const;

export function googleFontsHref(headingFont: string, bodyFont: string) {
  const families = new Set([headingFont, bodyFont]);
  const params = Array.from(families)
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
