import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import type { Category } from "@prisma/client";

function SocialLink({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm hover:opacity-60 transition"
      style={{ color: "var(--color-background)" }}
    >
      {label}
    </a>
  );
}

export default function Footer({ settings, categories }: { settings: SiteSettings; categories: Category[] }) {
  return (
    <footer className="mt-24" style={{ background: "var(--color-text)", color: "var(--color-background)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="font-heading text-xl mb-2">{settings.siteName}</p>
          <p className="text-sm opacity-70">{settings.tagline}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide opacity-70 mb-3">Catégories</p>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="text-sm hover:opacity-60 transition">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide opacity-70 mb-3">Contact</p>
          <ul className="space-y-2 text-sm opacity-90">
            {settings.contactEmail && <li>{settings.contactEmail}</li>}
            {settings.contactPhone && <li>{settings.contactPhone}</li>}
            {settings.address && <li>{settings.address}</li>}
          </ul>
          <div className="flex gap-4 mt-4">
            <SocialLink href={settings.instagramUrl} label="Instagram" />
            <SocialLink href={settings.facebookUrl} label="Facebook" />
            <SocialLink href={settings.tiktokUrl} label="TikTok" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 sm:px-6 py-5 text-center text-xs opacity-60">
        {settings.footerText}
      </div>
    </footer>
  );
}
