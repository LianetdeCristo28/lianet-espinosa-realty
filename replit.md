# Replit.md

## Overview

This is a **real estate landing page and lead generation platform** for **Lianet Espinosa Ojeda**, a Realtor® based in Florida. The site is entirely in Spanish and targets buyers, sellers, and investors in the Florida real estate market.

The application is a full-stack TypeScript project with:
- A React single-page application (SPA) as the frontend
- An Express.js API backend for lead capture
- PostgreSQL database for storing leads and user data
- Optional n8n webhook integration for lead notifications/automation

The core user flow is: visitors land on the page → explore sections about buying/selling/investing → interact with a diagnostic quiz or contact form → submit their information as a lead → data is stored and optionally forwarded to an n8n webhook.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight client-side router) — currently only two routes: landing page (`/`) and 404
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin and `tw-animate-css`), with a custom warm/luxury color palette defined via CSS custom properties in `client/src/index.css`
- **UI Components**: shadcn/ui (new-york style) with extensive Radix UI primitives. Components live in `client/src/components/ui/`
- **Animations**: Framer Motion for scroll-triggered animations and transitions
- **State Management**: TanStack React Query for server state; local React state for UI
- **Fonts**: Playfair Display (serif headings) + Inter (sans-serif body) via Google Fonts
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via `tsx` in development
- **Authentication**: express-session with bcrypt password hashing
  - `POST /api/auth/login` — Authenticate with username/password (bcrypt-verified)
  - `POST /api/auth/logout` — Destroy session
  - `GET /api/auth/me` — Check current session status
  - Session config: httpOnly, secure in production, sameSite strict, 2-hour maxAge
  - Admin user auto-created on first startup if not present
- **Rate Limiting**: express-rate-limit with trust proxy
  - Global: 100 requests per IP per 15 min on all `/api/` routes
  - `POST /api/leads`: 5 requests per IP per 15 min
  - `POST /api/auth/login`: 5 attempts per IP per 15 min
  - Standard `RateLimit-*` headers in responses; Spanish error message on limit exceeded
- **Security Headers**: helmet + custom middleware
  - Content-Security-Policy with allowlisted Google Fonts, Lofty portal
  - Strict-Transport-Security, X-Frame-Options: DENY, X-Content-Type-Options: nosniff
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
  - Referrer-Policy: strict-origin-when-cross-origin, X-XSS-Protection: 0
- **CSRF Protection**: csrf-csrf (double-submit cookie pattern)
  - `GET /api/csrf-token` — Returns a CSRF token; sets `__csrf` httpOnly cookie
  - All POST/PUT/DELETE requests to `/api/` require `x-csrf-token` header matching cookie
  - Frontend `apiRequest()` in `lib/queryClient.ts` auto-fetches and sends CSRF tokens
- **API Design**: REST API under `/api/` prefix
  - `GET /api/health` — Health check with DB status
  - `GET /api/csrf-token` — Returns CSRF token
  - `POST /api/leads` — Create a new lead (validated with Zod, public, rate-limited, CSRF-protected)
  - `GET /api/leads` — Retrieve all leads (protected by requireAuth middleware)
  - `GET /api/admin/export-leads` — Download all leads as CSV file (protected by requireAuth middleware)
- **Development**: Vite dev server is integrated as middleware (in `server/vite.ts`) for HMR during development
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

### Data Storage
- **Database**: Supabase PostgreSQL via Connection Pooler (Transaction mode, port 5432)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Uses `SUPABASE_DATABASE_URL` secret (Replit Secrets, NOT in code/config files). Falls back to `DATABASE_URL` if Supabase URL not set.
- **URL parsing**: Uses `pg-connection-string` to parse the URL, then passes individual params to `pg.Pool` with `ssl: { rejectUnauthorized: false }` (required for Supabase pooler compatibility)
- **Schema** (in `shared/schema.ts`):
  - `users` table: `id` (UUID, auto-generated), `username` (unique), `password`
  - `leads` table: `id` (UUID), `fullName`, `email`, `phone`, `city`, `budget`, `bedrooms`, `pool`, `profileType`, `propertyAddress`, `message`, `source`, `consentedAt` (ISO timestamp of privacy consent), `createdAt`
- **Validation**: Drizzle-Zod generates insert schemas with extended Zod refinements (max lengths, regex patterns); sanitize-html strips all HTML tags server-side before validation
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)

