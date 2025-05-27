# Lococktail - L'encyclopédie interactive des cocktails

Une application web moderne pour découvrir et partager des recettes de cocktails du monde entier.

## Technologies utilisées

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Supabase (PostgreSQL + Auth)
- OAuth (Google & GitHub)

## Prérequis

- Node.js 18+ et npm
- Un compte Supabase
- Comptes développeur Google et GitHub pour OAuth

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/lococktail.git
cd lococktail
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
```env
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-supabase
```

4. Configurez Supabase :
- Créez un nouveau projet sur [Supabase](https://supabase.com)
- Exécutez le script SQL dans `supabase/migrations/20240217_initial_schema.sql`
- Configurez l'authentification OAuth pour Google et GitHub

5. Lancez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
lococktail/
├── app/                    # Routes et pages Next.js
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
├── public/               # Fichiers statiques
├── styles/              # Styles globaux
└── types/               # Types TypeScript
```

## Fonctionnalités

- 🌍 Exploration des cocktails par pays
- 🔍 Recherche et filtrage
- 👤 Authentification OAuth
- ⭐ Système de favoris
- 💬 Commentaires et notes
- 🎯 Quiz sur les cocktails
- 👑 Interface d'administration

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT 