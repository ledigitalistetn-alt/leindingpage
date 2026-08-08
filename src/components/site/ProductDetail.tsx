"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import type { SerializedProduct } from "@/lib/serialize";
import { createPublicOrder, type PublicOrderState } from "@/app/(site)/actions";

const initialState: PublicOrderState = {};

export default function ProductDetail({
  product,
  currency,
  whatsappNumber,
  siteName,
}: {
  product: SerializedProduct;
  currency: string;
  whatsappNumber: string;
  siteName: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [state, formAction, isPending] = useActionState(createPublicOrder, initialState);

  useEffect(() => {
    if (state.success && state.whatsappUrl) {
      window.open(state.whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }, [state.success, state.whatsappUrl]);

  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100">
          {product.images[activeImage] ? (
            <Image src={product.images[activeImage]} alt={product.name} fill unoptimized className="object-cover" />
          ) : null}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3 mt-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-16 rounded-md overflow-hidden border-2 ${
                  i === activeImage ? "border-neutral-800" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill unoptimized className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-heading text-3xl" style={{ color: "var(--color-text)" }}>
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xl font-medium" style={{ color: "var(--color-text)" }}>
            {Number(product.price).toFixed(2)} {currency}
          </span>
          {hasDiscount && (
            <span className="text-base line-through opacity-50" style={{ color: "var(--color-text)" }}>
              {Number(product.comparePrice).toFixed(2)} {currency}
            </span>
          )}
        </div>

        {product.description && (
          <p className="mt-6 font-body leading-relaxed opacity-80" style={{ color: "var(--color-text)" }}>
            {product.description}
          </p>
        )}

        {product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-sm mb-2 opacity-70" style={{ color: "var(--color-text)" }}>
              Taille
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition ${
                    size === s ? "border-neutral-800 bg-neutral-800 text-white" : "border-neutral-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors.length > 0 && (
          <div className="mt-4">
            <p className="text-sm mb-2 opacity-70" style={{ color: "var(--color-text)" }}>
              Couleur
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition ${
                    color === c ? "border-neutral-800 bg-neutral-800 text-white" : "border-neutral-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          {product.stock > 0 ? (
            state.success ? (
              <p className="text-sm rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                Commande enregistrée ! Une fenêtre WhatsApp s&apos;est ouverte pour confirmer avec la boutique.
              </p>
            ) : (
              <form action={formAction} className="space-y-3 max-w-sm">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="productSlug" value={product.slug} />
                <input type="hidden" name="productName" value={product.name} />
                <input type="hidden" name="size" value={size} />
                <input type="hidden" name="color" value={color} />
                <input type="hidden" name="whatsappNumber" value={whatsappNumber} />
                <input type="hidden" name="siteName" value={siteName} />

                <input
                  name="customerName"
                  placeholder="Votre nom"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
                />
                <input
                  name="customerPhone"
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
                />
                <label className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text)" }}>
                  Quantité
                  <input
                    name="quantity"
                    type="number"
                    min={1}
                    max={product.stock}
                    defaultValue={1}
                    className="w-20 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-500"
                  />
                </label>

                {state.error && <p className="text-sm text-red-600">{state.error}</p>}

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-block px-8 py-3 font-body text-sm uppercase tracking-wide disabled:opacity-60"
                  style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
                >
                  {isPending ? "Envoi..." : "Commander"}
                </button>
              </form>
            )
          ) : (
            <p className="text-sm text-red-600">Rupture de stock</p>
          )}
        </div>
      </div>
    </div>
  );
}
