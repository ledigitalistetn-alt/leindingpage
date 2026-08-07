-- Manual setup script for environments where `prisma migrate deploy` /
-- `prisma db seed` cannot reach the database directly (e.g. paste this into
-- the Neon SQL Editor). Creates the schema and seeds it with Mac'Moon demo
-- content. Safe to run once on a fresh, empty database.

-- ============ SCHEMA ============

CREATE TYPE "Role" AS ENUM ('ADMIN');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "siteName" TEXT NOT NULL DEFAULT 'Maison Élégance',
    "tagline" TEXT NOT NULL DEFAULT 'Mode moderne, style intemporel',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "primaryColor" TEXT NOT NULL DEFAULT '#111111',
    "secondaryColor" TEXT NOT NULL DEFAULT '#c9a882',
    "accentColor" TEXT NOT NULL DEFAULT '#f5f1eb',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "textColor" TEXT NOT NULL DEFAULT '#111111',
    "headingFont" TEXT NOT NULL DEFAULT 'Playfair Display',
    "bodyFont" TEXT NOT NULL DEFAULT 'Inter',
    "announcementText" TEXT NOT NULL DEFAULT 'Livraison gratuite à partir de 150 DT',
    "announcementActive" BOOLEAN NOT NULL DEFAULT true,
    "heroTitle" TEXT NOT NULL DEFAULT 'La mode qui vous ressemble',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Découvrez notre nouvelle collection, pensée pour un style moderne et affirmé.',
    "heroImageUrl" TEXT NOT NULL DEFAULT '',
    "heroCtaLabel" TEXT NOT NULL DEFAULT 'Découvrir la collection',
    "heroCtaLink" TEXT NOT NULL DEFAULT '#categories',
    "aboutTitle" TEXT NOT NULL DEFAULT 'Notre histoire',
    "aboutText" TEXT NOT NULL DEFAULT 'Nous créons des pièces intemporelles, pensées pour durer et sublimer chaque silhouette.',
    "aboutImageUrl" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@maisonelegance.tn',
    "contactPhone" TEXT NOT NULL DEFAULT '+216 00 000 000',
    "address" TEXT NOT NULL DEFAULT 'Tunis, Tunisie',
    "footerText" TEXT NOT NULL DEFAULT '© Maison Élégance. Tous droits réservés.',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "tiktokUrl" TEXT NOT NULL DEFAULT '',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "currency" TEXT NOT NULL DEFAULT 'DT',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "comparePrice" DECIMAL(10,2),
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============ SEED DATA (Mac'Moon) ============

-- Admin login: admin@fashion.tn / ChangeMe123!  (change this password after first login)
INSERT INTO "User" ("id", "name", "email", "password", "updatedAt")
VALUES ('seed-admin', 'Admin', 'admin@fashion.tn', '$2b$10$3IBQvxKn6cCvmwK1O4Tac.b5.MoPLt9mGhpvWIS.uF2wsI9iK757W', CURRENT_TIMESTAMP);

INSERT INTO "SiteSettings" (
  "id", "siteName", "tagline", "logoUrl",
  "primaryColor", "secondaryColor", "accentColor", "backgroundColor", "textColor",
  "announcementText", "heroTitle", "heroSubtitle", "heroImageUrl",
  "aboutTitle", "aboutText", "aboutImageUrl",
  "contactEmail", "contactPhone", "address", "footerText",
  "instagramUrl", "facebookUrl", "whatsappNumber", "updatedAt"
) VALUES (
  'main', 'Mac''Moon', 'Always Different...', '/uploads/seed/logo-macmoon.svg',
  '#111111', '#7fa88d', '#f4f1ec', '#ffffff', '#111111',
  'Offre duo : 2 ensembles à 60 DT', 'La mode qui vous rassemble',
  'Des ensembles enfants, femme et accessoires pensés pour être toujours différents.',
  '/uploads/seed/hero.svg',
  'Notre histoire',
  'Mac''Moon habille toute la famille avec des pièces confortables et toujours différentes, pour la fille, le garçon et la femme.',
  '/uploads/seed/about.svg',
  'contact@macmoon.tn', '+216 00 000 000', 'Tunisie', '© Mac''Moon. Tous droits réservés.',
  'https://instagram.com', 'https://facebook.com', '21600000000', CURRENT_TIMESTAMP
);

INSERT INTO "Category" ("id", "name", "slug", "imageUrl", "sortOrder", "updatedAt") VALUES
('seed-cat-fille', 'Fille', 'fille', '/uploads/seed/category-fille.svg', 1, CURRENT_TIMESTAMP),
('seed-cat-garcon', 'Garçon', 'garcon', '/uploads/seed/category-garcon.svg', 2, CURRENT_TIMESTAMP),
('seed-cat-femme', 'Femme', 'femme', '/uploads/seed/category-femme.svg', 3, CURRENT_TIMESTAMP),
('seed-cat-accessoires', 'Accessoires', 'accessoires', '/uploads/seed/category-accessoires.svg', 4, CURRENT_TIMESTAMP);

INSERT INTO "Product" (
  "id", "name", "slug", "description", "price", "images", "sizes", "colors",
  "categoryId", "stock", "isFeatured", "updatedAt"
) VALUES
('seed-prod-fille-1', 'Ensemble Fille Music', 'ensemble-fille-music',
 'Ensemble fille t-shirt imprimé + short, confortable et coloré. Offre duo : 2 ensembles à 60 DT.',
 35.00, ARRAY['/uploads/seed/product-fille-1.svg'], ARRAY['2 ans','4 ans','6 ans','8 ans'], ARRAY['Rose'],
 'seed-cat-fille', 20, true, CURRENT_TIMESTAMP),

('seed-prod-fille-2', 'Robe Fille', 'robe-fille',
 'Robe fille légère et confortable pour toutes les occasions.',
 39.00, ARRAY['/uploads/seed/product-fille-2.svg'], ARRAY['2 ans','4 ans','6 ans','8 ans'], ARRAY['Rose poudré'],
 'seed-cat-fille', 15, false, CURRENT_TIMESTAMP),

('seed-prod-garcon-1', 'Ensemble Garçon Music', 'ensemble-garcon-music',
 'Ensemble garçon t-shirt imprimé "This is my lifestyle" + short, disponible en plusieurs couleurs. Offre duo : 2 ensembles à 60 DT.',
 35.00, ARRAY['/uploads/seed/product-garcon-1.svg','/uploads/seed/product-garcon-2.svg','/uploads/seed/product-garcon-3.svg'],
 ARRAY['2 ans','4 ans','6 ans','8 ans'], ARRAY['Vert','Orange','Gris'],
 'seed-cat-garcon', 25, true, CURRENT_TIMESTAMP),

('seed-prod-femme-1', 'Robe d''été fluide', 'robe-ete-fluide',
 'Robe légère en tissu fluide, coupe évasée, idéale pour les journées ensoleillées.',
 129.90, ARRAY['/uploads/seed/product-femme-1.svg'], ARRAY['S','M','L'], ARRAY['Beige','Noir'],
 'seed-cat-femme', 18, true, CURRENT_TIMESTAMP),

('seed-prod-femme-2', 'Blazer structuré', 'blazer-structure',
 'Blazer ajusté à l''épaule structurée, parfait pour un look bureau chic.',
 219.00, ARRAY['/uploads/seed/product-femme-2.svg'], ARRAY['S','M','L','XL'], ARRAY['Noir','Gris'],
 'seed-cat-femme', 12, false, CURRENT_TIMESTAMP),

('seed-prod-accessoire-1', 'Sac en cuir', 'sac-cuir',
 'Sac à main en cuir véritable, finitions soignées, format compact.',
 259.00, ARRAY['/uploads/seed/product-accessoire-1.svg'], ARRAY[]::TEXT[], ARRAY['Camel','Noir'],
 'seed-cat-accessoires', 9, true, CURRENT_TIMESTAMP),

('seed-prod-accessoire-2', 'Foulard imprimé', 'foulard-imprime',
 'Foulard en soie imprimée, accessoire indispensable pour twister une tenue.',
 59.90, ARRAY['/uploads/seed/product-accessoire-2.svg'], ARRAY[]::TEXT[], ARRAY['Multicolore'],
 'seed-cat-accessoires', 22, false, CURRENT_TIMESTAMP);
