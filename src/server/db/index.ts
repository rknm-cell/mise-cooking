import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema"

config({ path: '.env' }); // or .env.local

// Configure postgres client for Supabase connection pooler
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // REQUIRED for Supabase pooler and serverless
  max: 1, // Limit connections for serverless/dev environment
  idle_timeout: 20, // Close idle connections after 20 seconds
  max_lifetime: 60 * 30, // Close connections after 30 minutes
  connect_timeout: 10, // Timeout connection attempts after 10 seconds
});

// Test database connection on initialization
console.log('🔌 Testing database connection...');
try {
  await client`SELECT 1 as test`;
  console.log('✅ Database connected successfully!');
} catch (error) {
  console.error('❌ Database connection failed:', error);
}

export const db = drizzle(client, { schema } );
