"use client";

import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export default function StatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as OrderStatus;
        startTransition(() => {
          updateOrderStatus(orderId, value);
        });
      }}
      className="text-sm rounded-md border border-neutral-300 px-2 py-1.5 bg-white disabled:opacity-50"
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
