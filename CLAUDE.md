# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DesignHub Marketplace — a full-stack design asset marketplace (icons, UI kits, templates). UI is entirely in Vietnamese targeting the Vietnamese market. Backend is **Supabase** (PostgreSQL + Auth).

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

No test setup. No TypeScript — pure JavaScript throughout. Server uses CommonJS (`require`), client uses ES modules (`import`). `nodemon` is in root devDependencies but not wired to any script.

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

- **Express.js 5** (server's own `package.json`) on port 5000 (overridable via `PORT` env var). Root `package.json` has a stale Express 4 dependency that is not used at runtime.
- **Supabase** for database and authentication
  - Client initialized in `server/config/supabase.js` using the service_role key (bypasses RLS for server-side queries)
  - Auth uses `supabase.auth.signUp` / `signInWithPassword`; user profiles stored in `profiles` table
- Database schema in `server/supabase-schema.sql`. Tables: `products`, `categories`, `designers`, `pricing_plans`, `pricing_features`, `testimonials`, `site_stats`, `profiles`, `orders`, `order_items`, `reviews`, `wishlists`, `designer_applications`
- All tables have RLS enabled. Public read for most content tables; `profiles`/`wishlists` restricted to owning user; `orders` readable by owning user; `service_role` has full access to `orders`, `order_items`, `reviews`, `wishlists`, `designer_applications`, `designers`
- Products reference categories and designers via foreign keys (`category_id`, `designer_id`) with joins in queries
- Seed data in `server/seed.js` reads from `server/models/data.js` and maps name-based references to IDs

#### Auth & Roles (`server/middleware/auth.js`)

Three-tier role system stored in `profiles.role`: `user` (default), `designer`, `admin`.

Middleware functions:
- `requireAuth` — verifies JWT via Supabase `getUser()`, attaches `req.user` (id, email, role, name) from profiles table
- `requireAdmin` — chains `requireAuth` then checks `role === 'admin'`
- `requireDesigner` — chains `requireAuth` then checks `role === 'designer'`
- `optionalAuth` — attaches `req.user` if token present, does not block unauthenticated requests

#### Routes (`server/routes/api.js`)

All routes mounted at `/api`. Controllers map snake_case DB columns to camelCase in responses. All responses follow `{ success: boolean, data: any, total?: number }`.

| Prefix | Controller | Auth | Key endpoints |
|--------|-----------|------|---------------|
| `/api/products`, `/api/categories` | `productController` | public | GET list (supports `?filter=free\|pro\|new`, `?search=`, `?category=`), GET `:id` |
| `/api/auth` | `authController` | public | POST `register`, POST `login` |
| `/api/pricing`, `/api/designers`, `/api/testimonials`, `/api/stats` | `siteController` | public | GET each resource; GET `designers/:id` for public profile |
| `/api/orders` | `orderController` | mixed | POST (public, creates order + order_items); GET list/`:id` (requireAuth) |
| `/api/reviews` | `reviewController` | mixed | GET (public); POST (requireAuth, one review per user per product) |
| `/api/profile` | `profileController` | requireAuth | GET, PUT |
| `/api/wishlist` | `wishlistController` | requireAuth | GET, POST, DELETE `:productId` |
| `/api/designer-applications` | `designerApplicationController` | public POST | POST (anyone can apply) |
| `/api/admin/*` | `adminController` | requireAdmin | CRUD products, orders, designer applications; stats |
| `/api/designer/*` | `designerController` | requireDesigner | CRUD own products; GET stats, orders, analytics; PUT profile |

Pagination helper in `server/helpers/pagination.js` — used by list endpoints.

### Frontend (`client/`)

- **React 19 + Vite 8** on port 3000
- Vite dev server proxies `/api` requests to `localhost:5000`
- `client/src/services/api.js` — Axios wrapper with auth token interceptors (attaches `Authorization` header from localStorage, clears token on 401). Auth stored via `saveAuth()`/`clearAuth()` helpers.
- Cart state via `client/src/hooks/useCart.jsx` — persisted in localStorage
- Toast notifications via `client/src/hooks/useToast.jsx`
- Components are co-located with their CSS (e.g., `Header.jsx` + `Header.css`)
- Global UI state lives in `App.jsx` (user, auth modal, cart drawer, toasts) and is passed down via props — no context providers or state management library
- Dependencies: `lucide-react` (icons), `react-router-dom` (routing)

#### Route Map

| Path | Component | Notes |
|------|-----------|-------|
| `/` | Landing page | Hero, ProductGrid, Categories, HowItWorks, Pricing, Designers, Testimonials, CTA |
| `/danh-muc/:slug` | `CategoryPage` | Category detail |
| `/san-pham/:id` | `ProductDetailPage` | Product detail with reviews |
| `/thanh-toan` | `CheckoutPage` | Checkout (COD payment) |
| `/tim-kiem` | `SearchPage` | Product search |
| `/yeu-thich` | `WishlistPage` | User wishlist (auth) |
| `/tai-khoan` | `AccountPage` | User profile (auth) |
| `/don-hang` | `OrderHistoryPage` | Order history (auth) |
| `/dang-ky-designer` | `DesignerRegisterPage` | Designer application form |
| `/quen-mat-khau` | `ForgotPasswordPage` | Password reset |
| `/designer/:id` | `DesignerPublicProfile` | Public designer profile |
| `/admin` | `AdminLayout` (nested) | Dashboard, san-pham, don-hang, designer |
| `/designer` | `DesignerLayout` (nested) | Dashboard, san-pham, don-hang, thong-ke, cai-dat |

On successful login, `handleAuthSuccess` auto-redirects: admin → `/admin`, designer → `/designer`.

### Production Serving

In production mode (`NODE_ENV=production`), the Express server serves the built React app from `client/dist` as static files with a catch-all fallback to `index.html`.
