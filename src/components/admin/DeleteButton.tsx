"use client";

import { useTransition } from "react";

export default function DeleteButton({
  id,
  action,
  label = "Supprimer",
  confirmText = "Êtes-vous sûr de vouloir supprimer cet élément ?",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(confirmText)) {
          startTransition(() => {
            action(id);
          });
        }
      }}
      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
    >
      {isPending ? "..." : label}
    </button>
  );
}
