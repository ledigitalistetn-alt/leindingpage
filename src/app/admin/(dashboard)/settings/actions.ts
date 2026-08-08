"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export type SettingsState = { error?: string; success?: boolean };

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

async function maybeUploadImage(formData: FormData, fieldName: string, currentUrl: string) {
  const file = formData.get(fieldName);
  if (file instanceof File && file.size > 0) {
    return saveUploadedFile(file);
  }
  return currentUrl;
}

export async function updateSettings(_prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireSession();

  const current = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  const metaPixelIdRaw = str(formData, "metaPixelId");
  if (metaPixelIdRaw && !/^\d+$/.test(metaPixelIdRaw)) {
    return { error: "Le Meta Pixel ID doit contenir uniquement des chiffres (juste l'ID, pas le code complet)." };
  }

  try {
    const [logoUrl, heroImageUrl, aboutImageUrl] = await Promise.all([
      maybeUploadImage(formData, "logo", current.logoUrl),
      maybeUploadImage(formData, "heroImage", current.heroImageUrl),
      maybeUploadImage(formData, "aboutImage", current.aboutImageUrl),
    ]);

    await prisma.siteSettings.update({
      where: { id: "main" },
      data: {
        siteName: str(formData, "siteName") || current.siteName,
        tagline: str(formData, "tagline"),
        logoUrl,
        primaryColor: str(formData, "primaryColor") || current.primaryColor,
        secondaryColor: str(formData, "secondaryColor") || current.secondaryColor,
        accentColor: str(formData, "accentColor") || current.accentColor,
        backgroundColor: str(formData, "backgroundColor") || current.backgroundColor,
        textColor: str(formData, "textColor") || current.textColor,
        headingFont: str(formData, "headingFont") || current.headingFont,
        bodyFont: str(formData, "bodyFont") || current.bodyFont,
        announcementText: str(formData, "announcementText"),
        announcementActive: formData.get("announcementActive") === "on",
        heroTitle: str(formData, "heroTitle"),
        heroSubtitle: str(formData, "heroSubtitle"),
        heroImageUrl,
        heroCtaLabel: str(formData, "heroCtaLabel"),
        heroCtaLink: str(formData, "heroCtaLink"),
        aboutTitle: str(formData, "aboutTitle"),
        aboutText: str(formData, "aboutText"),
        aboutImageUrl,
        contactEmail: str(formData, "contactEmail"),
        contactPhone: str(formData, "contactPhone"),
        address: str(formData, "address"),
        footerText: str(formData, "footerText"),
        instagramUrl: str(formData, "instagramUrl"),
        facebookUrl: str(formData, "facebookUrl"),
        tiktokUrl: str(formData, "tiktokUrl"),
        whatsappNumber: str(formData, "whatsappNumber"),
        currency: str(formData, "currency") || current.currency,
        metaPixelId: metaPixelIdRaw,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur lors de l'enregistrement" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}
