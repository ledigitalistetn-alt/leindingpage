import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Nouveau produit</h1>
      <p className="text-neutral-500 mb-6">Ajoutez un produit à votre catalogue.</p>
      {categories.length === 0 ? (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          Créez d&apos;abord une catégorie avant d&apos;ajouter un produit.
        </p>
      ) : (
        <ProductForm categories={categories} action={createProduct} />
      )}
    </div>
  );
}
