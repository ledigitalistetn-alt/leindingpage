import type { Product } from "@prisma/client";

export function serializeProduct<T extends Product>(product: T) {
  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice !== null ? Number(product.comparePrice) : null,
    costPrice: product.costPrice !== null ? Number(product.costPrice) : null,
  };
}

export type SerializedProduct = ReturnType<typeof serializeProduct>;
