import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [categoryCount, productCount, visibleProductCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.product.count({ where: { isVisible: true } }),
  ]);

  const stats = [
    { label: "Catégories", value: categoryCount, href: "/admin/categories" },
    { label: "Produits", value: productCount, href: "/admin/products" },
    { label: "Produits visibles", value: visibleProductCount, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Tableau de bord</h1>
      <p className="text-neutral-500 mb-6">Bienvenue dans l&apos;espace d&apos;administration de votre boutique.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-400 transition"
          >
            <p className="text-sm text-neutral-500">{s.label}</p>
            <p className="text-3xl font-semibold text-neutral-900 mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-3">Démarrage rapide</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li>
            • Personnalisez les couleurs, polices, textes et images dans{" "}
            <Link href="/admin/settings" className="underline">
              Design &amp; Contenu
            </Link>
            .
          </li>
          <li>
            • Ajoutez ou modifiez vos{" "}
            <Link href="/admin/categories" className="underline">
              catégories
            </Link>{" "}
            (Femme, Homme, Accessoires...).
          </li>
          <li>
            • Gérez vos{" "}
            <Link href="/admin/products" className="underline">
              produits
            </Link>{" "}
            : prix, tailles, couleurs, images, stock.
          </li>
        </ul>
      </div>
    </div>
  );
}
