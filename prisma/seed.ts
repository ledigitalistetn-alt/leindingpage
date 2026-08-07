import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@fashion.tn";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const hashed = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashed,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Maison Élégance",
      tagline: "Mode moderne, style intemporel",
      heroImageUrl: "/uploads/seed/hero.svg",
      aboutImageUrl: "/uploads/seed/about.svg",
      instagramUrl: "https://instagram.com",
      facebookUrl: "https://facebook.com",
      whatsappNumber: "21600000000",
    },
  });

  const categories = [
    { name: "Femme", slug: "femme", imageUrl: "/uploads/seed/category-femme.svg", sortOrder: 1 },
    { name: "Homme", slug: "homme", imageUrl: "/uploads/seed/category-homme.svg", sortOrder: 2 },
    {
      name: "Accessoires",
      slug: "accessoires",
      imageUrl: "/uploads/seed/category-accessoires.svg",
      sortOrder: 3,
    },
    {
      name: "Nouveautés",
      slug: "nouveautes",
      imageUrl: "/uploads/seed/category-nouveautes.svg",
      sortOrder: 4,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }

  const products = [
    {
      name: "Robe d'été fluide",
      slug: "robe-ete-fluide",
      description: "Robe légère en tissu fluide, coupe évasée, idéale pour les journées ensoleillées.",
      price: 129.9,
      images: ["/uploads/seed/product-1.svg"],
      sizes: ["S", "M", "L"],
      colors: ["Beige", "Noir"],
      categorySlug: "femme",
      stock: 18,
      isFeatured: true,
    },
    {
      name: "Blazer structuré",
      slug: "blazer-structure",
      description: "Blazer ajusté à l'épaule structurée, parfait pour un look bureau chic.",
      price: 219.0,
      images: ["/uploads/seed/product-2.svg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Noir", "Gris"],
      categorySlug: "femme",
      stock: 12,
      isFeatured: true,
    },
    {
      name: "Chemise en lin",
      slug: "chemise-lin",
      description: "Chemise homme en lin respirant, coupe droite, idéale pour l'été.",
      price: 99.9,
      images: ["/uploads/seed/product-3.svg"],
      sizes: ["M", "L", "XL"],
      colors: ["Beige", "Blanc"],
      categorySlug: "homme",
      stock: 20,
      isFeatured: true,
    },
    {
      name: "Pantalon chino",
      slug: "pantalon-chino",
      description: "Pantalon chino slim-fit, confortable et élégant au quotidien.",
      price: 139.0,
      images: ["/uploads/seed/product-4.svg"],
      sizes: ["38", "40", "42", "44"],
      colors: ["Gris", "Noir"],
      categorySlug: "homme",
      stock: 15,
      isFeatured: false,
    },
    {
      name: "Sac en cuir",
      slug: "sac-cuir",
      description: "Sac à main en cuir véritable, finitions soignées, format compact.",
      price: 259.0,
      images: ["/uploads/seed/product-5.svg"],
      sizes: [],
      colors: ["Camel", "Noir"],
      categorySlug: "accessoires",
      stock: 9,
      isFeatured: true,
    },
    {
      name: "Manteau long",
      slug: "manteau-long",
      description: "Manteau long en laine mélangée, coupe ample, pour un hiver élégant.",
      price: 349.0,
      images: ["/uploads/seed/product-6.svg"],
      sizes: ["S", "M", "L"],
      colors: ["Vert foncé", "Noir"],
      categorySlug: "nouveautes",
      stock: 7,
      isFeatured: true,
    },
    {
      name: "Foulard imprimé",
      slug: "foulard-imprime",
      description: "Foulard en soie imprimée, accessoire indispensable pour twister une tenue.",
      price: 59.9,
      images: ["/uploads/seed/product-7.svg"],
      sizes: [],
      colors: ["Multicolore"],
      categorySlug: "accessoires",
      stock: 22,
      isFeatured: false,
    },
    {
      name: "Baskets minimalistes",
      slug: "baskets-minimalistes",
      description: "Baskets au design épuré, semelle confortable, pour un style casual chic.",
      price: 189.0,
      images: ["/uploads/seed/product-8.svg"],
      sizes: ["38", "39", "40", "41", "42", "43"],
      colors: ["Blanc", "Gris"],
      categorySlug: "nouveautes",
      stock: 30,
      isFeatured: false,
    },
  ];

  for (const p of products) {
    const { categorySlug, ...data } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...data,
        categoryId: createdCategories[categorySlug],
      },
    });
  }

  console.log("Seed terminé.");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
