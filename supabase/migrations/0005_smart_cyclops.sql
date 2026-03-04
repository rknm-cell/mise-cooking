DROP TABLE "cooking_sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "chefs_tip" varchar;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "revoked";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "revoked_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "revoked_reason";