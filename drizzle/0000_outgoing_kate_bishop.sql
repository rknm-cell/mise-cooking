CREATE TABLE "Recipe" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"total_time" varchar NOT NULL,
	"servings" integer NOT NULL,
	"ingredients" jsonb NOT NULL,
	"instructions" jsonb NOT NULL,
	"storage" varchar NOT NULL,
	"nutrition" varchar NOT NULL,
	"createdAt" timestamp NOT NULL
);
