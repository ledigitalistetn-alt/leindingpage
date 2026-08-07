"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { slugify } from "@/lib/slugify";

export type FormState = { error?: string };

function readCategoryFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || name);
  const description = String(formData.get("description") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const isVisible = formData.get("isVisible") === "on";
  return { name, slug, description, sortOrder, isVisible };
}

export async function createCategory(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const { name, slug, description, sortOrder, isVisible } = readCategoryFields(formData);
  if (!name) return { error: "Le nom est requis" };
  if (!slug) return { error: "Le slug est requis" };

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "Ce slug existe déjà, choisissez-en un autre." };

  let imageUrl = "";
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await saveUploadedFile(file);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erreur d'upload" };
    }
  }

  await prisma.category.create({ data: { name, slug, description, sortOrder, isVisible, imageUrl } });

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return { error: "Catégorie introuvable" };

  const { name, slug, description, sortOrder, isVisible } = readCategoryFields(formData);
  if (!name) return { error: "Le nom est requis" };
  if (!slug) return { error: "Le slug est requis" };

  if (slug !== current.slug) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return { error: "Ce slug existe déjà, choisissez-en un autre." };
  }

  let imageUrl = current.imageUrl;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await saveUploadedFile(file);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erreur d'upload" };
    }
  }

  await prisma.category.update({
    where: { id },
    data: { name, slug, description, sortOrder, isVisible, imageUrl },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireSession();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}
