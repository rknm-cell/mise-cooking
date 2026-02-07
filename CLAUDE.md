# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mise** is an AI-powered recipe and meal planning application built with the T3 Stack (Next.js, TypeScript, tRPC, Tailwind CSS, Drizzle ORM). The app generates personalized recipes using Claude AI, provides cooking assistance, and helps users organize and plan their meals.

## Development Commands

### Essential Commands
```bash
# Development
bun run dev              # Start dev server with Turbo (http://localhost:3000)

# Database
bun run db:push          # Push schema changes to database (for development)
bun run db:generate      # Generate migration files
bun run db:migrate       # Apply migrations
bun run db:studio        # Open Drizzle Studio GUI

# Code Quality
bun run check            # Lint + typecheck (runs both in parallel)
bun run typecheck        # TypeScript type checking only
bun run lint             # ESLint
bun run lint:fix         # Auto-fix linting issues
bun run format:check     # Check formatting with Prettier
bun run format:write     # Auto-format with Prettier

# Testing
bun run test             # Run Vitest unit tests
bun run cypress:open     # Open Cypress for E2E testing

# Build & Deploy
bun run build            # Production build
bun run preview          # Build and preview locally
bun run start            # Start production server
```

### Package Manager
This project uses **Bun** as the package manager and runtime. All dependencies should be installed with `bun install`.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Layer**: tRPC for type-safe APIs
- **Authentication**: Better Auth with Google OAuth
- **AI Integration**: Anthropic Claude API (via Vercel AI SDK)
- **Styling**: Tailwind CSS v4 with Radix UI components
- **Deployment**: Vercel
- **Error Tracking**: Sentry

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API Routes
│   │   ├── generate/             # AI recipe generation endpoint
│   │   ├── cooking-chat/         # AI cooking assistant chat
│   │   ├── user/                 # User data endpoints
│   │   └── trpc/[trpc]/          # tRPC endpoint handler
│   ├── recipes/                  # Recipe pages
│   ├── dashboard/                # User dashboard
│   ├── onboarding/               # User onboarding flow
│   ├── components/               # Page-specific components
│   └── layout.tsx                # Root layout
├── components/                   # Shared React components
├── server/
│   ├── api/
│   │   ├── routers/              # tRPC routers (recipe, shopping)
│   │   ├── trpc.ts               # tRPC context & procedures
│   │   └── root.ts               # Root tRPC router
│   ├── db/
│   │   ├── schema.ts             # Drizzle database schema
│   │   ├── queries.ts            # Database queries
│   │   └── index.ts              # DB client export
│   └── users.ts                  # User utility functions
├── trpc/                         # tRPC client setup
│   ├── react.tsx                 # React Query integration
│   ├── server.ts                 # Server-side tRPC client
│   └── query-client.ts           # Query client config
├── lib/
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Client-side auth utilities
│   └── recipeImageMapper.ts     # Recipe image helpers
└── middleware.ts                 # Next.js middleware (auth)
```

### Path Aliases
The project uses `~/*` as an alias for `src/*`:
```typescript
import { db } from "~/server/db";
import { auth } from "~/lib/auth";
```

## Database Schema

### Core Tables
- **recipe**: Stores generated recipes (name, description, ingredients[], instructions[], nutrition[], etc.)
- **user**: User accounts (from Better Auth)
- **bookmarks**: User-recipe bookmarks (composite PK: userId + recipeId)
- **shopping_lists**: User shopping lists
- **shopping_list_items**: Items within shopping lists
- **session**, **account**, **verification**: Better Auth tables

### Database Workflow
1. **Schema changes**: Edit `src/server/db/schema.ts`
2. **Development**: Run `bun run db:push` to sync changes immediately
3. **Production**: Use `bun run db:generate` then `bun run db:migrate`

### Key Database Functions (src/server/db/queries.ts)
- Recipe: `saveRecipe()`, `getAllRecipes()`, `getRecipeById()`
- Bookmarks: `saveBookmark()`, `removeBookmark()`, `getBookmarks()`, `isBookmarked()`
- Shopping Lists: `createShoppingList()`, `addItemToShoppingList()`, `getShoppingLists()`
- Users: `getUserById()`, `getUserByEmail()`

## API Architecture

### tRPC Routers
Located in `src/server/api/routers/`:
- **recipeRouter**: Recipe CRUD and bookmark operations
- **shoppingRouter**: Shopping list management

tRPC provides end-to-end type safety from server to client. No manual API typing needed.

### REST API Routes
Located in `src/app/api/`:
- **POST /api/generate**: AI recipe generation (streaming)
- **POST /api/cooking-chat**: AI cooking assistant
- **GET /api/cooking-chat/suggestions**: Get cooking suggestions
- **POST /api/cooking-chat/substitutions**: Ingredient substitutions
- **GET/POST /api/user/preferences**: User preferences
- **GET /api/user/viewed-recipes**: User recipe history
- **GET /api/user/cooking-history**: Cooking session history

### Authentication
- **Provider**: Better Auth with Google OAuth
- **Config**: `src/lib/auth.ts`
- **Middleware**: `src/middleware.ts` protects routes
- **Protected procedures**: Use `protectedProcedure` in tRPC routers
- **Session**: 30-day expiration, updates every 24 hours

Protected routes require authentication (enforced by middleware):
- `/dashboard/*`
- `/recipes/*`
- `/profile/*`
- `/settings/*`
- `/onboarding/*`

## AI Integration

### Recipe Generation
- **Endpoint**: `/api/generate/route.ts`
- **Model**: Claude 3.5 Sonnet (via `@ai-sdk/anthropic`)
- **Features**: Streaming responses, context-aware generation based on user preferences
- **Input**: User prompt (ingredients, cuisine, dietary restrictions)
- **Output**: Structured recipe object with ingredients, instructions, nutrition info

### Cooking Assistant Chat
- **Endpoint**: `/api/cooking-chat/route.ts`
- **Model**: Claude 3.5 Sonnet
- **Features**: Conversational cooking help, technique explanations, substitution suggestions
- **Context**: Recipe being cooked, current cooking step

### AI SDK Configuration
The project uses Vercel AI SDK (`ai` package) for:
- Streaming text generation
- Structured output parsing
- Multi-turn conversations
- Tool calling (future feature)

## Component Library

### UI Components
Built with **Radix UI** primitives and **Tailwind CSS**. Components likely in `src/components/`:
- Dialogs, Dropdowns, Tooltips (Radix UI)
- Forms with React Hook Form + Zod validation
- Toast notifications (likely using `sonner`)
- Loading states and skeletons

### Styling Conventions
- **Utility-first**: Tailwind CSS classes
- **Component variants**: Using `class-variance-authority`
- **Responsive**: Mobile-first approach
- **Dark mode**: Supported via `next-themes`

## Testing Strategy

### Unit Tests
- **Framework**: Vitest
- **Location**: `src/__tests__/`
- **Coverage**: Database queries, utilities
- **Mocking**: Database operations are mocked

### E2E Tests
- **Framework**: Cypress
- **Config**: `cypress.config.ts`
- **Usage**: `bun run cypress:open`

### Running Tests
```bash
bun run test        # Run all unit tests
bun run test:watch  # Watch mode (if configured)
```

## Environment Variables

Required in `.env`:
```bash
# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Optional
BLOB_READ_WRITE_TOKEN=...  # For image uploads (Vercel Blob)
SENTRY_DSN=...             # Error tracking
```

## Development Workflow

### Adding a New Feature
1. **Database changes**: Update `src/server/db/schema.ts` if needed
2. **Queries**: Add functions to `src/server/db/queries.ts`
3. **tRPC router**: Add procedures to appropriate router or create new one
4. **UI components**: Build components in `src/app/components/` or `src/components/`
5. **Pages**: Create/update pages in `src/app/`
6. **Types**: TypeScript types are auto-inferred from Drizzle schema and tRPC

### Code Quality
- **ESLint**: Extended from `next` and `typescript-eslint`
- **Prettier**: Configured with Tailwind CSS plugin
- **TypeScript**: Strict mode disabled but `strictNullChecks` enabled
- **Pre-commit**: No hooks configured (consider adding)

### Git Workflow
- **Main branch**: Production-ready code (deployed automatically on Vercel)
- **Feature branches**: Use `feature/[name]` or similar convention

## Key Implementation Details

### Recipe Generation Flow
1. User submits prompt via form
2. Client calls `/api/generate` with user preferences
3. Server streams Claude response back to client
4. Client parses structured recipe object
5. User can save recipe to database via tRPC mutation

### Cooking Mode (Planned Feature)
- Step-by-step recipe navigation
- AI cooking assistant integration
- Session persistence with resume capability
- Timer functionality (future)

### User Onboarding
- New users redirected to `/onboarding`
- Multi-step form for preferences (dietary restrictions, cuisines, skill level)
- Preferences stored in user preferences table (to be implemented)

## Database Migrations

### Migration Files
- **Storage**: `./supabase/migrations/`
- **Generator**: Drizzle Kit

### Migration Commands
```bash
# Generate migration from schema changes
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Push schema directly (dev only - skips migrations)
bun run db:push

# Open Drizzle Studio to view/edit data
bun run db:studio
```

## Performance Considerations

### Image Optimization
- Use Next.js `<Image>` component for automatic optimization
- Recipe images mapped via `recipeImageMapper.ts`
- Future: Vercel Blob for user-uploaded images

### Database Performance
- Implement pagination for recipe lists (not yet implemented)
- Add database indexes for frequently queried fields (see TECHNICAL_PLAN.md)
- Use Drizzle's query builder for optimized queries

### API Rate Limiting
- No rate limiting currently implemented
- Recommended: Add for AI endpoints (recipe generation, chat)

## Monitoring & Debugging

### Error Tracking
- **Sentry** integrated for both client and server
- Config: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- Instrumentation: `src/instrumentation.ts`

### Logging
- Development: Console logs
- Production: Vercel logs + Sentry

### Debugging Tips
- Use `bun run db:studio` to inspect database directly
- tRPC DevTools available in browser console
- Check Vercel deployment logs for production issues

## Deployment

### Vercel Configuration
- **Auto-deploy**: Pushes to main trigger production deployment
- **Preview**: PRs get preview deployments
- **Environment variables**: Set in Vercel dashboard

### Pre-deployment Checklist
1. Run `bun run check` to ensure lint + typecheck pass
2. Run `bun run build` locally to verify build
3. Ensure migrations are applied to production database
4. Verify environment variables in Vercel

## Known Limitations & Technical Debt

### Current State (Per TECHNICAL_PLAN.md)
- **Search**: Basic LIKE queries only (no full-text search yet)
- **Real-time**: Polling instead of WebSocket (cooking sessions)
- **Caching**: No Redis, direct database queries
- **Collections**: Basic bookmarks only (enhanced collections planned)
- **User preferences**: Schema designed but UI incomplete

### Planned Features (See PROJECT_ROADMAP.md)
- Cooking session mode with AI assistant
- Enhanced bookmark system with collections, notes, ratings
- Recipe sharing via links
- User preference-based recommendations
- Shopping list enhancements

## Important Notes

### When Working with This Codebase
1. **Database schema** is the source of truth for types (Drizzle auto-generates)
2. **tRPC** eliminates need for manual API type definitions
3. **Server-only code** must import `"server-only"` (already done in queries.ts)
4. **Client-only code** should import `"client-only"` where needed
5. **Authentication** is handled by middleware; use `protectedProcedure` for authenticated tRPC routes

### Common Tasks
- **Add a new database table**: Edit `schema.ts` → `db:push` → add queries in `queries.ts`
- **Add a new API endpoint**: Create tRPC procedure in appropriate router OR add REST route in `app/api/`
- **Add a new page**: Create in `app/` following App Router conventions
- **Add UI component**: Use Radix UI primitives + Tailwind CSS for consistency

### Documentation References
- Project roadmap: `PROJECT_ROADMAP.md`
- Technical implementation details: `TECHNICAL_PLAN.md`
- Design system: `DESIGN_SYSTEM.md`
- Design improvements: `DESIGN_IMPROVEMENTS.md`
- Phase 1 completion: `PHASE_1_COMPLETE.md`
