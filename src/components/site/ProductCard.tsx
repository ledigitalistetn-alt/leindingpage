import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";

export default function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-red-600 text-white">Promo</span>
        )}
      </div>
      <div className="mt-3">
        <p className="font-body text-sm" style={{ color: "var(--color-text)" }}>
          {product.name}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-medium" style={{ color: "var(--color-text)" }}>
            {Number(product.price).toFixed(2)} {currency}
          </span>
          {hasDiscount && (
            <span className="text-sm line-through opacity-50" style={{ color: "var(--color-text)" }}>
              {Number(product.comparePrice).toFixed(2)} {currency}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
