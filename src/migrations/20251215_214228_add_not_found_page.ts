import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_not_found_page_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__not_found_page_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_not_found_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__not_found_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "not_found_page_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Page Not Found',
  	"heading" varchar DEFAULT '404 - Page Not Found',
  	"content" jsonb,
  	"show_search" boolean DEFAULT true,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_not_found_page_site_collection_status" DEFAULT 'draft'
  );

  CREATE TABLE "_not_found_page_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar DEFAULT 'Page Not Found',
  	"version_heading" varchar DEFAULT '404 - Page Not Found',
  	"version_content" jsonb,
  	"version_show_search" boolean DEFAULT true,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__not_found_page_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE "not_found_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Page Not Found',
  	"heading" varchar DEFAULT '404 - Page Not Found',
  	"content" jsonb,
  	"show_search" boolean DEFAULT true,
  	"_status" "enum_not_found_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_not_found_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar DEFAULT 'Page Not Found',
  	"version_heading" varchar DEFAULT '404 - Page Not Found',
  	"version_content" jsonb,
  	"version_show_search" boolean DEFAULT true,
  	"version__status" "enum__not_found_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "not_found_page_site_collection_id" integer;
  ALTER TABLE "not_found_page_site_collection" ADD CONSTRAINT "not_found_page_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_not_found_page_site_collection_v" ADD CONSTRAINT "_not_found_page_site_collection_v_parent_id_not_found_page_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."not_found_page_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_not_found_page_site_collection_v" ADD CONSTRAINT "_not_found_page_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "not_found_page_site_collection_site_idx" ON "not_found_page_site_collection" USING btree ("site_id");
  CREATE INDEX "not_found_page_site_collection_updated_at_idx" ON "not_found_page_site_collection" USING btree ("updated_at");
  CREATE INDEX "not_found_page_site_collection_created_at_idx" ON "not_found_page_site_collection" USING btree ("created_at");
  CREATE INDEX "not_found_page_site_collection__status_idx" ON "not_found_page_site_collection" USING btree ("_status");
  CREATE INDEX "_not_found_page_site_collection_v_parent_idx" ON "_not_found_page_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_not_found_page_site_collection_v_version_version_site_idx" ON "_not_found_page_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_not_found_page_site_collection_v_version_version_update_idx" ON "_not_found_page_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_not_found_page_site_collection_v_version_version_create_idx" ON "_not_found_page_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_not_found_page_site_collection_v_version_version__statu_idx" ON "_not_found_page_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_not_found_page_site_collection_v_created_at_idx" ON "_not_found_page_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_not_found_page_site_collection_v_updated_at_idx" ON "_not_found_page_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_not_found_page_site_collection_v_latest_idx" ON "_not_found_page_site_collection_v" USING btree ("latest");
  CREATE INDEX "_not_found_page_site_collection_v_autosave_idx" ON "_not_found_page_site_collection_v" USING btree ("autosave");
  CREATE INDEX "not_found_page__status_idx" ON "not_found_page" USING btree ("_status");
  CREATE INDEX "_not_found_page_v_version_version__status_idx" ON "_not_found_page_v" USING btree ("version__status");
  CREATE INDEX "_not_found_page_v_created_at_idx" ON "_not_found_page_v" USING btree ("created_at");
  CREATE INDEX "_not_found_page_v_updated_at_idx" ON "_not_found_page_v" USING btree ("updated_at");
  CREATE INDEX "_not_found_page_v_latest_idx" ON "_not_found_page_v" USING btree ("latest");
  CREATE INDEX "_not_found_page_v_autosave_idx" ON "_not_found_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_not_found_page_site_collect_fk" FOREIGN KEY ("not_found_page_site_collection_id") REFERENCES "public"."not_found_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_not_found_page_site_collec_idx" ON "payload_locked_documents_rels" USING btree ("not_found_page_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "not_found_page_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_not_found_page_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "not_found_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_not_found_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "not_found_page_site_collection" CASCADE;
  DROP TABLE "_not_found_page_site_collection_v" CASCADE;
  DROP TABLE "not_found_page" CASCADE;
  DROP TABLE "_not_found_page_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_not_found_page_site_collect_fk";

  DROP INDEX "payload_locked_documents_rels_not_found_page_site_collec_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "not_found_page_site_collection_id";
  DROP TYPE "public"."enum_not_found_page_site_collection_status";
  DROP TYPE "public"."enum__not_found_page_site_collection_v_version_status";
  DROP TYPE "public"."enum_not_found_page_status";
  DROP TYPE "public"."enum__not_found_page_v_version_status";`)
}
