import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCategory } from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Catégories</h1>
          <p className="text-neutral-500">Organisez votre catalogue (Femme, Homme, Accessoires...).</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition"
        >
          + Nouvelle catégorie
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Produits</th>
              <th className="px-4 py-3 font-medium">Visible</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3">
                  {cat.imageUrl ? (
                    <Image src={cat.imageUrl} alt={cat.name} width={40} height={40} className="rounded-md object-cover h-10 w-10" unoptimized />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-neutral-100" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{cat.name}</td>
                <td className="px-4 py-3 text-neutral-500">/{cat.slug}</td>
                <td className="px-4 py-3 text-neutral-500">{cat._count.products}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${cat.isVisible ? "bg-green-500" : "bg-neutral-300"}`}
                  />
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/categories/${cat.id}`} className="text-neutral-700 hover:text-neutral-900 text-sm">
                    Modifier
                  </Link>
                  <DeleteButton
                    id={cat.id}
                    action={deleteCategory}
                    confirmText={`Supprimer "${cat.name}" et tous ses produits ?`}
                  />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  Aucune catégorie pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
