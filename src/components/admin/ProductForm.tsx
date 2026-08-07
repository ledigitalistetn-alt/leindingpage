"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@prisma/client";
import type { FormState } from "@/app/admin/(dashboard)/products/actions";
import type { SerializedProduct } from "@/lib/serialize";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500";

const initialState: FormState = {};

export default function ProductForm({
  product,
  categories,
  action,
}: {
  product?: SerializedProduct;
  categories: Category[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm sm:col-span-2">
          <span className="block text-neutral-600 mb-1">Nom</span>
          <input name="name" defaultValue={product?.name} className={inputClass} required />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="block text-neutral-600 mb-1">Slug (URL, laissez vide pour auto-générer)</span>
          <input name="slug" defaultValue={product?.slug} placeholder="ex: robe-ete-fluide" className={inputClass} />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="block text-neutral-600 mb-1">Description</span>
          <textarea name="description" defaultValue={product?.description} rows={3} className={inputClass} />
        </label>

        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Catégorie</span>
          <select name="categoryId" defaultValue={product?.categoryId} className={inputClass} required>
            <option value="" disabled>
              Choisir...
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Stock</span>
          <input type="number" name="stock" defaultValue={product?.stock ?? 0} className={inputClass} />
        </label>

        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Prix</span>
          <input type="number" step="0.01" name="price" defaultValue={product ? Number(product.price) : ""} className={inputClass} required />
        </label>

        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Prix barré (optionnel)</span>
          <input
            type="number"
            step="0.01"
            name="comparePrice"
            defaultValue={product?.comparePrice ? Number(product.comparePrice) : ""}
            className={inputClass}
          />
        </label>

        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Tailles (séparées par virgule)</span>
          <input name="sizes" defaultValue={product?.sizes.join(", ")} placeholder="S, M, L" className={inputClass} />
        </label>

        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Couleurs (séparées par virgule)</span>
          <input name="colors" defaultValue={product?.colors.join(", ")} placeholder="Noir, Beige" className={inputClass} />
        </label>

        <label className="block text-sm">
          <span className="block text-neutral-600 mb-1">Ordre d&apos;affichage</span>
          <input type="number" name="sortOrder" defaultValue={product?.sortOrder ?? 0} className={inputClass} />
        </label>

        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
            Mis en avant
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="isVisible" defaultChecked={product?.isVisible ?? true} />
            Visible
          </label>
        </div>
      </div>

      {product && product.images.length > 0 && (
        <div>
          <span className="block text-sm text-neutral-600 mb-1">Images actuelles</span>
          <div className="flex flex-wrap gap-3">
            {product.images.map((url) => (
              <label key={url} className="relative block">
                <Image src={url} alt="" width={72} height={90} className="rounded-lg object-cover border border-neutral-200 h-[90px] w-[72px]" unoptimized />
                <span className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <input type="checkbox" name="removeImages" value={url} />
                  Supprimer
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Ajouter des images</span>
        <input type="file" name="images" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="text-sm" />
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
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-neutral-800">
          Annuler
        </Link>
      </div>
    </form>
  );
}
