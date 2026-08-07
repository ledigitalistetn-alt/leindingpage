# Fashion Landing Page

Landing page e-commerce pour marques de mode, avec un panneau d'administration complet permettant de tout personnaliser sans toucher au code : couleurs, polices, textes, images, catégories et produits. Pensé pour être dupliqué et revendu à plusieurs clients (chaque client = sa propre instance).

## Stack technique

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [Prisma](https://www.prisma.io/) + PostgreSQL
- Authentification admin maison (cookie de session signé, sans dépendance externe)
- Tailwind CSS v4

## Fonctionnalités

**Site public**
- Page d'accueil : bandeau d'annonce, hero, catégories, produits mis en avant, section à propos, contact
- Pages catégorie et produit dynamiques
- Thème (couleurs + polices) entièrement piloté par la base de données
- Commande de produit via un lien WhatsApp pré-rempli

**Espace admin** (`/admin`)
- **Design & Contenu** : nom du site, logo, couleurs, polices, bandeau d'annonce, hero, section à propos, contact / réseaux sociaux
- **Catégories** : création, modification, suppression, upload d'image
- **Produits** : nom, description, prix (+ prix barré), tailles, couleurs, stock, plusieurs images, mise en avant, visibilité

## Installation

```bash
npm install
cp .env.example .env
# renseigner DATABASE_URL et SESSION_SECRET dans .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Le site est disponible sur `http://localhost:3000`, l'admin sur `http://localhost:3000/admin`.

### Identifiants admin par défaut (seed)

- Email : `admin@fashion.tn`
- Mot de passe : `ChangeMe123!`

Changez ce mot de passe (ou les variables `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` avant de seed) avant toute mise en production.

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `SESSION_SECRET` | Chaîne aléatoire longue (32+ caractères) utilisée pour signer les cookies de session admin |

## Déploiement pour un nouveau client

1. Créer une base PostgreSQL dédiée, mettre à jour `DATABASE_URL`
2. `npx prisma migrate deploy` puis `npx prisma db seed` (ou saisir les données manuellement via l'admin)
3. Se connecter à `/admin` et personnaliser : logo, couleurs, catégories, produits, contact
4. Changer le mot de passe admin

**Stockage des images** : les images uploadées via l'admin sont stockées sur le disque local (`public/uploads`). Sur un hébergement serverless (Vercel, etc.) où le système de fichiers n'est pas persistant, prévoir un stockage externe (S3, Cloudinary...) avant mise en production.
