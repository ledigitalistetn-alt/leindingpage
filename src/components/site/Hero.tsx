import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative h-[80vh] min-h-[520px] flex items-end">
      {settings.heroImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.heroImageUrl})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-16 w-full">
        <h1 className="font-heading text-white text-4xl sm:text-6xl leading-tight max-w-2xl">
          {settings.heroTitle}
        </h1>
        <p className="font-body text-white/90 mt-4 max-w-lg text-base sm:text-lg">{settings.heroSubtitle}</p>
        {settings.heroCtaLabel && (
          <Link
            href={settings.heroCtaLink || "#"}
            className="inline-block mt-8 px-8 py-3 font-body text-sm uppercase tracking-wide"
            style={{ background: "var(--color-background)", color: "var(--color-text)" }}
          >
            {settings.heroCtaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
