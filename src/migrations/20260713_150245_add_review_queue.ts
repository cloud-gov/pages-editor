import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "review_queue" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content_type" varchar NOT NULL,
  	"source_collection" varchar NOT NULL,
  	"source_id" varchar NOT NULL,
  	"edit_url" varchar NOT NULL,
  	"last_modified" timestamp(3) with time zone NOT NULL,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "review_queue_id" integer;
  ALTER TABLE "review_queue" ADD CONSTRAINT "review_queue_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "review_queue_source_collection_idx" ON "review_queue" USING btree ("source_collection");
  CREATE INDEX "review_queue_source_id_idx" ON "review_queue" USING btree ("source_id");
  CREATE INDEX "review_queue_site_idx" ON "review_queue" USING btree ("site_id");
  CREATE INDEX "review_queue_updated_at_idx" ON "review_queue" USING btree ("updated_at");
  CREATE INDEX "review_queue_created_at_idx" ON "review_queue" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_review_queue_fk" FOREIGN KEY ("review_queue_id") REFERENCES "public"."review_queue"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_review_queue_id_idx" ON "payload_locked_documents_rels" USING btree ("review_queue_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "review_queue" DISABLE ROW LEVEL SECURITY;

   ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_review_queue_fk";
   DROP TABLE IF EXISTS "review_queue" CASCADE;

   DROP INDEX IF EXISTS "payload_locked_documents_rels_review_queue_id_idx";
   ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP COLUMN IF EXISTS "review_queue_id";`)
}
