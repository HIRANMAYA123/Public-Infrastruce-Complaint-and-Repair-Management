# CivicFix – Public Infrastructure Complaint & Repair Management System

[![Database](https://img.shields.io/badge/Database-MongoDB%209.0-168C83?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TailwindCSS-142D4E?style=for-the-badge&logo=react)](https://reactjs.org)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-059669?style=for-the-badge&logo=node.js)](https://nodejs.org)

**CivicFix** is a modern, enterprise-grade civic technology platform built to streamline the reporting, municipal triage, field repair dispatch, and verification of public infrastructure grievances.

Designed to mirror the sophistication of contemporary software like Linear, Stripe, and modern municipal portals, CivicFix bridges the gap between citizens, municipal administrators, and field engineering crews.

---

## 1. Visual & Architectural Identity

- **Primary Color**: Deep Navy (`#142D4E`)
- **Secondary Color**: Muted Teal (`#168C83`)
- **Background**: Soft Off-White (`#F7F8FA`)
- **Cards**: Pure White (`#FFFFFF`) with subtle borders and shadows
- **Accents**: Warm Amber (`#D97706`) for pending triage, Muted Red (`#DC2626`) for urgent hazards, and Emerald (`#059669`) for verified resolutions
- **Typography**: Inter / Manrope with disciplined hierarchy and comfortable spacing

---

## 2. Technology Stack (MERN Architecture)

### Frontend (`/client`)
- **React 18** with **Vite**
- **Tailwind CSS** (configured with the custom civic design tokens)
- **React Router v6** (with role-guarded protected routes)
- **Lucide React** (modern minimalist iconography)
- **Recharts** (production analytics and trend graphs)
- **Context API** (`AuthContext` and `ToastContext` for floating alerts)

### Backend (`/server`)
- **Node.js** & **Express.js** (modular RESTful API)
- **MongoDB** & **Mongoose** (dynamic operational datastore with schema validators, compound indexes, and aggregation pipelines)
- **JSON Web Tokens (JWT)** & **Bcrypt.js** (secure authentication)
- **Multer** (photographic evidence storage)
- **Morgan** & **CORS**

### MongoDB Database Design (`/database`)
- **`mongo-init.js`**: Collection definitions with `$jsonSchema` validators, compound indexes, and validation rules.
- **`mongo-aggregation-views.js`**: Native aggregation views (`complaint_overview`, `department_complaint_summary`, `worker_performance_summary`).
- **`mongo-queries.js`**: Advanced queries demonstrating multi-collection `$lookup`, multi-stage `$facet`, and atomic transactions.
- **`MONGODB_DOCUMENTATION.md`**: Complete architectural breakdown, document catalog, and Mermaid ER diagram.

---

## 3. Pre-Seeded Demonstration Accounts

CivicFix features **1-Click Quick Demo Switchers** on the login screen (`/login`):

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin@civicfix.gov.in` | `Password123!` | Chief Municipal Commissioner Roy |
| **Citizen** | `citizen@civicfix.org` | `Password123!` | Aarav Patel (Central Promenade) |
| **Field Specialist** | `worker@civicfix.gov.in` | `Password123!` | Ramesh Kumar (Roads & Bridges Specialist) |

---

## 4. Running the Application

### Single Command (Recommended)
Open your terminal in the root workspace and run:

```bash
npm run dev
```

This concurrently starts:
1. **MongoDB**: Auto-connects to or starts local MongoDB on `127.0.0.1:27017`
2. **Express Backend API**: `http://localhost:5001` (auto-seeds sample municipal data)
3. **React Frontend**: `http://localhost:5173` (with `/api` and `/uploads` proxy to `:5001`)

The frontend opens automatically in your operating system's default browser.

### Alternative Individual Commands
- **Start MongoDB manually**: `npm run db:start`
- **Start Backend API only**: `npm run server`
- **Start Frontend only**: `npm run client`
- **Build Frontend**: `npm run build`
- **Re-seed Initial Data**: `npm run seed`
- **Generate Project Description PDF**: `npm run generate:pdf`
