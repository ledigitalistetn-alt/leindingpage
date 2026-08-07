import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { googleFontsHref } from "@/lib/fonts";
import AnnouncementBar from "@/components/site/AnnouncementBar";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloatingButton from "@/components/site/WhatsAppFloatingButton";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const themeVars = `
    :root {
      --color-primary: ${settings.primaryColor};
      --color-secondary: ${settings.secondaryColor};
      --color-accent: ${settings.accentColor};
      --color-background: ${settings.backgroundColor};
      --color-text: ${settings.textColor};
      --font-heading: '${settings.headingFont}', serif;
      --font-body: '${settings.bodyFont}', sans-serif;
    }
  `;

  return (
    <div className="flex flex-col min-h-screen font-body" style={{ background: "var(--color-background)", color: "var(--color-text)" }}>
      <style dangerouslySetInnerHTML={{ __html: themeVars }} />
      <link rel="stylesheet" href={googleFontsHref(settings.headingFont, settings.bodyFont)} />
      {settings.announcementActive && <AnnouncementBar text={settings.announcementText} />}
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
      <WhatsAppFloatingButton phoneNumber={settings.whatsappNumber} siteName={settings.siteName} />
    </div>
  );
}
