# Technical Implementation Plan
**Recipe App - Mise**

Based on technical decisions made: February 5, 2026

---

## Executive Summary

This document outlines the complete technical architecture and implementation plan for the Recipe App. Decisions have been made to prioritize simplicity in the MVP while building a foundation that can scale to support advanced features.

### Key Architectural Decisions
- **Database**: PostgreSQL with Drizzle ORM ✅ (Already set up)
- **Deployment**: Vercel ✅ (Already deployed)
- **Authentication**: OAuth (Google + GitHub)
- **Real-time**: Polling (simple, will scale later)
- **Image Storage**: Vercel Blob
- **Search**: Basic SQL LIKE queries (upgrade later)
- **Caching**: No Redis initially (add when needed)
- **Monitoring**: Minimal logging (Vercel logs)

---

## Current State Analysis

### ✅ Already Implemented

#### Database Schema (`src/server/db/schema.ts`)
1. **Recipe Table**
   - Basic recipe fields (name, description, ingredients, instructions)
   - Nutrition and storage info
   - Image URL support
   - Arrays for ingredients/instructions

2. **User Authentication Tables**
   - User table with OAuth fields
   - Session management
   - Account table for OAuth providers
   - Verification table

3. **Bookmark Table**
   - Simple user-recipe relationship
   - Timestamp tracking
   - Cascade delete on user/recipe deletion

4. **Shopping List Tables** ✅ (Fully implemented!)
   - Shopping lists with user ownership
   - Shopping list items with quantity, unit, category
   - Completion tracking
   - Full CRUD operations

#### Database Queries (`src/server/db/queries.ts`)
✅ Implemented:
- Recipe operations (save, getById, getAll)
- Bookmark operations (save, remove, isBookmarked)
- Shopping list full CRUD
- Generate shopping list from recipe
- User queries

#### Testing (`src/__tests__/queries.test.tsx`)
✅ Tests exist for:
- getAllRecipes
- getRecipeById
- saveRecipe (with error handling)

**Testing Stack**: Vitest with mocking

---

## Phase 1: Authentication & Enhanced User Management

**Priority**: IMMEDIATE (Current focus)

### 1.1 OAuth Implementation

#### Providers to Implement
1. **Google Sign-In** (Priority 1)
2. **GitHub** (Priority 2)

#### Implementation Details
- Use existing auth schema (`auth-schema.ts`)
- Session management already configured
- Token storage in `account` table

#### Tasks
```typescript
// Add OAuth configuration
- [ ] Set up Google OAuth credentials
- [ ] Set up GitHub OAuth credentials
- [ ] Configure OAuth callback URLs in Vercel
- [ ] Implement OAuth sign-in flow
- [ ] Test multi-device session handling
```

### 1.2 User Preferences System

Based on decision: **Collect during onboarding**

#### New Schema Additions Needed

```typescript
// Add to schema.ts
export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  // Dietary Restrictions
  dietaryRestrictions: text("dietary_restrictions").array().default([]),
  // Options: "vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "halal", "kosher"

  // Allergies
  allergies: text("allergies").array().default([]),

  // Cuisine Preferences
  favoriteCuisines: text("favorite_cuisines").array().default([]),
  // Options: "italian", "mexican", "chinese", "japanese", "indian", "thai", "mediterranean", etc.

  // Cooking Profile
  skillLevel: text("skill_level").default("beginner"),
  // Options: "beginner", "intermediate", "advanced"

  spiceTolerance: text("spice_tolerance").default("medium"),
  // Options: "none", "mild", "medium", "hot", "extra-hot"

  // Constraints
  maxCookingTime: integer("max_cooking_time"), // in minutes, nullable
  preferredServingSize: integer("preferred_serving_size").default(2),

  // Kitchen Equipment
  availableEquipment: text("available_equipment").array().default([]),
  // Options: "oven", "stovetop", "microwave", "slow-cooker", "air-fryer", "grill", "blender", "food-processor"

  // Preferences
  mealPrepFriendly: boolean("meal_prep_friendly").default(false),
  quickMealsOnly: boolean("quick_meals_only").default(false),

  // Onboarding
  onboardingCompleted: boolean("onboarding_completed").default(false),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Add relation to user
export const userRelations = relations(user, ({ many, one }) => ({
  bookmarks: many(bookmark),
  shoppingLists: many(shoppingList),
  sessions: many(session),
  accounts: many(account),
  preferences: one(userPreferences, {
    fields: [user.id],
    references: [userPreferences.userId],
  }),
}));
```

