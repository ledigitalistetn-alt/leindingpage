"use client";

import { useState } from "react";
import Image from "next/image";
import type { SerializedProduct } from "@/lib/serialize";
import { buildWhatsAppLink } from "@/lib/whatsapp";

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

  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);

  const messageParts = [`Bonjour ${siteName}, je suis intéressé(e) par : ${product.name}`];
  if (size) messageParts.push(`Taille : ${size}`);
  if (color) messageParts.push(`Couleur : ${color}`);
  const whatsappHref = buildWhatsAppLink(whatsappNumber, messageParts.join("\n"));

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
            whatsappNumber ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 font-body text-sm uppercase tracking-wide"
                style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
              >
                Commander via WhatsApp
              </a>
            ) : (
              <p className="text-sm opacity-60" style={{ color: "var(--color-text)" }}>
                Contactez-nous pour commander ce produit.
              </p>
            )
          ) : (
            <p className="text-sm text-red-600">Rupture de stock</p>
          )}
        </div>
      </div>
    </div>
  );
}
