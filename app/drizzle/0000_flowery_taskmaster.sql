CREATE TABLE "entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(100) NOT NULL,
	"properties" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"trust_score" integer
);
--> statement-breakpoint
CREATE TABLE "proofs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relation_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"url" text,
	"hash" varchar(255),
	"timestamp" timestamp,
	"verified_by" varchar(255),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(100) NOT NULL,
	"agent_id" uuid NOT NULL,
	"object_id" uuid NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"location_id" uuid,
	"context" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"trust_score" integer
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"method" varchar(100) NOT NULL,
	"verified_by" varchar(255) NOT NULL,
	"timestamp" timestamp NOT NULL,
	"expires_at" timestamp,
	"proof" jsonb
);
--> statement-breakpoint
CREATE TABLE "witnesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relation_id" uuid NOT NULL,
	"entity_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proofs" ADD CONSTRAINT "proofs_relation_id_relations_id_fk" FOREIGN KEY ("relation_id") REFERENCES "public"."relations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relations" ADD CONSTRAINT "relations_agent_id_entities_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relations" ADD CONSTRAINT "relations_object_id_entities_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relations" ADD CONSTRAINT "relations_location_id_entities_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "witnesses" ADD CONSTRAINT "witnesses_relation_id_relations_id_fk" FOREIGN KEY ("relation_id") REFERENCES "public"."relations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "witnesses" ADD CONSTRAINT "witnesses_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_entities_type" ON "entities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_entities_created_at" ON "entities" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_proofs_relation" ON "proofs" USING btree ("relation_id");--> statement-breakpoint
CREATE INDEX "idx_proofs_type" ON "proofs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_relations_agent" ON "relations" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_relations_object" ON "relations" USING btree ("object_id");--> statement-breakpoint
CREATE INDEX "idx_relations_type" ON "relations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_relations_start_time" ON "relations" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "idx_verifications_entity" ON "verifications" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "idx_verifications_method" ON "verifications" USING btree ("method");--> statement-breakpoint
CREATE INDEX "idx_witnesses_relation" ON "witnesses" USING btree ("relation_id");--> statement-breakpoint
CREATE INDEX "idx_witnesses_entity" ON "witnesses" USING btree ("entity_id");