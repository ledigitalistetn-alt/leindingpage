"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@prisma/client";

export default function Header({
  siteName,
  logoUrl,
  categories,
}: {
  siteName: string;
  logoUrl: string;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[var(--color-background)]/90 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl sm:text-2xl tracking-wide" style={{ color: "var(--color-text)" }}>
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={40} height={40} className="h-10 w-10 object-contain" unoptimized />
          ) : null}
          {siteName}
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="uppercase tracking-wide hover:opacity-60 transition"
              style={{ color: "var(--color-text)" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2"
          aria-label="Menu"
          style={{ color: "var(--color-text)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-black/5 px-4 py-3 flex flex-col gap-3 font-body text-sm">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              onClick={() => setOpen(false)}
              className="uppercase tracking-wide"
              style={{ color: "var(--color-text)" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
