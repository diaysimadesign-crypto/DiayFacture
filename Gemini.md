# Documentation du Projet : DiayFacture

Ce document a été généré pour servir de guide et de référence rapide afin de comprendre l'architecture, les fonctionnalités et les choix techniques du projet **DiayFacture**. Il est particulièrement destiné aux futurs modèles d'IA (ou développeurs) qui interviendront sur le projet.

## 1. Description de l'Application
**DiayFacture** est une application SaaS (Software as a Service) de facturation. Elle permet aux indépendants et aux entreprises de gérer facilement leurs clients, leur catalogue de produits/services, et d'éditer des factures de manière professionnelle. L'application met l'accent sur une interface utilisateur (UI) moderne, claire et très facile à prendre en main.

## 2. Fonctionnalités Implémentées

### 📊 Tableau de Bord (Dashboard)
- **Vue d'ensemble (`/`)** : Affichage des métriques clés (chiffre d'affaires, factures en attente, etc.).

### 📄 Gestion des Factures (`/invoices`)
- **Liste des factures** : Tableau de bord avec suivi des statuts (Brouillon, Envoyée, Payée, En retard).
- **Création de facture (`/invoices/new`)** : 
  - Sélection d'un client (le téléphone est lié).
  - Ajout dynamique de lignes de prestations depuis le catalogue ou saisie libre.
  - Calculs automatiques (Sous-total, TVA 18%, Total TTC).
  - Info-bulle de confirmation de création (Modale) avec options de navigation post-création.
- **Aperçu et Impression (`/invoices/[id]`)** :
  - Aperçu complet de la facture.
  - Optimisation pour l'impression (Génération PDF) : les éléments de navigation (Header, Sidebar) et les boutons d'action sont masqués (`print:hidden`) lors de l'impression.
- **Modification et Suppression** : Édition d'une facture existante ou suppression avec confirmation.
- **Gestion du statut** : Boutons d'actions rapides pour marquer une facture comme "Envoyée" ou "Payée".

### 👥 Gestion des Clients (`/clients`)
- Listing des clients.
- Enregistrement des informations de base (Nom, Email, Téléphone, Adresse).

### 📦 Gestion du Catalogue (`/products`)
- Liste des produits et services pré-enregistrés pour une création de facture plus rapide.

### ⚙️ Paramètres (`/settings`)
- Configuration du profil de l'entreprise (Nom, Email).

---

## 3. Technologies Utilisées

- **Framework Core** : [Next.js 14](https://nextjs.org/) (App Router).
- **Bibliothèque UI** : [React 18](https://react.dev/).
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) pour le design système, les utilitaires réactifs, et la gestion du mode impression (`print:`).
- **Gestion d'état global** : [Zustand](https://github.com/pmndrs/zustand) (Utilisé pour stocker les factures, clients, produits et paramètres côté client pour l'instant).
- **Icônes** : [Lucide React](https://lucide.dev/).
- **Notifications (Toasts)** : [Sonner](https://sonner.emilkowal.ski/).
- **Formulaires & Validation** : `react-hook-form` & `zod` (Disponibles dans les dépendances pour la gestion des formulaires).

---

## 4. Structure des Fichiers

La structure suit les conventions du **Next.js App Router** :

```text
src/
├── app/
│   ├── (dashboard)/            # Groupe de routes pour l'interface connectée
│   │   ├── layout.tsx          # Layout principal (Sidebar + Header)
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── clients/            # Pages gestion des clients
│   │   ├── invoices/           # Pages factures (liste, création, détails, édition)
│   │   ├── products/           # Pages catalogue
│   │   └── settings/           # Pages paramètres
│   └── globals.css             # Styles globaux (Tailwind)
├── components/
│   └── layout/                 # Composants d'interface globaux
│       ├── header.tsx          # Barre de navigation supérieure
│       ├── sidebar.tsx         # Menu latéral (Desktop)
│       └── mobile-nav.tsx      # Menu hamburger (Mobile)
└── store/                      # Gestionnaires d'état (Zustand)
    ├── client-store.ts         
    ├── invoice-store.ts        
    ├── product-store.ts        
    └── settings-store.ts       
```

---

## 5. Décisions de Design (Architecture & UI)

1. **Client-Side First (Prototypage Rapide)** : 
   Pour l'instant, l'application utilise **Zustand** avec des données initiales mockées (`initialInvoices`, `initialClients`). Cela permet un développement UI/UX extrêmement rapide sans dépendre d'un backend. Les actions (Create, Update, Delete) mutent le store local.
2. **Impression Optimisée (Print-friendly)** : 
   La classe utilitaire Tailwind `print:hidden` est largement exploitée pour s'assurer que lors de la génération PDF de la facture, seuls les éléments pertinents du reçu sont conservés. L'affichage des données (ex: grille de prestation) gère aussi un mode `overflow-x-auto` et une largeur minimale pour ne pas s'écraser sur les petits écrans.
3. **UX Sans Frictions** : 
   Ajout de modales de succès douces (au lieu de simples redirections) pour informer l'utilisateur qu'une action importante a réussi, avec des raccourcis logiques (ex: télécharger directement après la création).

---

## 6. 🤖 Instructions pour les Futurs Modèles (IA)

Si on vous donne ce projet à modifier ou analyser, voici les points de repère critiques :

1. **Ne cherchez pas de base de données backend pour l'instant** : Toutes les données "vivent" dans les fichiers situés sous `src/store/`. Si vous devez ajouter un champ (ex: `clientPhone` dans les factures), vous devez mettre à jour le type dans le store concerné.
2. **Système de Routing** : Le layout principal est dans `src/app/(dashboard)/layout.tsx`. N'essayez pas de retirer la Sidebar ou le Header de pages individuelles (comme l'aperçu facture) via React ; gérez plutôt leur visibilité via Tailwind (ex: `print:hidden`).
3. **Responsive Design** : Soyez très attentif aux modifications sur les grilles de factures (`grid-cols-12`). Le tableau de facturation doit gérer l'attribut `min-w-[500px]` sur les petits écrans dans un conteneur en `overflow-x-auto` afin de rester lisible.
4. **Composants d'icônes** : Utilisez exclusivement `lucide-react`. Vérifiez toujours vos imports lorsque vous copiez-collez des composants. (Rappel : Une erreur classique est d'utiliser `<CheckCircle2 />` sans l'importer).
5. **Composants Next.js** : Privilégiez l'utilisation de `Link` (`next/link`) pour la navigation afin d'assurer un routing côté client fluide. N'utilisez pas `<a>`.

---
*Fichier généré automatiquement pour le maintien et la passation de l'application DiayFacture.*
