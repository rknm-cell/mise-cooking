CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"dietary_restrictions" text[] DEFAULT ARRAY[]::text[],
	"allergies" text[] DEFAULT ARRAY[]::text[],
	"favorite_cuisines" text[] DEFAULT ARRAY[]::text[],
	"skill_level" text DEFAULT 'beginner',
	"spice_tolerance" text DEFAULT 'medium',
	"max_cooking_time" integer,
	"preferred_serving_size" integer DEFAULT 2,
	"available_equipment" text[] DEFAULT ARRAY[]::text[],
	"meal_prep_friendly" boolean DEFAULT false,
	"quick_meals_only" boolean DEFAULT false,
	"onboarding_completed" boolean DEFAULT false,
	"onboarding_completed_at" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;