"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { slugify } from "@/lib/slugify";

export type FormState = { error?: string };

function splitList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || name);
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price") || 0) || 0;
  const comparePriceRaw = String(formData.get("comparePrice") || "").trim();
  const comparePrice = comparePriceRaw ? Number(comparePriceRaw) : null;
  const costPriceRaw = String(formData.get("costPrice") || "").trim();
  const costPrice = costPriceRaw ? Number(costPriceRaw) : null;
  const categoryId = String(formData.get("categoryId") || "");
  const sizes = splitList(String(formData.get("sizes") || ""));
  const colors = splitList(String(formData.get("colors") || ""));
  const stock = Number(formData.get("stock") || 0) || 0;
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const isFeatured = formData.get("isFeatured") === "on";
  const isVisible = formData.get("isVisible") === "on";
  return {
    name,
    slug,
    description,
    price,
    comparePrice,
    costPrice,
    categoryId,
    sizes,
    colors,
    stock,
    sortOrder,
    isFeatured,
    isVisible,
  };
}

async function uploadNewImages(formData: FormData): Promise<string[]> {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await saveUploadedFile(file));
  }
  return urls;
}

export async function createProduct(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const fields = readProductFields(formData);
  if (!fields.name) return { error: "Le nom est requis" };
  if (!fields.slug) return { error: "Le slug est requis" };
  if (!fields.categoryId) return { error: "La catégorie est requise" };

  const existing = await prisma.product.findUnique({ where: { slug: fields.slug } });
  if (existing) return { error: "Ce slug existe déjà, choisissez-en un autre." };

  let newImages: string[];
  try {
    newImages = await uploadNewImages(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur d'upload" };
  }

  await prisma.product.create({
    data: {
      ...fields,
      images: newImages,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateProduct(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) return { error: "Produit introuvable" };

  const fields = readProductFields(formData);
  if (!fields.name) return { error: "Le nom est requis" };
  if (!fields.slug) return { error: "Le slug est requis" };
  if (!fields.categoryId) return { error: "La catégorie est requise" };

  if (fields.slug !== current.slug) {
    const existing = await prisma.product.findUnique({ where: { slug: fields.slug } });
    if (existing) return { error: "Ce slug existe déjà, choisissez-en un autre." };
  }

  const removeImages = formData.getAll("removeImages").map(String);
  const keptImages = current.images.filter((url) => !removeImages.includes(url));

  let newImages: string[];
  try {
    newImages = await uploadNewImages(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur d'upload" };
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...fields,
      images: [...keptImages, ...newImages],
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireSession();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}