#### Implementation Tasks
```typescript
// Queries to add in queries.ts
- [ ] getUserPreferences(userId)
- [ ] createUserPreferences(userId, preferences)
- [ ] updateUserPreferences(userId, updates)
- [ ] checkOnboardingStatus(userId)
```

#### UI Components Needed
```
- [ ] OnboardingFlow component (multi-step form)
  - [ ] Step 1: Dietary restrictions & allergies
  - [ ] Step 2: Cuisine & spice preferences
  - [ ] Step 3: Skill level & time constraints
  - [ ] Step 4: Kitchen equipment
- [ ] User settings page to edit preferences
```

---

## Phase 2: Enhanced Bookmark System

**Priority**: HIGH (Core feature)

Based on decision: **Full featured** (collections + notes + ratings + times cooked)

### 2.1 Schema Enhancements

#### Collections Table
```typescript
export const collection = pgTable("collections", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"), // Optional cover image
  isDefault: boolean("is_default").default(false), // For "Favorites" default collection
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Enhanced bookmarks table
export const recipeCollection = pgTable(
  "recipe_collections",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),

    // Personal notes and tracking
    personalNotes: text("personal_notes"), // User's cooking notes, modifications, tips
    rating: integer("rating"), // 1-5 stars, nullable
    timesCookedCount: integer("times_cooked_count").default(0),
    lastCookedAt: timestamp("last_cooked_at"),

    // Metadata
    addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.recipeId, t.collectionId] }),
  ]
);

// For quick "is favorited" checks without collections
export const quickBookmark = pgTable(
  "quick_bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    bookmarkedAt: timestamp("bookmarked_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.recipeId] })]
);
```

### 2.2 Query Functions Needed

```typescript
// Collection queries
- [ ] createCollection(userId, name, description?, coverImageUrl?)
- [ ] getUserCollections(userId)
- [ ] updateCollection(collectionId, updates)
- [ ] deleteCollection(collectionId)
- [ ] getCollectionRecipes(collectionId)

// Enhanced bookmark queries
- [ ] addRecipeToCollection(userId, recipeId, collectionId, notes?)
- [ ] removeRecipeFromCollection(userId, recipeId, collectionId)
- [ ] updateRecipeInCollection(userId, recipeId, collectionId, updates)
- [ ] recordCooking(userId, recipeId) // Increment timesCookedCount, update lastCookedAt
- [ ] rateRecipe(userId, recipeId, rating)
- [ ] addNotes(userId, recipeId, collectionId, notes)
- [ ] getRecipeCollections(userId, recipeId) // Which collections contain this recipe
- [ ] getRecipeUserData(userId, recipeId) // Get rating, notes, times cooked

// Quick bookmark queries (for simple favorites)
- [ ] quickBookmark(userId, recipeId)
- [ ] quickUnbookmark(userId, recipeId)
- [ ] isQuickBookmarked(userId, recipeId)
```

### 2.3 Migration Strategy

Since `bookmark` table already exists, we need to migrate:

```typescript
// Migration steps:
1. Create new tables (collection, recipeCollection, quickBookmark)
2. Create default "Favorites" collection for existing users
3. Migrate existing bookmarks to quickBookmarks table
4. Optionally migrate to default collections
5. Keep old bookmark table for backward compatibility initially
6. Deprecate and remove old bookmark table in future release
```

---

## Phase 3: Recipe Sharing System

**Priority**: MEDIUM (Enable before social features)

Based on decision: **Share via link** (no full social yet)

### 3.1 Schema Additions

```typescript
export const recipeShare = pgTable("recipe_shares", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipe.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  shareToken: text("share_token").notNull().unique(), // URL-safe token

  // Privacy settings
  isPublic: boolean("is_public").default(false),
  expiresAt: timestamp("expires_at"), // Nullable for permanent shares
  viewCount: integer("view_count").default(0),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lastAccessedAt: timestamp("last_accessed_at"),
});

// Track share views
export const shareView = pgTable("share_views", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  shareId: text("share_id")
    .notNull()
    .references(() => recipeShare.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});
```

### 3.2 API Routes Needed

