import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMonthYearRange, MONTH_LABELS, recentYears } from "@/lib/dateFilter";

type Row = { name: string; quantity: number; revenue: number; profit: number; hasCost: boolean };

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const { month, year } = await searchParams;
  const range = getMonthYearRange(month, year);

  const orders = await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" },
      ...(range ? { createdAt: { gte: range.start, lt: range.end } } : {}),
    },
    include: {
      items: { include: { product: { include: { category: true } } } },
    },
  });

  let totalRevenue = 0;
  let totalProfit = 0;
  let hasUnknownCost = false;
  let itemCount = 0;

  const byProduct = new Map<string, Row>();
  const byCategory = new Map<string, Row>();

  for (const order of orders) {
    for (const item of order.items) {
      const revenue = Number(item.price) * item.quantity;
      totalRevenue += revenue;
      itemCount += item.quantity;

      let profit = 0;
      const known = item.costPrice !== null;
      if (known) {
        profit = (Number(item.price) - Number(item.costPrice)) * item.quantity;
        totalProfit += profit;
      } else {
        hasUnknownCost = true;
      }

      const categoryName = item.product?.category.name ?? "Autres";
      const productKey = item.productId ?? item.productName;

      const p = byProduct.get(productKey) ?? { name: item.productName, quantity: 0, revenue: 0, profit: 0, hasCost: true };
      p.quantity += item.quantity;
      p.revenue += revenue;
      p.profit += profit;
      if (!known) p.hasCost = false;
      byProduct.set(productKey, p);

      const c = byCategory.get(categoryName) ?? { name: categoryName, quantity: 0, revenue: 0, profit: 0, hasCost: true };
      c.quantity += item.quantity;
      c.revenue += revenue;
      c.profit += profit;
      if (!known) c.hasCost = false;
      byCategory.set(categoryName, c);
    }
  }

  const productRows = Array.from(byProduct.values()).sort((a, b) => b.revenue - a.revenue);
  const categoryRows = Array.from(byCategory.values()).sort((a, b) => b.revenue - a.revenue);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Statistiques</h1>
      <p className="text-neutral-500 mb-6">Chiffre d&apos;affaires et bénéfice, par produit et par catégorie.</p>

      <form method="get" className="flex items-end gap-3 mb-6">
        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Mois</span>
          <select name="month" defaultValue={month ?? ""} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="">Tous</option>
            {MONTH_LABELS.map((label, i) => (
              <option key={label} value={i + 1}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Année</span>
          <select name="year" defaultValue={year ?? ""} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="">Toutes</option>
            {recentYears().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition">
          Filtrer
        </button>
        {(month || year) && (
          <Link href="/admin/stats" className="text-sm text-neutral-500 hover:text-neutral-800 pb-2">
            Réinitialiser
          </Link>
        )}
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500">Chiffre d&apos;affaires</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalRevenue.toFixed(2)} DT</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500">Bénéfice{hasUnknownCost ? " (partiel)" : ""}</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalProfit.toFixed(2)} DT</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500">Commandes</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500">Articles vendus</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{itemCount}</p>
        </div>
      </div>

      {hasUnknownCost && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          Certains produits n&apos;ont pas de coût d&apos;achat renseigné — le bénéfice affiché est donc sous-estimé pour
          ces produits. Ajoutez le coût dans la fiche produit pour un calcul complet.
        </p>
      )}

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-neutral-200 font-medium text-neutral-900">Par catégorie</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Vendus</th>
              <th className="px-4 py-3 font-medium">CA</th>
              <th className="px-4 py-3 font-medium">Bénéfice</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows.map((c) => (
              <tr key={c.name} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{c.name}</td>
                <td className="px-4 py-3 text-neutral-500">{c.quantity}</td>
                <td className="px-4 py-3 text-neutral-700">{c.revenue.toFixed(2)} DT</td>
                <td className="px-4 py-3 text-neutral-700">
                  {c.profit.toFixed(2)} DT{!c.hasCost && <span className="text-amber-600 text-xs"> *</span>}
                </td>
              </tr>
            ))}
            {categoryRows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                  Aucune vente pour cette période.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200 font-medium text-neutral-900">Par produit</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Vendus</th>
              <th className="px-4 py-3 font-medium">CA</th>
              <th className="px-4 py-3 font-medium">Bénéfice</th>
            </tr>
          </thead>
          <tbody>
            {productRows.map((p) => (
              <tr key={p.name} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                <td className="px-4 py-3 text-neutral-500">{p.quantity}</td>
                <td className="px-4 py-3 text-neutral-700">{p.revenue.toFixed(2)} DT</td>
                <td className="px-4 py-3 text-neutral-700">
                  {p.profit.toFixed(2)} DT{!p.hasCost && <span className="text-amber-600 text-xs"> *</span>}
                </td>
              </tr>
            ))}
            {productRows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                  Aucune vente pour cette période.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
