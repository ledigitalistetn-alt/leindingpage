import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Modifier le produit</h1>
      <p className="text-neutral-500 mb-6">{product.name}</p>
      <ProductForm product={serializeProduct(product)} categories={categories} action={action} />
    </div>
  );
}
