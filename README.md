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
- 
