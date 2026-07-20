<div align="center">

<img src="https://img.shields.io/badge/e--Vaccin-Plateforme%20PEV%20Sénégal-0A3D62?style=for-the-badge&logo=health&logoColor=white" />

# 💉 e-Vaccin

### Plateforme Nationale de Gestion des Carnets de Vaccination — Sénégal

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![License](https://img.shields.io/badge/Licence-Académique-FFB703?style=flat-square)](LICENSE)

</div>

---

## 📋 Présentation

**e-Vaccin** est une application web complète de gestion du Programme Élargi de Vaccination (PEV) au Sénégal. Elle connecte en temps réel les **administrateurs**, **médecins**, **agents de santé** et **parents d'enfants** autour d'un carnet de vaccination numérique.

### 🎯 Problème résolu
Au Sénégal, le suivi vaccinal des enfants repose encore largement sur des carnets papier facilement perdus. e-Vaccin digitalise ce carnet et le rend accessible depuis n'importe quel appareil.

---

## ✨ Fonctionnalités

| Rôle | Fonctionnalités |
|---|---|
| 🔴 **Admin** | Dashboard global, gestion utilisateurs, statistiques nationales, rapports |
| 🟡 **Médecin** | Enregistrement patients, prescription vaccinations, alertes de retard |
| 🟢 **Agent de santé** | Planning du jour, validation de doses, recherche rapide de patients |
| 🔵 **Parent** | Carnet numérique en lecture seule (sans compte) via Code Patient + Téléphone |

### 🏆 Points forts techniques
- 🎨 **UI Premium** — Design glassmorphism, animations Framer Motion, 3D avec Three.js
- 📱 **Mobile First** — Interface responsive pensée pour les agents en déplacement
- 🔐 **Sécurité JWT** — Authentification stateless par token avec rôles granulaires
- 🌐 **Accès Public Parent** — Consultation du carnet sans création de compte
- ⚡ **Temps réel** — Alertes automatiques pour les vaccins en retard

---

## 🖼️ Aperçu

| Page de connexion (3D DNA) | Dashboard Admin | Carnet Numérique Parent |
|---|---|---|
| Scène Three.js interactive | Statistiques en temps réel | Timeline vaccinale colorée |

---

## 🏗️ Architecture

```
e-vaccin/
├── 📦 Backend (Java Spring Boot)
│   └── src/main/java/com/evaccin/
│       ├── config/          # Security, JWT, CORS, DataInitializer
│       ├── controller/      # REST API endpoints
│       ├── model/           # Entités JPA (User, Patient, Vaccination, Vaccin...)
│       ├── repository/      # Spring Data JPA repositories
│       ├── security/        # JWT filter & auth
│       └── service/         # Logique métier
│
└── 🎨 Frontend (React + Vite)
    └── frontend/src/
        ├── pages/
        │   ├── Auth/            # Login (3D + JWT)
        │   ├── Dashboard/       # Dashboard Admin/Médecin
        │   ├── AgentDashboard/  # 🆕 Planning du jour Agent
        │   ├── PortailParent/   # 🆕 Carnet Numérique Parent (public)
        │   ├── Patients/        # Enregistrement & Détail
        │   ├── Vaccinations/    # Formulaire de vaccination
        │   ├── Alertes/         # Rappels et retards
        │   └── Rapports/        # Statistiques & exports
        ├── components/          # Composants réutilisables
        ├── hooks/               # useAuth, contexte global
        └── services/            # Appels API Axios
```

---

## 🚀 Installation & Démarrage

### Prérequis
- Java 17+
- Node.js 18+
- MySQL 8+ (XAMPP / WAMP)
- Maven

### 1. Cloner le projet

```bash
git clone https://github.com/Ndeye-Diegui-Diedhiou/e-Vaccin.git
cd e-Vaccin
```

### 2. Configurer la base de données

Démarrer MySQL puis créer la base :
```sql
CREATE DATABASE IF NOT EXISTS evaccin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configurer `src/main/resources/application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/evaccin_db
spring.datasource.username=root
spring.datasource.password=          # Votre mot de passe MySQL
```

### 3. Lancer le Backend

```bash
# Windows
.\mvnw spring-boot:run

# Linux / Mac
./mvnw spring-boot:run
```

> ✅ Les tables sont créées automatiquement via Hibernate (`ddl-auto=update`).  
> ✅ Les comptes de test sont injectés automatiquement au premier démarrage.

### 4. Lancer le Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur **http://localhost:5173** (ou le port affiché).

---

## 🔑 Comptes de test

> Ces comptes sont créés automatiquement par le `DataInitializer` au premier démarrage.

| Rôle | Email | Mot de passe | URL de redirection |
|---|---|---|---|
| Admin | `admin@evaccin.sn` | `Admin2026!` | `/` (Dashboard global) |
| Médecin | `medecin@evaccin.sn` | `Medecin2026!` | `/` (Dashboard médecin) |
| Agent | `agent@evaccin.sn` | `Agent2026!` | `/agent-dashboard` |
| **Parent** | *Sans compte* | Code Patient + Téléphone | `/carnet` |

---

## 🔌 API Endpoints

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authentification |
| `GET` | `/api/patients` | Authentifié | Liste des patients |
| `POST` | `/api/patients` | Authentifié | Créer un patient |
| `GET` | `/api/vaccinations` | Authentifié | Toutes les vaccinations |
| `GET` | `/api/vaccinations/carnet` | **Public** | Carnet d'un enfant (parent) |
| `GET` | `/api/vaccinations/planning/jour` | Authentifié | Planning du jour (agent) |
| `GET` | `/api/vaccinations/stats` | Authentifié | Statistiques globales |
| `GET` | `/api/alertes` | Authentifié | Vaccins en retard |
| `GET` | `/api/rapports` | Authentifié | Données de rapport |

---

## 🎨 Design System

```css
--evaccin-primary:  #0A3D62   /* Bleu marine médical */
--evaccin-accent:   #00B4D8   /* Cyan vivant — tech santé */
--evaccin-success:  #06D6A0   /* Vert émeraude — vaccin fait */
--evaccin-warning:  #FFB703   /* Ambre — rappel à venir */
--evaccin-danger:   #EF233C   /* Rouge — retard critique */
```

**Typographie :** `Playfair Display` (titres élégants) + `Inter` (corps de texte)

---

## 🛠️ Stack Technologique

### Backend
- **Spring Boot 3.3** — Framework principal
- **Spring Security + JWT** — Authentification stateless
- **Spring Data JPA + Hibernate** — ORM
- **MySQL 8** — Base de données

### Frontend
- **React 18** — UI
- **Vite 5** — Bundler ultra-rapide
- **Tailwind CSS 3** — Utility-first styling
- **Framer Motion** — Animations premium
- **Three.js + React Three Fiber** — Scène 3D (page login)
- **Lucide React** — Icônes
- **Axios** — Client HTTP

---

## 🗺️ Roadmap

- [x] Authentification JWT multi-rôles
- [x] Dashboard Admin & Médecin
- [x] Gestion des patients et vaccinations
- [x] Alertes de retard automatiques
- [x] Espace Agent de Santé (planning du jour)
- [x] Carnet Numérique Parent (accès public)
- [ ] Notifications SMS (Twilio)
- [ ] Export PDF du carnet vaccinal
- [ ] Mode hors-ligne (PWA)
- [ ] Application mobile React Native
- [ ] Intégration SIGPES Sénégal

---

## 👩‍💻 Autrice

**Ndeye Diegui Diedhiou**  
Étudiante en Licence 2 — Informatique  
Semestre 2 — UE TCPL 2026

---

## 📄 Licence

Projet académique — Usage éducatif uniquement.  
© 2026 — Tous droits réservés.
