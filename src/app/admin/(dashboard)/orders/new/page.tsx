import { prisma } from "@/lib/prisma";
import OrderForm from "@/components/admin/OrderForm";

export default async function NewOrderPage() {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, stock: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Nouvelle commande</h1>
      <p className="text-neutral-500 mb-6">Enregistrez une commande passée par téléphone ou en direct.</p>
      {products.length === 0 ? (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          Ajoutez d&apos;abord un produit avant de créer une commande.
        </p>
      ) : (
        <OrderForm products={products} />
      )}
    </div>
  );
}
