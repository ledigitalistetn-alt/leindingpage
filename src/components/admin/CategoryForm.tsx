"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@prisma/client";
import type { FormState } from "@/app/admin/(dashboard)/categories/actions";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500";

const initialState: FormState = {};

export default function CategoryForm({
  category,
  action,
}: {
  category?: Category;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 max-w-xl">
      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Nom</span>
        <input name="name" defaultValue={category?.name} className={inputClass} required />
      </label>

      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Slug (URL, laissez vide pour auto-générer)</span>
        <input name="slug" defaultValue={category?.slug} placeholder="ex: femme" className={inputClass} />
      </label>

      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Description</span>
        <textarea name="description" defaultValue={category?.description} rows={3} className={inputClass} />
      </label>

      <label className="block text-sm">
        <span className="block text-neutral-600 mb-1">Image</span>
        <div className="flex items-center gap-4">
          {category?.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              width={72}
              height={72}
              className="rounded-lg object-cover border border-neutral-200 h-18 w-18"
              unoptimized
            />
          ) : (
            <div className="h-18 w-18 rounded-lg bg-neutral-100 border border-dashed border-neutral-300" />
          )}
          <input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif" className="text-sm" />
        </div>
      </label>

      <label className="block text-sm w-32">
        <span className="block text-neutral-600 mb-1">Ordre</span>
        <input type="number" name="sortOrder" defaultValue={category?.sortOrder ?? 0} className={inputClass} />
      </label>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="isVisible" defaultChecked={category?.isVisible ?? true} />
        Visible sur le site
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
        <Link href="/admin/categories" className="text-sm text-neutral-500 hover:text-neutral-800">
          Annuler
        </Link>
      </div>
    </form>
  );
}
