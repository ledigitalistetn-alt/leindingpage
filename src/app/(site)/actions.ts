"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createOrderWithStockUpdate } from "@/lib/orders";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Nom requis"),
  customerPhone: z.string().trim().min(6, "Numéro de téléphone requis"),
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(20),
  size: z.string().optional().default(""),
  color: z.string().optional().default(""),
  whatsappNumber: z.string().optional().default(""),
  siteName: z.string().min(1),
});

export type PublicOrderState = { error?: string; whatsappUrl?: string; success?: boolean };

export async function createPublicOrder(
  _prevState: PublicOrderState,
  formData: FormData
): Promise<PublicOrderState> {
  const parsed = orderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Merci de remplir tous les champs." };
  }

  const { customerName, customerPhone, productId, productSlug, productName, quantity, size, color, whatsappNumber, siteName } =
    parsed.data;

  try {
    await createOrderWithStockUpdate({
      customerName,
      customerPhone,
      items: [{ productId, quantity, size, color }],
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur lors de l'enregistrement de la commande" };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${productSlug}`);
  revalidatePath("/admin");

  const messageParts = [`Bonjour ${siteName}, je viens de passer une commande : ${productName}`];
  if (size) messageParts.push(`Taille : ${size}`);
  if (color) messageParts.push(`Couleur : ${color}`);
  messageParts.push(`Quantité : ${quantity}`);
  messageParts.push(`Nom : ${customerName}`);
  messageParts.push(`Téléphone : ${customerPhone}`);

  const whatsappUrl = whatsappNumber ? buildWhatsAppLink(whatsappNumber, messageParts.join("\n")) : "";

  return { success: true, whatsappUrl };
}
