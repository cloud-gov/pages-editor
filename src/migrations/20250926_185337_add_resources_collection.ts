import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_menu_site_collection_blocks_collection_link_page" ADD VALUE 'resources';
  ALTER TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page" ADD VALUE 'resources';
  ALTER TYPE "public"."enum_menu_blocks_collection_link_page" ADD VALUE 'resources';
  ALTER TYPE "public"."enum__menu_v_blocks_collection_link_page" ADD VALUE 'resources';
  CREATE TABLE "resources_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"image_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"resource_date" timestamp(3) with time zone,
  	"site_id" integer,
  	"content" jsonb,
  	"review_ready" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_resources_v_version_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_resource_date" timestamp(3) with time zone,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_review_ready" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_resources_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "resources_report_files" ADD CONSTRAINT "resources_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_report_files" ADD CONSTRAINT "resources_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_version_report_files" ADD CONSTRAINT "_resources_v_version_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_version_report_files" ADD CONSTRAINT "_resources_v_version_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "resources_report_files_order_idx" ON "resources_report_files" USING btree ("_order");
  CREATE INDEX "resources_report_files_parent_id_idx" ON "resources_report_files" USING btree ("_parent_id");
  CREATE INDEX "resources_report_files_file_idx" ON "resources_report_files" USING btree ("file_id");
  CREATE INDEX "resources_image_idx" ON "resources" USING btree ("image_id");
  CREATE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_site_idx" ON "resources" USING btree ("site_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "resources" USING btree ("_status");
  CREATE INDEX "resources_rels_order_idx" ON "resources_rels" USING btree ("order");
  CREATE INDEX "resources_rels_parent_idx" ON "resources_rels" USING btree ("parent_id");
  CREATE INDEX "resources_rels_path_idx" ON "resources_rels" USING btree ("path");
  CREATE INDEX "resources_rels_categories_id_idx" ON "resources_rels" USING btree ("categories_id");
  CREATE INDEX "_resources_v_version_report_files_order_idx" ON "_resources_v_version_report_files" USING btree ("_order");
  CREATE INDEX "_resources_v_version_report_files_parent_id_idx" ON "_resources_v_version_report_files" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_version_report_files_file_idx" ON "_resources_v_version_report_files" USING btree ("file_id");
  CREATE INDEX "_resources_v_parent_idx" ON "_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_image_idx" ON "_resources_v" USING btree ("version_image_id");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_site_idx" ON "_resources_v" USING btree ("version_site_id");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_latest_idx" ON "_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_autosave_idx" ON "_resources_v" USING btree ("autosave");
  CREATE INDEX "_resources_v_rels_order_idx" ON "_resources_v_rels" USING btree ("order");
  CREATE INDEX "_resources_v_rels_parent_idx" ON "_resources_v_rels" USING btree ("parent_id");
  CREATE INDEX "_resources_v_rels_path_idx" ON "_resources_v_rels" USING btree ("path");
  CREATE INDEX "_resources_v_rels_categories_id_idx" ON "_resources_v_rels" USING btree ("categories_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // First, try to drop the constraint if it exists
  try {
    await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_resources_fk";`)
  } catch (error) {
    // Ignore if constraint doesn't exist
    console.log('Constraint payload_locked_documents_rels_resources_fk does not exist, skipping...')
  }

  await db.execute(sql`
   ALTER TABLE "resources_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_version_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resources_report_files" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_rels" CASCADE;
  DROP TABLE "_resources_v_version_report_files" CASCADE;
  DROP TABLE "_resources_v" CASCADE;
  DROP TABLE "_resources_v_rels" CASCADE;
  
  ALTER TABLE "menu_site_collection_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum_menu_site_collection_blocks_collection_link_page";
  CREATE TYPE "public"."enum_menu_site_collection_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  ALTER TABLE "menu_site_collection_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."enum_menu_site_collection_blocks_collection_link_page" USING "page"::"public"."enum_menu_site_collection_blocks_collection_link_page";
  ALTER TABLE "_menu_site_collection_v_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page";
  CREATE TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  ALTER TABLE "_menu_site_collection_v_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page" USING "page"::"public"."enum__menu_site_collection_v_blocks_collection_link_page";
  ALTER TABLE "menu_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum_menu_blocks_collection_link_page";
  CREATE TYPE "public"."enum_menu_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  ALTER TABLE "menu_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."enum_menu_blocks_collection_link_page" USING "page"::"public"."enum_menu_blocks_collection_link_page";
  ALTER TABLE "_menu_v_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum__menu_v_blocks_collection_link_page";
  CREATE TYPE "public"."enum__menu_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  ALTER TABLE "_menu_v_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."enum__menu_v_blocks_collection_link_page" USING "page"::"public"."enum__menu_v_blocks_collection_link_page";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_resources_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "resources_id";
  DROP TYPE "public"."enum_resources_status";
  DROP TYPE "public"."enum__resources_v_version_status";`)
}
