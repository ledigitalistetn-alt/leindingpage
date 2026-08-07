import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { serializeProduct } from "@/lib/serialize";
import ProductDetail from "@/components/site/ProductDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product ? `${product.name} — Boutique` : "Produit" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({ where: { slug }, include: { category: true } }),
    getSiteSettings(),
  ]);

  if (!product || !product.isVisible) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <ProductDetail
        product={serializeProduct(product)}
        currency={settings.currency}
        whatsappNumber={settings.whatsappNumber}
        siteName={settings.siteName}
      />
    </div>
  );
}
