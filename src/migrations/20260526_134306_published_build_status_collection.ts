import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "published_build_status" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pages_build_id" numeric,
  	"completed_at" timestamp(3) with time zone,
  	"state" varchar,
  	"started_at" timestamp(3) with time zone,
  	"error" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "published_build_status_id" integer;
  ALTER TABLE "published_build_status" ADD CONSTRAINT "published_build_status_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "published_build_status_site_idx" ON "published_build_status" USING btree ("site_id");
  CREATE INDEX "published_build_status_updated_at_idx" ON "published_build_status" USING btree ("updated_at");
  CREATE INDEX "published_build_status_created_at_idx" ON "published_build_status" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_published_build_status_fk" FOREIGN KEY ("published_build_status_id") REFERENCES "public"."published_build_status"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_published_build_status_id_idx" ON "payload_locked_documents_rels" USING btree ("published_build_status_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "published_build_status" DISABLE ROW LEVEL SECURITY;
  
   ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_published_build_status_fk";
   DROP TABLE IF EXISTS "published_build_status" CASCADE;

   DROP INDEX IF EXISTS "payload_locked_documents_rels_published_build_status_id_idx";
   ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP COLUMN IF EXISTS "published_build_status_id";`)
}
