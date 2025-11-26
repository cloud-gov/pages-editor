import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_custom_collections_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__custom_collections_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_custom_collection_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__custom_collection_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "custom_collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"description" varchar,
  	"updated_by_id" integer,
  	"site_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_custom_collections_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_custom_collections_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_description" varchar,
  	"version_updated_by_id" integer,
  	"version_site_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__custom_collections_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "custom_collection_pages_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "custom_collection_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_config_id" integer,
  	"title" varchar,
  	"excerpt" varchar,
  	"image_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"content_date" timestamp(3) with time zone,
  	"site_id" integer,
  	"content" jsonb,
  	"updated_by_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"show_in_page_nav" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_custom_collection_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "custom_collection_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_custom_collection_pages_v_version_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_custom_collection_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_collection_config_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_content_date" timestamp(3) with time zone,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_updated_by_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_show_in_page_nav" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__custom_collection_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_custom_collection_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "custom_col_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_custom_col_link_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "custom_col_link_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "_custom_col_link_v_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "custom_collections_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "custom_collection_pages_id" integer;
  ALTER TABLE "custom_collections" ADD CONSTRAINT "custom_collections_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collections" ADD CONSTRAINT "custom_collections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collections_v" ADD CONSTRAINT "_custom_collections_v_parent_id_custom_collections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collections_v" ADD CONSTRAINT "_custom_collections_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collections_v" ADD CONSTRAINT "_custom_collections_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_files" ADD CONSTRAINT "custom_collection_pages_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_files" ADD CONSTRAINT "custom_collection_pages_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_collection_config_id_custom_collections_id_fk" FOREIGN KEY ("collection_config_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_rels" ADD CONSTRAINT "custom_collection_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_rels" ADD CONSTRAINT "custom_collection_pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_version_files" ADD CONSTRAINT "_custom_collection_pages_v_version_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_version_files" ADD CONSTRAINT "_custom_collection_pages_v_version_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_parent_id_custom_collection_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_collection_config_id_custom_collections_id_fk" FOREIGN KEY ("version_collection_config_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_rels" ADD CONSTRAINT "_custom_collection_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_rels" ADD CONSTRAINT "_custom_collection_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_col_link" ADD CONSTRAINT "custom_col_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_col_link" ADD CONSTRAINT "custom_col_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v" ADD CONSTRAINT "_custom_col_link_v_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v" ADD CONSTRAINT "_custom_col_link_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_col_link_2" ADD CONSTRAINT "custom_col_link_2_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_col_link_2" ADD CONSTRAINT "custom_col_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v_2" ADD CONSTRAINT "_custom_col_link_v_2_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v_2" ADD CONSTRAINT "_custom_col_link_v_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "custom_collections_slug_idx" ON "custom_collections" USING btree ("slug");
  CREATE INDEX "custom_collections_updated_by_idx" ON "custom_collections" USING btree ("updated_by_id");
  CREATE INDEX "custom_collections_site_idx" ON "custom_collections" USING btree ("site_id");
  CREATE INDEX "custom_collections_updated_at_idx" ON "custom_collections" USING btree ("updated_at");
  CREATE INDEX "custom_collections_created_at_idx" ON "custom_collections" USING btree ("created_at");
  CREATE INDEX "custom_collections__status_idx" ON "custom_collections" USING btree ("_status");
  CREATE INDEX "_custom_collections_v_parent_idx" ON "_custom_collections_v" USING btree ("parent_id");
  CREATE INDEX "_custom_collections_v_version_version_slug_idx" ON "_custom_collections_v" USING btree ("version_slug");
  CREATE INDEX "_custom_collections_v_version_version_updated_by_idx" ON "_custom_collections_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_custom_collections_v_version_version_site_idx" ON "_custom_collections_v" USING btree ("version_site_id");
  CREATE INDEX "_custom_collections_v_version_version_updated_at_idx" ON "_custom_collections_v" USING btree ("version_updated_at");
  CREATE INDEX "_custom_collections_v_version_version_created_at_idx" ON "_custom_collections_v" USING btree ("version_created_at");
  CREATE INDEX "_custom_collections_v_version_version__status_idx" ON "_custom_collections_v" USING btree ("version__status");
  CREATE INDEX "_custom_collections_v_created_at_idx" ON "_custom_collections_v" USING btree ("created_at");
  CREATE INDEX "_custom_collections_v_updated_at_idx" ON "_custom_collections_v" USING btree ("updated_at");
  CREATE INDEX "_custom_collections_v_latest_idx" ON "_custom_collections_v" USING btree ("latest");
  CREATE INDEX "_custom_collections_v_autosave_idx" ON "_custom_collections_v" USING btree ("autosave");
  CREATE INDEX "custom_collection_pages_files_order_idx" ON "custom_collection_pages_files" USING btree ("_order");
  CREATE INDEX "custom_collection_pages_files_parent_id_idx" ON "custom_collection_pages_files" USING btree ("_parent_id");
  CREATE INDEX "custom_collection_pages_files_file_idx" ON "custom_collection_pages_files" USING btree ("file_id");
  CREATE INDEX "custom_collection_pages_collection_config_idx" ON "custom_collection_pages" USING btree ("collection_config_id");
  CREATE INDEX "custom_collection_pages_image_idx" ON "custom_collection_pages" USING btree ("image_id");
  CREATE INDEX "custom_collection_pages_slug_idx" ON "custom_collection_pages" USING btree ("slug");
  CREATE INDEX "custom_collection_pages_site_idx" ON "custom_collection_pages" USING btree ("site_id");
  CREATE INDEX "custom_collection_pages_updated_by_idx" ON "custom_collection_pages" USING btree ("updated_by_id");
  CREATE INDEX "custom_collection_pages_updated_at_idx" ON "custom_collection_pages" USING btree ("updated_at");
  CREATE INDEX "custom_collection_pages_created_at_idx" ON "custom_collection_pages" USING btree ("created_at");
  CREATE INDEX "custom_collection_pages__status_idx" ON "custom_collection_pages" USING btree ("_status");
  CREATE INDEX "custom_collection_pages_rels_order_idx" ON "custom_collection_pages_rels" USING btree ("order");
  CREATE INDEX "custom_collection_pages_rels_parent_idx" ON "custom_collection_pages_rels" USING btree ("parent_id");
  CREATE INDEX "custom_collection_pages_rels_path_idx" ON "custom_collection_pages_rels" USING btree ("path");
  CREATE INDEX "custom_collection_pages_rels_categories_id_idx" ON "custom_collection_pages_rels" USING btree ("categories_id");
  CREATE INDEX "_custom_collection_pages_v_version_files_order_idx" ON "_custom_collection_pages_v_version_files" USING btree ("_order");
  CREATE INDEX "_custom_collection_pages_v_version_files_parent_id_idx" ON "_custom_collection_pages_v_version_files" USING btree ("_parent_id");
  CREATE INDEX "_custom_collection_pages_v_version_files_file_idx" ON "_custom_collection_pages_v_version_files" USING btree ("file_id");
  CREATE INDEX "_custom_collection_pages_v_parent_idx" ON "_custom_collection_pages_v" USING btree ("parent_id");
  CREATE INDEX "_custom_collection_pages_v_version_version_collection_config_idx" ON "_custom_collection_pages_v" USING btree ("version_collection_config_id");
  CREATE INDEX "_custom_collection_pages_v_version_version_image_idx" ON "_custom_collection_pages_v" USING btree ("version_image_id");
  CREATE INDEX "_custom_collection_pages_v_version_version_slug_idx" ON "_custom_collection_pages_v" USING btree ("version_slug");
  CREATE INDEX "_custom_collection_pages_v_version_version_site_idx" ON "_custom_collection_pages_v" USING btree ("version_site_id");
  CREATE INDEX "_custom_collection_pages_v_version_version_updated_by_idx" ON "_custom_collection_pages_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_custom_collection_pages_v_version_version_updated_at_idx" ON "_custom_collection_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_custom_collection_pages_v_version_version_created_at_idx" ON "_custom_collection_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_custom_collection_pages_v_version_version__status_idx" ON "_custom_collection_pages_v" USING btree ("version__status");
  CREATE INDEX "_custom_collection_pages_v_created_at_idx" ON "_custom_collection_pages_v" USING btree ("created_at");
  CREATE INDEX "_custom_collection_pages_v_updated_at_idx" ON "_custom_collection_pages_v" USING btree ("updated_at");
  CREATE INDEX "_custom_collection_pages_v_latest_idx" ON "_custom_collection_pages_v" USING btree ("latest");
  CREATE INDEX "_custom_collection_pages_v_autosave_idx" ON "_custom_collection_pages_v" USING btree ("autosave");
  CREATE INDEX "_custom_collection_pages_v_rels_order_idx" ON "_custom_collection_pages_v_rels" USING btree ("order");
  CREATE INDEX "_custom_collection_pages_v_rels_parent_idx" ON "_custom_collection_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_custom_collection_pages_v_rels_path_idx" ON "_custom_collection_pages_v_rels" USING btree ("path");
  CREATE INDEX "_custom_collection_pages_v_rels_categories_id_idx" ON "_custom_collection_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "custom_col_link_order_idx" ON "custom_col_link" USING btree ("_order");
  CREATE INDEX "custom_col_link_parent_id_idx" ON "custom_col_link" USING btree ("_parent_id");
  CREATE INDEX "custom_col_link_path_idx" ON "custom_col_link" USING btree ("_path");
  CREATE INDEX "custom_col_link_custom_collection_idx" ON "custom_col_link" USING btree ("custom_collection_id");
  CREATE INDEX "_custom_col_link_v_order_idx" ON "_custom_col_link_v" USING btree ("_order");
  CREATE INDEX "_custom_col_link_v_parent_id_idx" ON "_custom_col_link_v" USING btree ("_parent_id");
  CREATE INDEX "_custom_col_link_v_path_idx" ON "_custom_col_link_v" USING btree ("_path");
  CREATE INDEX "_custom_col_link_v_custom_collection_idx" ON "_custom_col_link_v" USING btree ("custom_collection_id");
  CREATE INDEX "custom_col_link_2_order_idx" ON "custom_col_link_2" USING btree ("_order");
  CREATE INDEX "custom_col_link_2_parent_id_idx" ON "custom_col_link_2" USING btree ("_parent_id");
  CREATE INDEX "custom_col_link_2_path_idx" ON "custom_col_link_2" USING btree ("_path");
  CREATE INDEX "custom_col_link_2_custom_collection_idx" ON "custom_col_link_2" USING btree ("custom_collection_id");
  CREATE INDEX "_custom_col_link_v_2_order_idx" ON "_custom_col_link_v_2" USING btree ("_order");
  CREATE INDEX "_custom_col_link_v_2_parent_id_idx" ON "_custom_col_link_v_2" USING btree ("_parent_id");
  CREATE INDEX "_custom_col_link_v_2_path_idx" ON "_custom_col_link_v_2" USING btree ("_path");
  CREATE INDEX "_custom_col_link_v_2_custom_collection_idx" ON "_custom_col_link_v_2" USING btree ("custom_collection_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_custom_collections_fk" FOREIGN KEY ("custom_collections_id") REFERENCES "public"."custom_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_custom_collection_pages_fk" FOREIGN KEY ("custom_collection_pages_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_custom_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("custom_collections_id");
  CREATE INDEX "payload_locked_documents_rels_custom_collection_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("custom_collection_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "custom_collections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_custom_collections_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "custom_collection_pages_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "custom_collection_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "custom_collection_pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_custom_collection_pages_v_version_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_custom_collection_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_custom_collection_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "custom_col_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_custom_col_link_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "custom_col_link_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_custom_col_link_v_2" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "custom_collections" CASCADE;
  DROP TABLE IF EXISTS "_custom_collections_v" CASCADE;
  DROP TABLE IF EXISTS "custom_collection_pages_files" CASCADE;
  DROP TABLE IF EXISTS "custom_collection_pages" CASCADE;
  DROP TABLE IF EXISTS "custom_collection_pages_rels" CASCADE;
  DROP TABLE IF EXISTS "_custom_collection_pages_v_version_files" CASCADE;
  DROP TABLE IF EXISTS "_custom_collection_pages_v" CASCADE;
  DROP TABLE IF EXISTS "_custom_collection_pages_v_rels" CASCADE;
  DROP TABLE IF EXISTS "custom_col_link" CASCADE;
  DROP TABLE IF EXISTS "_custom_col_link_v" CASCADE;
  DROP TABLE IF EXISTS "custom_col_link_2" CASCADE;
  DROP TABLE IF EXISTS "_custom_col_link_v_2" CASCADE;
  ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_custom_collections_fk";
  
  ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_custom_collection_pages_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_custom_collections_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_custom_collection_pages_id_idx";
  ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP COLUMN IF EXISTS "custom_collections_id";
  ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP COLUMN IF EXISTS "custom_collection_pages_id";
  DROP TYPE IF EXISTS "public"."enum_custom_collections_status";
  DROP TYPE IF EXISTS "public"."enum__custom_collections_v_version_status";
  DROP TYPE IF EXISTS "public"."enum_custom_collection_pages_status";
  DROP TYPE IF EXISTS "public"."enum__custom_collection_pages_v_version_status";`)
}
