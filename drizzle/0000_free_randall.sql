CREATE TABLE "Recipe" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"total_time" varchar NOT NULL,
	"servings" integer NOT NULL,
	"nutrition" varchar[] NOT NULL,
	"storage" varchar NOT NULL,
	"createdAt" timestamp NOT NULL
);
