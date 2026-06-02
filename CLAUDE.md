# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DesignHub Marketplace — a full-stack design asset marketplace (icons, UI kits, templates). The UI is entirely in Vietnamese targeting the Vietnamese market. Backend is **Supabase** (PostgreSQL + Auth).

## Commands

```bash
# Install all dependencies (root + client — server must be installed separately)
npm run install-all
cd server && npm install   # required separately; install-all skips server/

# Development (both server on :5000 and client on :3000)
npm run dev

# Server only
npm run server

# Client only
npm run client

# Production build (client only — outputs to client/dist)
npm run build

# Seed the database (run after setting up Supabase)
cd server && node seed.js

# Lint (client only)
cd client && npm run lint
```

There is no test setup. No TypeScript — pure JavaScript throughout. Server uses CommonJS (`require`), client uses ES modules (`import`). `nodemon` is in root devDependencies but not wired to any script.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `server/supabase-schema.sql` in the Supabase SQL Editor to create tables
3. Copy your Project URL and service_role key into `server/.env` (see `server/.env.example`)
4. Run `cd server && node seed.js` to populate data

Required env vars in `server/.env`:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
PORT=5000
```

## Architecture

**Monorepo layout** — root `package.json` orchestrates `server/` and `client/` via `concurrently`.

### Backend (`server/`)

- **Express.js 5** (server's own `package.json`) on port 5000 (overridable via `PORT` env var). Note: root `package.json` has a stale Express 4 dependency that is not used at runtime.
- **Supabase** for database and authentication
  - Client initialized in `server/config/supabase.js` using the service_role key (bypasses RLS for server-side queries)
  - Auth uses `supabase.auth.signUp` / `signInWithPassword`; user profiles stored in `profiles` table
- Database schema in `server/supabase-schema.sql` — tables: `products`, `categories`, `designers`, `pricing_plans`, `pricing_features`, `testimonials`, `site_stats`, `profiles`, `orders`, `order_items`
- All tables have RLS enabled with public read policies; `profiles` restricts read/update to the owning user
- Products reference categories and designers via foreign keys (`category_id`, `designer_id`) with joins in queries
- Seed data in `server/seed.js` reads from `server/models/data.js` and maps name-based references to IDs
- Route structure: single router in `server/routes/api.js` mounted at `/api`, delegating to four controllers:
  - `productController` — `/api/products`, `/api/products/:id`, `/api/categories` (supports `?filter=free|pro|new`, `?search=`, `?category=`)
  - `authController` — `/api/auth/register`, `/api/auth/login` (Supabase Auth + profiles table)
  - `orderController` — `/api/orders` (POST; creates order + order_items, validates required fields: name, email, phone)
  - `siteController` — `/api/pricing`, `/api/designers`, `/api/testimonials`, `/api/stats`
- All API responses follow `{ success: boolean, data: any, total?: number }`
- Controllers map snake_case DB columns back to camelCase to match the frontend contract

### Frontend (`client/`)

- **React 19 + Vite 8** on port 3000
- Vite dev server proxies `/api` requests to `localhost:5000`
- Routing via React Router DOM (`BrowserRouter` in `main.jsx`):
  - `/` — landing page with Hero, ProductGrid, Categories, HowItWorks, Pricing, Designers, Testimonials, CTA sections
  - `/danh-muc/:slug` — category detail page (`CategoryPage`)
  - `/thanh-toan` — checkout page (`CheckoutPage`)
- `client/src/services/api.js` — Axios wrapper with auth token interceptors (attaches `Authorization` header from localStorage, clears token on 401)
- Auth token and user stored in localStorage via `saveAuth()`/`clearAuth()` helpers in api.js
- Cart state managed via `client/src/hooks/useCart.jsx` — persisted in localStorage
- Toast notifications via `client/src/hooks/useToast.jsx`
- Components are co-located with their CSS (e.g., `Header.jsx` + `Header.css`)
- Global UI state lives in `App.jsx` (user, auth modal, cart drawer, toasts) and is passed down via props — no context providers or state management library
- Dependencies: `lucide-react` (icons), `react-router-dom` (routing)

### Production serving

In production mode (`NODE_ENV=production`), the Express server serves the built React app from `client/dist` as static files with a catch-all fallback to `index.html`.