### Backup Strategy
- **Supabase Backups**: Automatic daily backups via Supabase dashboard (Plan Pro)
- **JSON Backup Script**: `npx tsx server/scripts/backup.ts` exports all leads to `backups/` directory; retains last 30 files
- **CSV Export**: `GET /api/admin/export-leads` (auth required) downloads leads as CSV with BOM for Excel compatibility
- **Recovery Plan**: Documented in `RECOVERY.md`

### Key Design Patterns
- **Shared schema**: The `shared/` directory contains the database schema and Zod validation types, used by both client and server
- **Storage abstraction**: `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation, making it possible to swap storage backends
- **Build process**: Custom build script (`script/build.ts`) uses Vite for the client and esbuild for the server, with selective dependency bundling via an allowlist

### Landing Page Sections
The landing page (`client/src/pages/landing.tsx`) is composed of these major sections:
1. **Hero** — Full-screen with background image, headline, and CTA
2. **Staircase** (Buyers) — Interactive 9-step home buying process visualization
3. **Vendedores** (Sellers) — Value proposition for sellers
4. **Inversionistas** (Investors) — Investment analysis features
5. **Realtors IA** — AI assistant teaser section
6. **Property Search** — MLS search bar (UI only, not yet connected)
7. **Footer** — Contact info and links
8. **ChatbotAna** — Floating chatbot widget (UI shell, not yet connected to AI)
9. **DiagnosticModal** — Multi-step quiz that captures leads
10. **LeadCaptureModal** — Direct contact form
11. **CookieConsent** — GDPR-style cookie consent banner; controls GA4 and Facebook Pixel loading

### Analytics & Tracking
- **Google Analytics 4**: Loaded dynamically after cookie consent via `client/src/lib/analytics.ts`. Measurement ID injected from `GA4_MEASUREMENT_ID` env var via Vite `define`.
- **Facebook Pixel**: Loaded dynamically after cookie consent. Pixel ID injected from `FB_PIXEL_ID` env var via Vite `define`.
- **Cookie Consent**: Banner in `client/src/components/CookieConsent.tsx`. Preference stored in `localStorage` key `cookie_consent`. Scripts only load after user accepts.
- **Conversion Events** (no PII sent):
  - `lead_submitted` — fired on successful lead form submission (LeadModal, DiagnosticModal)
  - `diagnostic_completed` — fired when diagnostic quiz lead is submitted
  - `property_search_initiated` — fired when user clicks search (PropertySearchSection)
- **CSP**: GA4 and FB Pixel domains added to `script-src`, `connect-src`, and `img-src` in `server/index.ts`

## External Dependencies

### Database
- **Supabase PostgreSQL** — Primary database, connected via `SUPABASE_DATABASE_URL` Replit Secret (Connection Pooler URL). Falls back to `DATABASE_URL` if not set.

### Webhook Integration
- **n8n Webhook** — Optional. If `N8N_WEBHOOK_URL` environment variable is set, new leads are POSTed to this URL for automation workflows (e.g., email notifications, CRM sync). Failure is non-blocking (logged but doesn't affect lead creation).

### Environment Variables
All env vars are centralized in `server/config.ts`. No `process.env` calls exist outside this file.
A `.env.example` template documents every variable.

| Variable | Required | Storage | Purpose |
|----------|----------|---------|---------|
| `SUPABASE_DATABASE_URL` | Yes | Replit Secret | Supabase Connection Pooler URL (postgresql://...) |
| `DATABASE_URL` | Fallback | Replit Secret | PostgreSQL connection string (used if SUPABASE_DATABASE_URL not set) |
| `SESSION_SECRET` | Yes | Replit Secret | Secret key for express-session cookie signing |
| `ADMIN_USERNAME` | No | Env var | Admin username (defaults to "admin") |
| `ADMIN_PASSWORD` | Yes* | Replit Secret | Admin password for initial user creation (*only needed on first run) |
| `N8N_WEBHOOK_URL` | No | Env var | n8n webhook endpoint for lead notifications |
| `GA4_MEASUREMENT_ID` | No | Env var | Google Analytics 4 measurement ID |
| `FB_PIXEL_ID` | No | Env var | Facebook Pixel ID |

### Key NPM Dependencies
- **Frontend**: React, Wouter, TanStack React Query, Framer Motion, shadcn/ui (Radix UI), Tailwind CSS v4
- **Backend**: Express 5, Drizzle ORM, node-postgres, Zod
- **Build**: Vite, esbuild, tsx
- **Replit-specific**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`