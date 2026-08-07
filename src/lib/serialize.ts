import type { Product } from "@prisma/client";

export function serializeProduct<T extends Product>(product: T) {
  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice !== null ? Number(product.comparePrice) : null,
  };
}

export type SerializedProduct = ReturnType<typeof serializeProduct>;
