import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type OrderItemInput = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};

export async function createOrderWithStockUpdate(data: {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  notes?: string;
  items: OrderItemInput[];
}) {
  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    const itemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error("Produit introuvable");

      const price = Number(product.price);
      totalAmount += price * item.quantity;

      itemsData.push({
        product: { connect: { id: product.id } },
        productName: product.name,
        price,
        quantity: item.quantity,
        size: item.size ?? "",
        color: item.color ?? "",
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: Math.max(0, product.stock - item.quantity) },
      });
    }

    return tx.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress ?? "",
        notes: data.notes ?? "",
        totalAmount,
        items: { create: itemsData },
      },
      include: { items: true },
    });
  });
}

/** Restore stock for every item of an order (e.g. when it's cancelled). */
export async function restoreStockForOrder(orderId: string) {
  await prisma.$transaction(async (tx) => {
    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
  });
}

/** Re-deduct stock for every item of an order (e.g. an order is un-cancelled). */
export async function deductStockForOrder(orderId: string) {
  await prisma.$transaction(async (tx) => {
    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      if (item.productId) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: Math.max(0, product.stock - item.quantity) },
          });
        }
      }
    }
  });
}
