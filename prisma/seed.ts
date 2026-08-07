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
      siteName: "Mac'Moon",
      tagline: "Always Different...",
      logoUrl: "/uploads/seed/logo-macmoon.svg",
      primaryColor: "#111111",
      secondaryColor: "#7fa88d",
      accentColor: "#f4f1ec",
      backgroundColor: "#ffffff",
      textColor: "#111111",
      announcementText: "Offre duo : 2 ensembles à 60 DT",
      heroTitle: "La mode qui vous rassemble",
      heroSubtitle: "Des ensembles enfants, femme et accessoires pensés pour être toujours différents.",
      heroImageUrl: "/uploads/seed/hero.svg",
      aboutTitle: "Notre histoire",
      aboutText:
        "Mac'Moon habille toute la famille avec des pièces confortables et toujours différentes, pour la fille, le garçon et la femme.",
      aboutImageUrl: "/uploads/seed/about.svg",
      contactEmail: "contact@macmoon.tn",
      contactPhone: "+216 00 000 000",
      address: "Tunisie",
      footerText: "© Mac'Moon. Tous droits réservés.",
      instagramUrl: "https://instagram.com",
      facebookUrl: "https://facebook.com",
      whatsappNumber: "21600000000",
    },
  });

  const categories = [
    { name: "Fille", slug: "fille", imageUrl: "/uploads/seed/category-fille.svg", sortOrder: 1 },
    { name: "Garçon", slug: "garcon", imageUrl: "/uploads/seed/category-garcon.svg", sortOrder: 2 },
    { name: "Femme", slug: "femme", imageUrl: "/uploads/seed/category-femme.svg", sortOrder: 3 },
    {
      name: "Accessoires",
      slug: "accessoires",
      imageUrl: "/uploads/seed/category-accessoires.svg",
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
      name: "Ensemble Fille Music",
      slug: "ensemble-fille-music",
      description: "Ensemble fille t-shirt imprimé + short, confortable et coloré. Offre duo : 2 ensembles à 60 DT.",
      price: 35.0,
      images: ["/uploads/seed/product-fille-1.svg"],
      sizes: ["2 ans", "4 ans", "6 ans", "8 ans"],
      colors: ["Rose"],
      categorySlug: "fille",
      stock: 20,
      isFeatured: true,
    },
    {
      name: "Robe Fille",
      slug: "robe-fille",
      description: "Robe fille légère et confortable pour toutes les occasions.",
      price: 39.0,
      images: ["/uploads/seed/product-fille-2.svg"],
      sizes: ["2 ans", "4 ans", "6 ans", "8 ans"],
      colors: ["Rose poudré"],
      categorySlug: "fille",
      stock: 15,
      isFeatured: false,
    },
    {
      name: "Ensemble Garçon Music",
      slug: "ensemble-garcon-music",
      description:
        "Ensemble garçon t-shirt imprimé \"This is my lifestyle\" + short, disponible en plusieurs couleurs. Offre duo : 2 ensembles à 60 DT.",
      price: 35.0,
      images: [
        "/uploads/seed/product-garcon-1.svg",
        "/uploads/seed/product-garcon-2.svg",
        "/uploads/seed/product-garcon-3.svg",
      ],
      sizes: ["2 ans", "4 ans", "6 ans", "8 ans"],
      colors: ["Vert", "Orange", "Gris"],
      categorySlug: "garcon",
      stock: 25,
      isFeatured: true,
    },
    {
      name: "Robe d'été fluide",
      slug: "robe-ete-fluide",
      description: "Robe légère en tissu fluide, coupe évasée, idéale pour les journées ensoleillées.",
      price: 129.9,
      images: ["/uploads/seed/product-femme-1.svg"],
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
      images: ["/uploads/seed/product-femme-2.svg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Noir", "Gris"],
      categorySlug: "femme",
      stock: 12,
      isFeatured: false,
    },
    {
      name: "Sac en cuir",
      slug: "sac-cuir",
      description: "Sac à main en cuir véritable, finitions soignées, format compact.",
      price: 259.0,
      images: ["/uploads/seed/product-accessoire-1.svg"],
      sizes: [],
      colors: ["Camel", "Noir"],
      categorySlug: "accessoires",
      stock: 9,
      isFeatured: true,
    },
    {
      name: "Foulard imprimé",
      slug: "foulard-imprime",
      description: "Foulard en soie imprimée, accessoire indispensable pour twister une tenue.",
      price: 59.9,
      images: ["/uploads/seed/product-accessoire-2.svg"],
      sizes: [],
      colors: ["Multicolore"],
      categorySlug: "accessoires",
      stock: 22,
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
