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
- **API Design**: Simple REST API under `/api/` prefix
  - `POST /api/leads` — Create a new lead (validated with Zod)
  - `GET /api/leads` — Retrieve all leads (ordered by creation date, newest first)
- **Development**: Vite dev server is integrated as middleware (in `server/vite.ts`) for HMR during development
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

### Data Storage
- **Database**: PostgreSQL via `node-postgres` (`pg` package)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema** (in `shared/schema.ts`):
  - `users` table: `id` (UUID, auto-generated), `username` (unique), `password`
  - `leads` table: `id` (UUID), `name`, `phone`, `email`, `interest`, `source` (defaults to "contact_form"), `diagnosticStep` (optional integer), `createdAt`
- **Validation**: Drizzle-Zod generates insert schemas; Zod schemas are shared between client and server
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Connection**: Uses `DATABASE_URL` environment variable

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

## External Dependencies

### Database
- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable. Required for the application to run.

### Webhook Integration
- **n8n Webhook** — Optional. If `N8N_WEBHOOK_URL` environment variable is set, new leads are POSTed to this URL for automation workflows (e.g., email notifications, CRM sync). Failure is non-blocking (logged but doesn't affect lead creation).

### Environment Variables
| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `N8N_WEBHOOK_URL` | No | n8n webhook endpoint for lead notifications |

### Key NPM Dependencies
- **Frontend**: React, Wouter, TanStack React Query, Framer Motion, shadcn/ui (Radix UI), Tailwind CSS v4
- **Backend**: Express 5, Drizzle ORM, node-postgres, Zod
- **Build**: Vite, esbuild, tsx
- **Replit-specific**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`