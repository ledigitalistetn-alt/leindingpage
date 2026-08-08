import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [categoryCount, productCount, visibleProductCount, orderCount, pendingOrderCount, revenueResult, recentOrders] =
    await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.product.count({ where: { isVisible: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
    ]);

  const revenue = Number(revenueResult._sum.totalAmount ?? 0);

  const stats = [
    { label: "Commandes", value: orderCount, href: "/admin/orders" },
    { label: "En attente", value: pendingOrderCount, href: "/admin/orders" },
    { label: "Chiffre d'affaires", value: `${revenue.toFixed(2)} DT`, href: "/admin/orders" },
    { label: "Catégories", value: categoryCount, href: "/admin/categories" },
    { label: "Produits", value: productCount, href: "/admin/products" },
    { label: "Produits visibles", value: visibleProductCount, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Tableau de bord</h1>
      <p className="text-neutral-500 mb-6">Bienvenue dans l&apos;espace d&apos;administration de votre boutique.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
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

      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-neutral-900">Dernières commandes</h2>
          <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-neutral-800">
            Voir tout →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-neutral-400">Aucune commande pour le moment.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {recentOrders.map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-neutral-900">{o.customerName}</p>
                  <p className="text-neutral-500">
                    {o.items.map((it) => it.productName).join(", ")}
                  </p>
                </div>
                <span className="text-neutral-700 font-medium">{Number(o.totalAmount).toFixed(2)} DT</span>
              </li>
            ))}
          </ul>
        )}
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
          <li>
            • Suivez vos{" "}
            <Link href="/admin/orders" className="underline">
              commandes
            </Link>{" "}
            et le statut de livraison.
          </li>
          <li>
            • Consultez le chiffre d&apos;affaires et le bénéfice par produit dans{" "}
            <Link href="/admin/stats" className="underline">
              Statistiques
            </Link>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
