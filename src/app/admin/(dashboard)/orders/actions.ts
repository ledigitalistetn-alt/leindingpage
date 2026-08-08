"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { createOrderWithStockUpdate, restoreStockForOrder, deductStockForOrder } from "@/lib/orders";
import type { OrderStatus } from "@prisma/client";

export type FormState = { error?: string };

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireSession();

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return;

  if (status === "CANCELLED" && order.status !== "CANCELLED") {
    await restoreStockForOrder(id);
  } else if (order.status === "CANCELLED" && status !== "CANCELLED") {
    await deductStockForOrder(id);
  }

  await prisma.order.update({ where: { id }, data: { status } });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}

export async function deleteOrder(id: string) {
  await requireSession();

  const order = await prisma.order.findUnique({ where: { id } });
  if (order && order.status !== "CANCELLED") {
    await restoreStockForOrder(id);
  }
  await prisma.order.delete({ where: { id } });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}

export async function createManualOrder(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const customerName = String(formData.get("customerName") || "").trim();
  const customerPhone = String(formData.get("customerPhone") || "").trim();
  const customerAddress = String(formData.get("customerAddress") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const productId = String(formData.get("productId") || "");
  const quantity = Math.max(1, Number(formData.get("quantity") || 1));
  const size = String(formData.get("size") || "").trim();
  const color = String(formData.get("color") || "").trim();

  if (!customerName || !customerPhone) return { error: "Nom et téléphone du client requis" };
  if (!productId) return { error: "Choisissez un produit" };

  try {
    await createOrderWithStockUpdate({
      customerName,
      customerPhone,
      customerAddress,
      notes,
      items: [{ productId, quantity, size, color }],
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur lors de l'enregistrement" };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  redirect("/admin/orders");
}
