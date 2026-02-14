# replit.md

## Overview

This is a **Lead Management** web application that allows users to browse leads (fetched from the JSONPlaceholder external API), attach notes to them, and use AI to generate summaries of those notes. The app follows a full-stack TypeScript architecture with a React frontend and Express backend, backed by PostgreSQL via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, custom fonts (DM Sans, Outfit)
- **Build Tool**: Vite with HMR support
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript, run with `tsx` in development
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod validation schemas shared between client and server
- **AI Integration**: OpenAI SDK configured via Replit AI Integrations environment variables (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`) for note summarization
- **Build**: esbuild for server bundling, Vite for client bundling; output goes to `dist/`

### Shared Layer (`shared/`)
- **Schema**: `shared/schema.ts` defines the database schema using Drizzle ORM's `pgTable` and generates Zod validation schemas with `drizzle-zod`
- **Routes Contract**: `shared/routes.ts` defines API route paths, methods, input schemas, and response schemas — used by both client hooks and server handlers
- **Models**: Additional table definitions exist in `shared/models/chat.ts` for conversations and messages (used by Replit integration modules)

### Database
- **Engine**: PostgreSQL (required, referenced via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-kit` for schema management
- **Schema Push**: Use `npm run db:push` to sync schema to database (not migration-based, uses `drizzle-kit push`)
- **Tables**:
  - `notes` — stores notes with `id`, `leadId`, `content`, `summary` (AI-generated), `createdAt`
  - `conversations` and `messages` — for chat/voice integrations (in `shared/models/chat.ts`)

### Storage Pattern
- `server/storage.ts` defines an `IStorage` interface and `DatabaseStorage` implementation
- All database operations go through the `storage` singleton, making it easy to swap implementations

### Key Data Flow
1. Leads are fetched client-side directly from `https://jsonplaceholder.typicode.com/users` (no backend proxy)
2. Notes are managed via internal API: `GET /api/notes/:leadId`, `POST /api/notes`, `DELETE /api/notes/:id`
3. AI summarization: `POST /api/ai/summarize` sends content to OpenAI and returns a summary
4. Client hooks in `client/src/hooks/` use React Query and reference the shared route definitions for type-safe API calls

### Replit Integrations (Pre-built Modules)
Located in `server/replit_integrations/` and `client/replit_integrations/`:
- **Chat**: Conversation and message CRUD with OpenAI streaming
- **Audio**: Voice recording, playback, speech-to-text, text-to-speech with AudioWorklet
- **Image**: Image generation via `gpt-image-1`
- **Batch**: Concurrent batch processing with rate limiting and retries

These are utility modules that can be registered into the Express app as needed.

### Development vs Production
- **Dev**: `npm run dev` — runs tsx with Vite middleware for HMR
- **Build**: `npm run build` — Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Production**: `npm start` — serves static files from `dist/public` and runs the bundled server

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable
- **OpenAI API**: Used for AI note summarization; configured through Replit AI Integrations env vars (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`)
- **JSONPlaceholder API**: External mock API (`https://jsonplaceholder.typicode.com/users`) used as the lead data source — fetched directly from the browser
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` for development experience on Replit