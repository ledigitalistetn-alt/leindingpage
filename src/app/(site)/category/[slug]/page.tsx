import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import ProductCard from "@/components/site/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category ? `${category.name} — Boutique` : "Catégorie" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, settings] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: { products: { where: { isVisible: true }, orderBy: { sortOrder: "asc" } } },
    }),
    getSiteSettings(),
  ]);

  if (!category || !category.isVisible) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-4xl" style={{ color: "var(--color-text)" }}>
          {category.name}
        </h1>
        {category.description && (
          <p className="font-body mt-3 max-w-xl mx-auto opacity-70" style={{ color: "var(--color-text)" }}>
            {category.description}
          </p>
        )}
      </div>

      {category.products.length === 0 ? (
        <p className="text-center opacity-60 py-16" style={{ color: "var(--color-text)" }}>
          Aucun produit disponible pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} currency={settings.currency} />
          ))}
        </div>
      )}
    </div>
  );
}