```typescript
// Share routes
- [ ] POST /api/recipes/[id]/share - Generate share link
- [ ] GET /api/recipes/share/[token] - View shared recipe
- [ ] DELETE /api/recipes/share/[token] - Revoke share link
- [ ] GET /api/user/shares - List user's shared recipes
```

### 3.3 Share Link Format

```
https://yourapp.com/r/[shareToken]
or
https://yourapp.com/recipe/shared/[shareToken]
```

---

## Phase 4: Cooking Session Mode

**Priority**: HIGH (Key differentiator)

Based on decision: **Step-by-step navigation + AI cooking assistant chat** (no timers in MVP)

### 4.1 Schema Additions

```typescript
export const cookingSession = pgTable("cooking_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipe.id, { onDelete: "cascade" }),

  // Session state
  currentStep: integer("current_step").default(0),
  totalSteps: integer("total_steps").notNull(),
  isCompleted: boolean("is_completed").default(false),

  // Timestamps
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),

  // Session data (for resuming)
  sessionData: text("session_data"), // JSON string for any additional state
});

// Chat history for AI cooking assistant
export const cookingChatMessage = pgTable("cooking_chat_messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id")
    .notNull()
    .references(() => cookingSession.id, { onDelete: "cascade" }),

  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),

  // Context
  stepNumber: integer("step_number"), // Which step user was on when asking

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 4.2 Query Functions Needed

```typescript
// Cooking session queries
- [ ] startCookingSession(userId, recipeId)
- [ ] getCookingSession(sessionId)
- [ ] getUserActiveSessions(userId)
- [ ] updateSessionProgress(sessionId, currentStep)
- [ ] completeSession(sessionId)
- [ ] resumeSession(sessionId)
- [ ] deleteSession(sessionId)

// Chat queries
- [ ] saveChatMessage(sessionId, role, content, stepNumber?)
- [ ] getSessionChatHistory(sessionId)
- [ ] clearChatHistory(sessionId)
```

### 4.3 API Routes Needed

```typescript
// Session management
- [ ] POST /api/cooking/session/start
- [ ] GET /api/cooking/session/[id]
- [ ] PATCH /api/cooking/session/[id]/progress
- [ ] POST /api/cooking/session/[id]/complete
- [ ] DELETE /api/cooking/session/[id]

// Chat (already exists at /api/cooking-chat/route.ts)
- [ ] Review and enhance existing chat route
- [ ] Add session context to chat
- [ ] Implement streaming responses
```

### 4.4 UI Components Needed

```
Cooking Mode Interface:
- [ ] CookingModeLayout - Full screen cooking interface
  - [ ] StepNavigator - Previous/Next/Progress indicator
  - [ ] StepDisplay - Current instruction with ingredients
  - [ ] IngredientChecklist - Check off as you use them
  - [ ] AIAssistantPanel - Chat interface (collapsible)
  - [ ] QuickActions - "Pause", "Complete", "Exit" buttons

Chat Interface:
- [ ] ChatMessageList - Display conversation history
- [ ] ChatInput - Input with streaming response support
- [ ] QuickQuestions - Suggested questions based on step
```

### 4.5 Polling Strategy

For real-time features without WebSocket:

```typescript
// Polling intervals
- Session state: Poll every 5 seconds if multiple devices
- Chat updates: Long polling or regular 2-second polls during active chat
- Background updates: Every 30 seconds for notifications

// Implementation
- Use SWR or React Query for automatic polling
- Implement optimistic updates for better UX
- Add exponential backoff on errors
```

---

## Phase 5: Image Storage with Vercel Blob

**Priority**: MEDIUM

### 5.1 Setup

```bash
# Install Vercel Blob SDK
npm install @vercel/blob
```

### 5.2 Implementation

```typescript
// lib/blob-storage.ts
import { put, del } from '@vercel/blob';

