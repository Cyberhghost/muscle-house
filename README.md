# MUSCLE HOUSE DZ 🏋️

Plateforme e-commerce premium pour compléments sportifs en Algérie.

## Stack Technique

- **Frontend/Backend**: Next.js 16+ (TypeScript, App Router)
- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **State management**: Zustand
- **Validation**: Zod
- **Process manager**: PM2
- **Hébergement**: Hostinger Business

## Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL
- npm

### Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos valeurs

# Générer le client Prisma
npx prisma generate

# Créer les tables de la base de données
npx prisma db push

# Remplir la base avec les données initiales (48 wilayas + admin par défaut)
npx prisma db seed

# Démarrer en développement
npm run dev
```

### Variables d'environnement

Voir `.env.example` pour toutes les variables requises.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `JWT_SECRET` | Secret pour les tokens JWT |

### Identifiants admin par défaut

- **Email**: `admin@musclehouse.dz`
- **Mot de passe**: `admin123`

⚠️ **Changez ces identifiants immédiatement en production!**

## Déploiement sur Hostinger

```bash
# Build
npm run build

# Démarrer avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

## Structure du projet

```
muscle-house/
├── app/
│   ├── (pages publiques)
│   │   ├── page.tsx           # Accueil
│   │   ├── product/[id]/      # Détail produit
│   │   ├── categories/        # Catégories
│   │   ├── promos/            # Promotions
│   │   ├── nouveautes/        # Nouveautés
│   │   ├── cart/              # Panier
│   │   ├── checkout/          # Commande
│   │   ├── tracking/          # Suivi commande
│   │   └── search/            # Recherche
│   ├── admin/                 # Panel admin (protégé)
│   └── api/                   # API routes
├── components/                # Composants réutilisables
├── lib/                       # Utilitaires (prisma, jwt, auth)
├── store/                     # Zustand store (panier)
├── prisma/
│   ├── schema.prisma          # Schéma base de données
│   └── seed.ts                # Données initiales
├── public/                    # Fichiers statiques
├── ecosystem.config.js        # Config PM2
└── .env.example               # Variables d'environnement
```

## Contact

📞 0561 72 78 83 / 0557 53 28 95
📱 [Instagram](https://www.instagram.com/muscle.house_dz)
📘 [Facebook](https://www.facebook.com/share/17foL6TEka/)
