"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/login/actions";

const links = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/settings", label: "Design & Contenu" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-neutral-950 text-neutral-200 flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-neutral-800">
        <p className="font-semibold tracking-wide">Admin Boutique</p>
        <p className="text-xs text-neutral-500 mt-0.5">Fashion Landing</p>
      </div>
      <nav className="flex-1 py-4">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-6 py-2.5 text-sm transition ${
                active
                  ? "bg-neutral-800 text-white border-r-2 border-white"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="block text-xs text-neutral-400 hover:text-white px-2"
        >
          Voir le site public →
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left text-sm text-neutral-400 hover:text-white px-2 py-1.5 rounded hover:bg-neutral-900 transition"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
