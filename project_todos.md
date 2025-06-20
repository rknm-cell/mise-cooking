I'll help you create a structured project_todos.md file that can be used to track progress. Here's how we can format it:

```markdown
# Project Todos

## Status Legend
- [ ] Not Started
- [~] In Progress
- [x] Completed
- [!] Blocked

## 1. Project Setup & Infrastructure
- [x] Initialize Next.js project with TypeScript
  - [x] Configure tsconfig
  - [x] Set up ESLint and Prettier
  - [x] Add necessary dependencies
- [x] Set up PostgreSQL database
  - [x] Create database
  - [x] Configure connection
  - [x] Set up backup strategy
- [x] Configure Drizzle ORM
  - [x] Install dependencies
  - [x] Set up schema
  - [x] Configure migrations
- [x] Set up tRPC
  - [x] Install dependencies
  - [x] Configure router
  - [x] Set up client
- [x] Configure Vercel AI SDK
  - [x] Install SDK
  - [x] Set up OpenAI integration
  - [x] Configure API routes
- [x] Set up environment variables
  - [x] Create .env.example
  - [x] Document all variables
  - [x] Set up production variables
- [x] Initialize Git repository
  - [x] Set up .gitignore
  - [x] Create initial commit
  - [x] Set up remote

## 2. Authentication & Authorization
- [x] Implement BetterAuth.js setup
  - [x] Install dependencies
  - [x] Configure providers
  - [ ] Set up session handling
- [x] Create user model in database
  - [x] Define schema
  - [x] Set up migrations
  - [ ] Add indexes
- [x] Set up authentication providers
  - [x] Email/Password
  - [x] Google OAuth
  - [~] GitHub OAuth
- [ ] Implement protected routes
  - [ ] Create middleware
  - [ ] Add route protection
  - [ ] Handle redirects
- [ ] Create user session management
  - [ ] Implement session storage
  - [ ] Add session validation
  - [ ] Handle session expiry
- [ ] Add role-based access control
  - [ ] Define roles
  - [ ] Implement permissions
  - [ ] Add role checks
- [ ] Implement password reset flow
  - [ ] Create reset token system
  - [ ] Add email templates
  - [ ] Implement reset logic
- [ ] Add email verification
  - [ ] Create verification tokens
  - [ ] Add email templates
  - [ ] Implement verification logic

## 3. AI Integration
- [x] Set up OpenAI API integration
  - [x] Configure API keys
  - [ ] Set up rate limiting
  - [ ] Implement error handling
- [x] Implement recipe generation using AI
  - [x] Create prompt templates
  - [x] Implement generation logic
  - [x] Add response parsing
- [ ] Create prompt engineering system
  - [ ] Design prompt structure
  - [ ] Implement prompt validation
  - [ ] Add prompt versioning
- [x] Add nutritional analysis AI features
  - [x] Create analysis prompts
  - [x] Implement parsing logic
  - [x] Add validation
- [ ] Implement ingredient substitution AI
  - [ ] Create substitution logic
  - [ ] Add validation
  - [ ] Implement fallbacks
- [ ] Add meal planning AI capabilities
  - [ ] Create planning prompts
  - [ ] Implement planning logic
  - [ ] Add constraints handling


## 4. Database & API
- [x] Design database schema
  - [x] User table
  - [x] Recipes table
  - [x] Ingredients table
  - [x] Nutritional info table
  - [ ] Meal plans table
- [x] Create tRPC routers
  - [ ] User router
  - [x] Recipe router
  - [ ] Meal plan router
  - [ ] Nutrition router
- [x] Implement database migrations
  - [ ] Create migration system
  - [ ] Add rollback capability
  - [ ] Document migrations
- [ ] Set up database indexing
  - [ ] Add performance indexes
  - [ ] Optimize queries
  - [ ] Monitor performance
- [x] Create API endpoints
  - [x] Recipe generation
  - [ ] User preferences
  - [ ] Meal planning
  - [ ] Shopping lists

## 5. Frontend Development
- [x] Set up UI component library
  - [x] Install dependencies
  - [~] Configure theme
  - [ ] Create base components
- [~] Create responsive layout
  - [ ] Design system
  - [ ] Implement breakpoints
  - [ ] Add responsive components
- [ ] Implement key pages
  - [ ] Home/Dashboard
  - [x] Recipe generation
  - [x] Recipe details
  - [ ] Meal planning
  - [ ] User profile
  - [ ] Settings
- [ ] Add form validation
  - [ ] Implement validation logic
  - [ ] Add error messages
  - [ ] Create custom validators
- [ ] Implement error boundaries
  - [ ] Create error components
  - [ ] Add fallback UI
  - [ ] Implement logging
- [ ] Create loading states
  - [ ] Add loading components
  - [ ] Implement skeletons
  - [ ] Add transitions
- [ ] Add toast notifications
  - [ ] Set up notification system
  - [ ] Create notification components
  - [ ] Add animations

## 6. Testing
- [ ] Set up testing framework
  - [ ] Install Vitest
  - [ ] Configure testing environment
  - [ ] Set up test utilities
- [ ] Write unit tests
  - [ ] API routes
  - [ ] Database operations
  - [ ] AI integration
  - [ ] Utility functions
- [ ] Create integration tests
  - [ ] API integration
  - [ ] Database integration
  - [ ] AI integration
- [ ] Implement E2E tests
  - [ ] Set up Cypress
  - [ ] Create test scenarios
  - [ ] Add CI integration
- [ ] Set up test coverage reporting
  - [ ] Configure coverage
  - [ ] Set up reporting
  - [ ] Add CI integration
- [ ] Add performance testing
  - [ ] Set up benchmarks
  - [ ] Create performance tests
  - [ ] Add monitoring

## 7. Error Handling & Monitoring
- [ ] Implement global error handling
  - [ ] Create error middleware
  - [ ] Add error logging
  - [ ] Implement recovery
- [ ] Set up error logging
  - [ ] Configure logging system
  - [ ] Add log levels
  - [ ] Set up log rotation
- [ ] Create error tracking
  - [ ] Set up Sentry
  - [ ] Configure alerts
  - [ ] Add context
- [ ] Add performance monitoring
  - [ ] Set up metrics
  - [ ] Add dashboards
  - [ ] Configure alerts
- [ ] Implement rate limiting
  - [ ] Add rate limiters
  - [ ] Configure limits
  - [ ] Add monitoring
- [ ] Set up alerting system
  - [ ] Configure alerts
  - [ ] Add notification channels
  - [ ] Set up escalation
- [ ] Create error recovery mechanisms
  - [ ] Implement retry logic
  - [ ] Add fallbacks
  - [ ] Create recovery procedures

## 8. Documentation
- [ ] Create technical documentation
  - [ ] Architecture decisions
  - [ ] API documentation
  - [ ] Database schema
  - [ ] AI integration details
- [ ] Write user documentation
  - [ ] Installation guide
  - [ ] User manual
  - [ ] API usage guide
- [ ] Add code documentation
  - [ ] JSDoc comments
  - [ ] README updates
  - [ ] Component documentation


## Recipe types:
Pasta Dishes: Spaghetti Bolognese, Mac and Cheese, Lasagna, Carbonara.
Stir-fries: Chicken and Broccoli Stir-fry, Vegetable Stir-fry.
Soups: Chicken Noodle Soup, Tomato Soup, Lentil Soup, Minestrone.
Salads: Caesar Salad, Garden Salad, Cobb Salad, Caprese Salad.
Curries: Chicken Curry, Vegetable Curry, Lentil Dahl.
Roasts: Roast Chicken, Roast Beef, Roast Potatoes.
Casseroles/Bakes: Tuna Casserole, Chicken and Rice Bake, Shepherd's Pie.
Pizzas: Pepperoni Pizza, Margherita Pizza, Veggie Pizza.
Burgers/Sandwiches: Classic Beef Burger, Grilled Cheese, BLT.
Tacos/Burritos: Beef Tacos, Chicken Burritos, Fish Tacos.
Stews: Beef Stew, Irish Stew, Goulash.
Grill/BBQ: Grilled Chicken, Grilled Steaks, BBQ Ribs.
Seafood Dishes: Baked Salmon, Shrimp Scampi, Fish and Chips.
Rice Dishes: Fried Rice, Risotto, Pilaf.
Egg Dishes: Scrambled Eggs, Omelette, Frittata, Quiche.
Breakfast Foods: Pancakes, Waffles, French Toast, Oatmeal.
Side Dishes: Mashed Potatoes, Roasted Vegetables, Coleslaw.
Dips/Spreads: Hummus, Guacamole, Salsa, Tzatziki.
Desserts (Cakes/Pies): Chocolate Cake, Apple Pie, Cheesecake.
Desserts (Cookies/Brownies): Chocolate Chip Cookies, Fudgy Brownies.
Breads/Pastries: Homemade Bread, Muffins, Croissants.
Smoothies/Drinks: Fruit Smoothie, Green Smoothie.
Dressings/Sauces: Vinaigrette, Marinara Sauce, Pesto.
Slow Cooker Meals: Pulled Pork, Pot Roast.
Sheet Pan Meals: Sheet Pan Chicken and Veggies, Sheet Pan Sausage and Peppers.