export async function uploadRecipeImage(file: File, recipeId: string) {
  const blob = await put(`recipes/${recipeId}/${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}

export async function uploadUserAvatar(file: File, userId: string) {
  const blob = await put(`avatars/${userId}/${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}

export async function deleteImage(url: string) {
  await del(url);
}
```

### 5.3 API Routes

```typescript
- [ ] POST /api/upload/recipe-image
- [ ] POST /api/upload/avatar
- [ ] DELETE /api/upload/delete
```

### 5.4 Use Cases

1. User-uploaded photos of cooked dishes
2. Collection cover images
3. User profile avatars (from OAuth or custom)
4. Future: Recipe step-by-step photos

---

## Phase 6: Search Implementation

**Priority**: MEDIUM (Can enhance later)

Based on decision: **Basic SQL LIKE queries** (simple MVP)

### 6.1 Search Query Function

```typescript
export async function searchRecipes(
  query: string,
  filters?: {
    maxCookingTime?: number;
    dietary?: string[];
    cuisine?: string[];
  }
): Promise<Recipe[]> {
  try {
    let queryBuilder = db.select()
      .from(schema.recipe)
      .where(
        or(
          ilike(schema.recipe.name, `%${query}%`),
          ilike(schema.recipe.description, `%${query}%`),
          // Search in ingredients array - PostgreSQL specific
          sql`${schema.recipe.ingredients}::text ILIKE ${'%' + query + '%'}`
        )
      );

    // Apply filters
    if (filters?.maxCookingTime) {
      // Parse totalTime and filter (needs implementation)
    }

    return await queryBuilder;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
```

### 6.2 Future Enhancements

When ready to scale:
- Implement PostgreSQL full-text search with `tsvector`
- Add search ranking and relevance scoring
- Consider Algolia/Meilisearch for instant search
- Add search history and suggestions

---

## Database Migration Plan

### Current Migration Status
- Migrations stored in: `./supabase/migrations`
- Managed with: Drizzle Kit

### Migration Workflow

```bash
# 1. Make schema changes in src/server/db/schema.ts

# 2. Generate migration
npx drizzle-kit generate

# 3. Review generated SQL in supabase/migrations

# 4. Apply migration to database
npx drizzle-kit push

# Or if using migration files:
npx drizzle-kit migrate
```

### Upcoming Migrations Needed

```
1. user_preferences table
2. collection table
3. recipe_collections table (enhanced bookmarks)
4. quick_bookmarks table
5. recipe_shares table
6. share_views table
7. cooking_sessions table
8. cooking_chat_messages table

Order: Create in sequence, test each migration
```

---

## Testing Strategy

### Current Test Setup
- Framework: **Vitest** ✅
- Existing tests: Recipe queries ✅
- Mocking: Database queries mocked ✅

### Testing Expansion Plan

#### Unit Tests
```typescript
// Priority 1: Core business logic
- [ ] User preferences validation
- [ ] Collection management logic
- [ ] Recipe search functionality
- [ ] Share token generation and validation
- [ ] Cooking session state management

// Priority 2: Utilities
- [ ] Image upload helpers
- [ ] Date/time formatting
- [ ] Recipe parsing utilities
```

#### Integration Tests
```typescript
// API route tests
- [ ] Authentication flow (OAuth callbacks)
- [ ] Recipe CRUD operations
- [ ] Bookmark/collection operations
- [ ] Shopping list operations
- [ ] Cooking session lifecycle
- [ ] Chat message handling
```

#### E2E Tests (Future)
```
When to add: After core features stabilize
Framework: Playwright
Critical flows:
- [ ] User onboarding
- [ ] Recipe generation and saving
- [ ] Cooking mode session
- [ ] Sharing a recipe
```

### Test Coverage Goals
- MVP: 60% coverage on critical paths
- Post-MVP: 80% coverage on business logic
- Skip: UI component testing initially (add later with Storybook)

---

## Development Workflow

### Environment Variables

```bash
# .env.local (required)
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# OAuth credentials
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
```

### Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up database
# (Already using Supabase/hosted Postgres)

# 3. Run migrations
npx drizzle-kit push

# 4. Start dev server (already running)
npm run dev  # or bun run dev

# 5. Open Drizzle Studio (optional)
npx drizzle-kit studio
```

### Git Workflow
```
main branch: production
develop branch: staging (create if needed)
feature branches: feature/[name]
fix branches: fix/[name]

Commit convention:
feat: new feature
fix: bug fix
refactor: code refactoring
test: adding tests
docs: documentation
chore: maintenance
```

---

## Performance Considerations

### Database Optimization

#### Indexes to Add
```sql
-- Recipe search performance
CREATE INDEX idx_recipe_name ON recipe(name);
CREATE INDEX idx_recipe_created_at ON recipe(created_at DESC);

-- User lookups
CREATE INDEX idx_user_email ON user(email);

-- Bookmark queries
CREATE INDEX idx_quick_bookmarks_user_id ON quick_bookmarks(user_id);
CREATE INDEX idx_recipe_collections_user_id ON recipe_collections(user_id);
CREATE INDEX idx_recipe_collections_collection_id ON recipe_collections(collection_id);

-- Cooking sessions
CREATE INDEX idx_cooking_sessions_user_id ON cooking_sessions(user_id);
CREATE INDEX idx_cooking_sessions_active ON cooking_sessions(user_id, is_completed)
  WHERE is_completed = false;

-- Shopping lists
CREATE INDEX idx_shopping_list_user_id ON shopping_lists(user_id);
CREATE INDEX idx_shopping_list_items_list_id ON shopping_list_items(list_id);
```

#### Query Optimization
- Use `select()` with specific fields instead of `findMany()` for large datasets
- Implement pagination early (offset/limit or cursor-based)
- Cache frequently accessed data (user preferences, collections)
- Use database views for complex joins

### Image Optimization
- Compress images before upload (client-side)
- Use Next.js Image component for automatic optimization
- Implement lazy loading for recipe cards
- Generate thumbnails for collection covers

### API Rate Limiting
```typescript
// Rate limiting for AI API calls
- Recipe generation: 10 requests per minute per user
- Cooking chat: 20 messages per minute per session
- Image uploads: 5 uploads per minute per user

// Implementation: Simple in-memory or Vercel KV when needed
```

---

## Security Considerations

### Authentication & Authorization
- [x] OAuth tokens stored securely in database
- [ ] Implement middleware to protect API routes
- [ ] Validate user ownership for all mutations
- [ ] Implement CSRF protection for forms
- [ ] Add rate limiting on auth endpoints

### Data Validation
- [ ] Use Zod schemas for all API inputs
- [ ] Sanitize user inputs (recipe names, notes, etc.)
- [ ] Validate file uploads (type, size)
- [ ] Implement SQL injection protection (Drizzle handles this)

### Privacy
- [ ] User data is private by default
- [ ] Share tokens are unguessable (UUID v4)
- [ ] Implement share expiration
- [ ] Allow users to revoke shares
- [ ] GDPR considerations: data export and deletion (Phase 3)

---

## AI Integration Details

### Claude API Usage

#### Recipe Generation
```typescript
// Current implementation in /api/generate/route.ts
- Model: claude-3-5-sonnet (or latest)
- Temperature: 0.7 (creative but consistent)
- Max tokens: 2048
- System prompt includes: user preferences, dietary restrictions

// Cost optimization:
- Cache system prompts
- Reuse conversation context when possible
- Implement request deduplication
```

#### Cooking Assistant Chat
```typescript
// Current implementation in /api/cooking-chat/route.ts
- Model: claude-3-5-sonnet
- Temperature: 0.8 (more conversational)
- Streaming: true (better UX)
- Context: Recipe being cooked + current step + previous messages

// Features to add:
- [ ] Include recipe context automatically
- [ ] Track conversation history in database
- [ ] Implement context pruning for long conversations
- [ ] Add cooking tips and technique explanations
```

#### Future AI Features (Phase 4+)
- Recipe recommendations based on user history
- Ingredient substitution suggestions
- Automatic recipe parsing from text/images
- Meal planning optimization
- Nutritional analysis and suggestions

---

## Monitoring & Analytics

### Current Setup
**Minimal logging** (Vercel logs)

### What to Monitor

#### Application Metrics
```
- API response times
- Error rates by endpoint
- Database query performance
- AI API usage and costs
```

#### User Metrics (when ready)
```
- Daily/weekly active users
- Recipe generation count
- Cooking sessions started/completed
- Most bookmarked recipes
- Search queries (for improving search)
```

### Future Enhancements
- Add Sentry for error tracking (when budget allows)
- Implement Vercel Analytics (free tier)
- Set up uptime monitoring
- Database query performance dashboard

---

## Deployment Strategy

### Current Setup
- **Platform**: Vercel ✅
- **Database**: PostgreSQL (Supabase/Neon/Vercel Postgres)
- **Domain**: TBD
- **Environment**: Production

### Deployment Workflow

```bash
# Automatic deployment on push to main
git push origin main

# Vercel automatically:
1. Runs build
2. Runs tests (if configured)
3. Deploys to production
4. Runs post-deploy hooks

# Preview deployments on PRs
```

### Environment Variables in Vercel
```
Set in Vercel Dashboard:
- DATABASE_URL (production database)
- ANTHROPIC_API_KEY
- BLOB_READ_WRITE_TOKEN
- OAuth credentials
- NEXT_PUBLIC_APP_URL (production URL)
```

### Database Migrations in Production
```bash
# Option 1: Run migrations via Vercel CLI
vercel env pull
npx drizzle-kit push

# Option 2: Automate in CI/CD
# Add to .github/workflows or Vercel build script
```

---

## Implementation Timeline

### Phase 1: Authentication & Foundation (2-3 weeks)
**Week 1-2**
- [ ] Set up Google & GitHub OAuth
- [ ] Implement user preferences schema
- [ ] Build onboarding flow UI
- [ ] Create user settings page

**Week 2-3**
- [ ] Test authentication flow
- [ ] Implement preference-aware recipe generation
- [ ] Add migration scripts

### Phase 2: Enhanced Bookmarks & Collections (2 weeks)
**Week 3-4**
- [ ] Create collection schema and migrations
- [ ] Implement collection CRUD operations
- [ ] Build collections UI (create, manage, view)

**Week 4-5**
- [ ] Add personal notes and ratings
- [ ] Implement "times cooked" tracking
- [ ] Build recipe detail enhancements

### Phase 3: Cooking Mode (2-3 weeks)
**Week 5-6**
- [ ] Create cooking session schema
- [ ] Implement session management logic
- [ ] Build step-by-step navigation UI

**Week 6-7**
- [ ] Enhance AI cooking chat with context
- [ ] Implement session persistence and resume
- [ ] Add mobile-optimized cooking interface

### Phase 4: Recipe Sharing (1 week)
**Week 7-8**
- [ ] Create share schema
- [ ] Implement share link generation
- [ ] Build share UI and public recipe view

### Phase 5: Polish & Testing (1-2 weeks)
**Week 8-9**
- [ ] Add missing tests
- [ ] Fix bugs and edge cases
- [ ] Performance optimization
- [ ] Mobile responsiveness review

### Phase 6: Image Upload & Search (1 week)
**Week 9-10**
- [ ] Set up Vercel Blob integration
- [ ] Implement image upload flows
- [ ] Enhance search functionality

**Total Estimated Time**: 10-12 weeks for full MVP

---

## Technical Debt & Future Enhancements

### Known Limitations (Accept for MVP)
1. **Search**: Basic LIKE queries, no ranking
   - Future: PostgreSQL full-text search or Algolia

2. **Real-time**: Polling instead of WebSocket
   - Future: Add WebSocket for cooking mode when scaling

3. **Caching**: No Redis, relying on database
   - Future: Add Redis for session caching, rate limiting

4. **Timers**: Not in MVP
   - Future: Add timer functionality to cooking mode

5. **Mobile App**: Responsive web only
   - Future: Consider PWA or React Native

6. **Analytics**: Minimal logging
   - Future: Add proper analytics and monitoring

### Scalability Considerations

#### Database Scaling
```
Current: Single Postgres instance
Next: Connection pooling (PgBouncer)
Future: Read replicas, database sharding
```

#### API Scaling
```
Current: Vercel serverless functions
Handles: ~1000 concurrent users easily
Bottleneck: Database connections, AI API rate limits
Future: Implement caching, optimize queries
```

#### Image Storage Scaling
```
Current: Vercel Blob (generous limits)
Future: CDN optimization, image resizing on-the-fly
```

---

## Open Questions & Decisions Needed

### Technical Questions
1. **Database hosting**: Which provider? (Supabase/Neon/Vercel Postgres)
   - Decision needed before production scaling

2. **Domain name**: What's the production domain?
   - Needed for OAuth redirect URLs

3. **AI model selection**: Stick with claude-3-5-sonnet or upgrade?
   - Monitor costs and performance

4. **Mobile strategy**: PWA features now or later?
   - Can add service workers incrementally

### Product Questions
1. **Recipe validation**: Should AI-generated recipes be reviewed?
   - For MVP: Trust Claude, add reporting later

2. **Content moderation**: When to add for user photos?
   - Add when enabling user-generated content

3. **Freemium model**: Recipe generation limits?
   - Decision for future monetization phase

---

## Success Metrics for MVP

### Technical Metrics
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms (p95)
- [ ] Zero critical security vulnerabilities
- [ ] 80%+ test coverage on core features
- [ ] 99% uptime (via Vercel)

### Feature Completeness
- [ ] User can sign up with Google/GitHub
- [ ] User can complete onboarding
- [ ] User can generate recipes based on preferences
- [ ] User can save recipes to collections
- [ ] User can start cooking mode and use AI assistant
- [ ] User can share recipes via link
- [ ] User can manage shopping lists

### User Experience
- [ ] Mobile-responsive across all features
- [ ] Intuitive navigation (user testing)
- [ ] Fast recipe generation (< 10 seconds)
- [ ] Smooth cooking mode experience
- [ ] Helpful AI assistant responses

---

## Resources & Documentation

### Key Files to Reference
```
Database:
- src/server/db/schema.ts (schema definitions)
- src/server/db/queries.ts (database operations)
- drizzle.config.ts (Drizzle configuration)
- auth-schema.ts (authentication schema)

API Routes:
- src/app/api/generate/route.ts (recipe generation)
- src/app/api/cooking-chat/route.ts (AI cooking assistant)

Tests:
- src/__tests__/queries.test.tsx (query tests)

Configuration:
- package.json (dependencies)
- tsconfig.json (TypeScript config)
- next.config.js (Next.js config)
```

### External Documentation
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Claude API: https://docs.anthropic.com/
- PostgreSQL: https://www.postgresql.org/docs/

### Team Communication
- Technical discussions: [Your preferred channel]
- Bug reports: GitHub Issues
- Feature requests: GitHub Discussions
- Documentation: This file + code comments

---

## Appendix: Database ERD

```
┌─────────────────┐
│      USER       │
│─────────────────│
│ id (PK)         │
│ name            │
│ email (unique)  │
│ image           │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         ├──────────────────────┐
         │                      │
┌────────▼────────┐    ┌────────▼─────────────┐
│ USER_PREFERENCES│    │    COLLECTION        │
│─────────────────│    │──────────────────────│
│ id (PK)         │    │ id (PK)              │
│ userId (FK)     │    │ userId (FK)          │
│ dietary...      │    │ name                 │
│ skillLevel      │    │ description          │
│ spiceTolerance  │    │ coverImageUrl        │
│ onboardingDone  │    │ isDefault            │
└─────────────────┘    └──────────┬───────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   RECIPE_COLLECTIONS       │
                    │────────────────────────────│
                    │ userId (FK)                │
┌─────────────────┐ │ recipeId (FK)              │
│     RECIPE      │◄┤ collectionId (FK)          │
│─────────────────│ │ personalNotes              │
│ id (PK)         │ │ rating                     │
│ name            │ │ timesCookedCount           │
│ description     │ │ lastCookedAt               │
│ ingredients[]   │ └────────────────────────────┘
│ instructions[]  │
│ nutrition[]     │ ┌────────────────────────────┐
│ imageUrl        │◄│    RECIPE_SHARE            │
│ createdAt       │ │────────────────────────────│
└────────┬────────┘ │ id (PK)                    │
         │          │ recipeId (FK)              │
         │          │ userId (FK)                │
         │          │ shareToken (unique)        │
         │          │ isPublic                   │
         │          │ expiresAt                  │
         │          └────────────────────────────┘
         │
┌────────▼────────────┐
│ COOKING_SESSION     │
│─────────────────────│
│ id (PK)             │
│ userId (FK)         │
│ recipeId (FK)       │
│ currentStep         │
│ isCompleted         │
│ startedAt           │
└──────────┬──────────┘
           │
  ┌────────▼──────────────────┐
  │ COOKING_CHAT_MESSAGES     │
  │───────────────────────────│
  │ id (PK)                   │
  │ sessionId (FK)            │
  │ role                      │
  │ content                   │
  │ stepNumber                │
  │ createdAt                 │
  └───────────────────────────┘

┌─────────────────┐
│ SHOPPING_LIST   │
│─────────────────│
│ id (PK)         │
│ userId (FK)     │
│ name            │
│ createdAt       │
└────────┬────────┘
         │
┌────────▼───────────────┐
│ SHOPPING_LIST_ITEM     │
│────────────────────────│
│ id (PK)                │
│ listId (FK)            │
│ name                   │
│ quantity               │
│ unit                   │
│ category               │
│ isCompleted            │
└────────────────────────┘

[Additional auth tables: session, account, verification - already implemented]
```

---

**Document Status**: Living Document
**Last Updated**: February 5, 2026
**Next Review**: After Phase 1 completion

**Maintained By**: Development Team
**Contact**: [Your contact method]

