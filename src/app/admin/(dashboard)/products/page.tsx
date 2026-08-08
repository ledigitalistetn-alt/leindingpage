import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProduct } from "./actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      orderItems: {
        where: { order: { status: { not: "CANCELLED" } } },
        select: { quantity: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Produits</h1>
          <p className="text-neutral-500">Gérez votre catalogue de produits.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Vendus</th>
              <th className="px-4 py-3 font-medium">Visible</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3">
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={p.name} width={40} height={40} className="rounded-md object-cover h-10 w-10" unoptimized />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-neutral-100" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {p.name}
                  {p.isFeatured && <span className="ml-2 text-xs text-amber-600">★ mis en avant</span>}
                </td>
                <td className="px-4 py-3 text-neutral-500">{p.category.name}</td>
                <td className="px-4 py-3 text-neutral-700">{Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-neutral-500">{p.stock}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {p.orderItems.reduce((sum, it) => sum + it.quantity, 0)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block h-2 w-2 rounded-full ${p.isVisible ? "bg-green-500" : "bg-neutral-300"}`} />
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/products/${p.id}`} className="text-neutral-700 hover:text-neutral-900 text-sm">
                    Modifier
                  </Link>
                  <DeleteButton id={p.id} action={deleteProduct} confirmText={`Supprimer "${p.name}" ?`} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-400">
                  Aucun produit pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
