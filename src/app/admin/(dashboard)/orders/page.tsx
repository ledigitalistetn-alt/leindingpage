import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusSelect from "@/components/admin/StatusSelect";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteOrder } from "./actions";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Commandes</h1>
          <p className="text-neutral-500">Suivez les commandes de vos clients et le statut de livraison.</p>
        </div>
        <Link
          href="/admin/orders/new"
          className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition"
        >
          + Nouvelle commande
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Produits</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-neutral-100 last:border-0 align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{o.customerName}</p>
                  <p className="text-neutral-500">{o.customerPhone}</p>
                  {o.customerAddress && <p className="text-neutral-400 text-xs">{o.customerAddress}</p>}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {o.items.map((it) => (
                    <div key={it.id}>
                      {it.productName} × {it.quantity}
                      {it.size && ` (${it.size}${it.color ? ", " + it.color : ""})`}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-neutral-700 font-medium">{Number(o.totalAmount).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <StatusSelect orderId={o.id} status={o.status} />
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {o.createdAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton id={o.id} action={deleteOrder} confirmText={`Supprimer la commande de ${o.customerName} ?`} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  Aucune commande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
