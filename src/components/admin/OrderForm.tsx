"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createManualOrder, type FormState } from "@/app/admin/(dashboard)/orders/actions";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500";

const initialState: FormState = {};

export default function OrderForm({ products }: { products: { id: string; name: string; stock: number }[] }) {
  const [state, formAction, isPending] = useActionState(createManualOrder, initialState);

  return (
    <form action={formAction} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 max-w-xl">
      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Produit</span>
        <select name="productId" defaultValue="" className={inputClass} required>
          <option value="" disabled>
            Choisir...
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (stock : {p.stock})
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Quantité</span>
          <input type="number" name="quantity" min={1} defaultValue={1} className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Taille (optionnel)</span>
          <input name="size" className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Couleur (optionnel)</span>
          <input name="color" className={inputClass} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Nom du client</span>
        <input name="customerName" className={inputClass} required />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Téléphone</span>
          <input name="customerPhone" type="tel" className={inputClass} required />
        </label>
        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Adresse (optionnel)</span>
          <input name="customerAddress" className={inputClass} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Notes (optionnel)</span>
        <textarea name="notes" rows={2} className={inputClass} />
      </label>

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-neutral-900 text-white px-5 py-2.5 font-medium hover:bg-neutral-800 transition disabled:opacity-60"
        >
          {isPending ? "Enregistrement..." : "Enregistrer la commande"}
        </button>
        <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-neutral-800">
          Annuler
        </Link>
      </div>
    </form>
  );
}
