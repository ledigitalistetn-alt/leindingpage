import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/site/Hero";
import CategoryCard from "@/components/site/CategoryCard";
import ProductCard from "@/components/site/ProductCard";

export default async function HomePage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { isVisible: true, isFeatured: true },
      orderBy: { sortOrder: "asc" },
      take: 8,
    }),
  ]);

  return (
    <div>
      <Hero settings={settings} />

      <section id="categories" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-heading text-3xl text-center mb-10" style={{ color: "var(--color-text)" }}>
          Nos catégories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section
          className="py-20"
          style={{ background: "var(--color-accent)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-heading text-3xl text-center mb-10" style={{ color: "var(--color-text)" }}>
              Sélection du moment
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} currency={settings.currency} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          {settings.aboutImageUrl && (
            <Image src={settings.aboutImageUrl} alt={settings.aboutTitle} fill unoptimized className="object-cover" />
          )}
        </div>
        <div>
          <h2 className="font-heading text-3xl mb-4" style={{ color: "var(--color-text)" }}>
            {settings.aboutTitle}
          </h2>
          <p className="font-body leading-relaxed opacity-80" style={{ color: "var(--color-text)" }}>
            {settings.aboutText}
          </p>
        </div>
      </section>

      <section className="py-16 text-center" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-heading text-2xl mb-3" style={{ color: "var(--color-background)" }}>
            Une question ?
          </h2>
          <p className="font-body mb-6 opacity-90" style={{ color: "var(--color-background)" }}>
            Contactez-nous directement, nous répondons rapidement.
          </p>
          <Link
            href={`mailto:${settings.contactEmail}`}
            className="inline-block px-8 py-3 font-body text-sm uppercase tracking-wide"
            style={{ background: "var(--color-background)", color: "var(--color-text)" }}
          >
            {settings.contactEmail}
          </Link>
        </div>
      </section>
    </div>
  );
}
