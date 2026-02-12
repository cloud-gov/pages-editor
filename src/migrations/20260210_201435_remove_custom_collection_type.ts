import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"title" varchar
  );
  
  ALTER TABLE "custom_collections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collections_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_collection_pages_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_collection_pages_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_collection_pages_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_collection_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_collection_pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collection_pages_v_version_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collection_pages_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collection_pages_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collection_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collection_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_categories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "custom_collections" CASCADE;
  DROP TABLE "_custom_collections_v" CASCADE;
  DROP TABLE "custom_collection_pages_files" CASCADE;
  DROP TABLE "custom_collection_pages_blocks_internal_item" CASCADE;
  DROP TABLE "custom_collection_pages_blocks_external_link" CASCADE;
  DROP TABLE "custom_collection_pages" CASCADE;
  DROP TABLE "custom_collection_pages_rels" CASCADE;
  DROP TABLE "_custom_collection_pages_v_version_files" CASCADE;
  DROP TABLE "_custom_collection_pages_v_blocks_internal_item" CASCADE;
  DROP TABLE "_custom_collection_pages_v_blocks_external_link" CASCADE;
  DROP TABLE "_custom_collection_pages_v" CASCADE;
  DROP TABLE "_custom_collection_pages_v_rels" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  ALTER TABLE "posts_rels" DROP CONSTRAINT IF EXISTS "posts_rels_categories_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT IF EXISTS "_posts_v_rels_categories_fk";
  
  ALTER TABLE "events_rels" DROP CONSTRAINT IF EXISTS "events_rels_categories_fk";
  
  ALTER TABLE "_events_v_rels" DROP CONSTRAINT IF EXISTS "_events_v_rels_categories_fk";
  
  ALTER TABLE "news_rels" DROP CONSTRAINT IF EXISTS "news_rels_categories_fk";
  
  ALTER TABLE "_news_v_rels" DROP CONSTRAINT IF EXISTS "_news_v_rels_categories_fk";
  
  ALTER TABLE "reports_rels" DROP CONSTRAINT IF EXISTS "reports_rels_categories_fk";
  
  ALTER TABLE "_reports_v_rels" DROP CONSTRAINT IF EXISTS "_reports_v_rels_categories_fk";
  
  ALTER TABLE "resources_rels" DROP CONSTRAINT IF EXISTS "resources_rels_categories_fk";
  
  ALTER TABLE "_resources_v_rels" DROP CONSTRAINT IF EXISTS "_resources_v_rels_categories_fk";
  
  ALTER TABLE "menu_site_collection_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "menu_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "_menu_site_collection_v_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "_menu_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "footer_site_collection_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "footer_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "_footer_site_collection_v_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "_footer_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "pre_footer_site_collection_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "pre_footer_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "_pre_footer_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_custom_collections_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_custom_collection_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_redirects_fk";
  
  ALTER TABLE "menu_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "menu_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "_menu_v_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "_menu_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "footer_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "footer_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "_footer_v_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "_footer_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "pre_footer_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "pre_footer_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  ALTER TABLE "_pre_footer_v_blocks_custom_collection_link" DROP CONSTRAINT IF EXISTS "_pre_footer_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk";
  
  DROP INDEX "posts_rels_categories_id_idx";
  DROP INDEX "_posts_v_rels_categories_id_idx";
  DROP INDEX "events_rels_categories_id_idx";
  DROP INDEX "_events_v_rels_categories_id_idx";
  DROP INDEX "news_rels_categories_id_idx";
  DROP INDEX "_news_v_rels_categories_id_idx";
  DROP INDEX "reports_rels_categories_id_idx";
  DROP INDEX "_reports_v_rels_categories_id_idx";
  DROP INDEX "resources_rels_categories_id_idx";
  DROP INDEX "_resources_v_rels_categories_id_idx";
  DROP INDEX "menu_site_collection_blocks_custom_collection_link_custo_idx";
  DROP INDEX "_menu_site_collection_v_blocks_custom_collection_link_cu_idx";
  DROP INDEX "footer_site_collection_blocks_custom_collection_link_cus_idx";
  DROP INDEX "_footer_site_collection_v_blocks_custom_collection_link__idx";
  DROP INDEX "pre_footer_site_collection_blocks_custom_collection_link_idx";
  DROP INDEX "_pre_footer_site_collection_v_blocks_custom_collection_l_idx";
  DROP INDEX "search_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_custom_collections_id_idx";
  DROP INDEX "payload_locked_documents_rels_custom_collection_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  DROP INDEX "menu_blocks_custom_collection_link_custom_collection_idx";
  DROP INDEX "_menu_v_blocks_custom_collection_link_custom_collection_idx";
  DROP INDEX "footer_blocks_custom_collection_link_custom_collection_idx";
  DROP INDEX "_footer_v_blocks_custom_collection_link_custom_collectio_idx";
  DROP INDEX "pre_footer_blocks_custom_collection_link_custom_collecti_idx";
  DROP INDEX "_pre_footer_v_blocks_custom_collection_link_custom_colle_idx";
  ALTER TABLE "posts_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "events_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "_events_v_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "news_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "_news_v_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "reports_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "_reports_v_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "resources_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "_resources_v_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "tags" ADD CONSTRAINT "tags_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_tags" ADD CONSTRAINT "search_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_site_idx" ON "tags" USING btree ("site_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "search_tags_order_idx" ON "search_tags" USING btree ("_order");
  CREATE INDEX "search_tags_parent_id_idx" ON "search_tags" USING btree ("_parent_id");
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX "events_rels_tags_id_idx" ON "events_rels" USING btree ("tags_id");
  CREATE INDEX "_events_v_rels_tags_id_idx" ON "_events_v_rels" USING btree ("tags_id");
  CREATE INDEX "news_rels_tags_id_idx" ON "news_rels" USING btree ("tags_id");
  CREATE INDEX "_news_v_rels_tags_id_idx" ON "_news_v_rels" USING btree ("tags_id");
  CREATE INDEX "reports_rels_tags_id_idx" ON "reports_rels" USING btree ("tags_id");
  CREATE INDEX "_reports_v_rels_tags_id_idx" ON "_reports_v_rels" USING btree ("tags_id");
  CREATE INDEX "resources_rels_tags_id_idx" ON "resources_rels" USING btree ("tags_id");
  CREATE INDEX "_resources_v_rels_tags_id_idx" ON "_resources_v_rels" USING btree ("tags_id");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  ALTER TABLE "posts_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "events_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_events_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "news_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_news_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "reports_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_reports_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "resources_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_resources_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "menu_site_collection_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "_menu_site_collection_v_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "footer_site_collection_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "_footer_site_collection_v_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "pre_footer_site_collection_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "search_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "custom_collections_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "custom_collection_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  ALTER TABLE "menu_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "_menu_v_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "footer_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "_footer_v_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "pre_footer_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  ALTER TABLE "_pre_footer_v_blocks_custom_collection_link" DROP COLUMN "custom_collection_id";
  DROP TYPE "public"."enum_custom_collections_status";
  DROP TYPE "public"."enum__custom_collections_v_version_status";
  DROP TYPE "public"."enum_custom_collection_pages_status";
  DROP TYPE "public"."enum__custom_collection_pages_v_version_status";
  DROP TYPE "public"."enum_redirects_to_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_custom_collections_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__custom_collections_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_custom_collection_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__custom_collection_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TABLE "custom_collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
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
  	"version_slug_lock" boolean DEFAULT false,
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
  
  CREATE TABLE "custom_collection_pages_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "custom_collection_pages_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "custom_collection_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_config_id" integer,
  	"title" varchar,
  	"excerpt" varchar,
  	"image_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
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
  
  CREATE TABLE "_custom_collection_pages_v_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_custom_collection_pages_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_custom_collection_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_collection_config_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
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
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"site_id" integer NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"title" varchar
  );
  
  ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "search_tags" CASCADE;
  ALTER TABLE "posts_rels" DROP CONSTRAINT IF EXISTS "posts_rels_tags_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT IF EXISTS "_posts_v_rels_tags_fk";
  
  ALTER TABLE "events_rels" DROP CONSTRAINT IF EXISTS "events_rels_tags_fk";
  
  ALTER TABLE "_events_v_rels" DROP CONSTRAINT IF EXISTS "_events_v_rels_tags_fk";
  
  ALTER TABLE "news_rels" DROP CONSTRAINT IF EXISTS "news_rels_tags_fk";
  
  ALTER TABLE "_news_v_rels" DROP CONSTRAINT IF EXISTS "_news_v_rels_tags_fk";
  
  ALTER TABLE "reports_rels" DROP CONSTRAINT IF EXISTS "reports_rels_tags_fk";
  
  ALTER TABLE "_reports_v_rels" DROP CONSTRAINT IF EXISTS "_reports_v_rels_tags_fk";
  
  ALTER TABLE "resources_rels" DROP CONSTRAINT IF EXISTS "resources_rels_tags_fk";
  
  ALTER TABLE "_resources_v_rels" DROP CONSTRAINT IF EXISTS "_resources_v_rels_tags_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_tags_fk";
  
  DROP INDEX "posts_rels_tags_id_idx";
  DROP INDEX "_posts_v_rels_tags_id_idx";
  DROP INDEX "events_rels_tags_id_idx";
  DROP INDEX "_events_v_rels_tags_id_idx";
  DROP INDEX "news_rels_tags_id_idx";
  DROP INDEX "_news_v_rels_tags_id_idx";
  DROP INDEX "reports_rels_tags_id_idx";
  DROP INDEX "_reports_v_rels_tags_id_idx";
  DROP INDEX "resources_rels_tags_id_idx";
  DROP INDEX "_resources_v_rels_tags_id_idx";
  DROP INDEX "search_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  ALTER TABLE "posts_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "events_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_events_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "news_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_news_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "reports_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_reports_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "resources_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_resources_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "menu_site_collection_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "_menu_site_collection_v_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "footer_site_collection_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "_footer_site_collection_v_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "pre_footer_site_collection_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "custom_collections_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "custom_collection_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "menu_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "_menu_v_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "footer_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "_footer_v_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "pre_footer_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "_pre_footer_v_blocks_custom_collection_link" ADD COLUMN "custom_collection_id" integer;
  ALTER TABLE "custom_collections" ADD CONSTRAINT "custom_collections_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collections" ADD CONSTRAINT "custom_collections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collections_v" ADD CONSTRAINT "_custom_collections_v_parent_id_custom_collections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collections_v" ADD CONSTRAINT "_custom_collections_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collections_v" ADD CONSTRAINT "_custom_collections_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_files" ADD CONSTRAINT "custom_collection_pages_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_files" ADD CONSTRAINT "custom_collection_pages_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_blocks_internal_item" ADD CONSTRAINT "custom_collection_pages_blocks_internal_item_item_id_custom_collection_pages_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_blocks_internal_item" ADD CONSTRAINT "custom_collection_pages_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_blocks_external_link" ADD CONSTRAINT "custom_collection_pages_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_collection_config_id_custom_collections_id_fk" FOREIGN KEY ("collection_config_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages" ADD CONSTRAINT "custom_collection_pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_rels" ADD CONSTRAINT "custom_collection_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_rels" ADD CONSTRAINT "custom_collection_pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_version_files" ADD CONSTRAINT "_custom_collection_pages_v_version_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_version_files" ADD CONSTRAINT "_custom_collection_pages_v_version_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_blocks_internal_item" ADD CONSTRAINT "_custom_collection_pages_v_blocks_internal_item_item_id_custom_collection_pages_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_blocks_internal_item" ADD CONSTRAINT "_custom_collection_pages_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_blocks_external_link" ADD CONSTRAINT "_custom_collection_pages_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_parent_id_custom_collection_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_collection_config_id_custom_collections_id_fk" FOREIGN KEY ("version_collection_config_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v" ADD CONSTRAINT "_custom_collection_pages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_rels" ADD CONSTRAINT "_custom_collection_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_rels" ADD CONSTRAINT "_custom_collection_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX "custom_collection_pages_blocks_internal_item_order_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "custom_collection_pages_blocks_internal_item_parent_id_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "custom_collection_pages_blocks_internal_item_path_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "custom_collection_pages_blocks_internal_item_item_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "custom_collection_pages_blocks_external_link_order_idx" ON "custom_collection_pages_blocks_external_link" USING btree ("_order");
  CREATE INDEX "custom_collection_pages_blocks_external_link_parent_id_idx" ON "custom_collection_pages_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "custom_collection_pages_blocks_external_link_path_idx" ON "custom_collection_pages_blocks_external_link" USING btree ("_path");
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
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_order_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_parent_id_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_path_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_item_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_custom_collection_pages_v_blocks_external_link_order_idx" ON "_custom_collection_pages_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_custom_collection_pages_v_blocks_external_link_parent_id_idx" ON "_custom_collection_pages_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_custom_collection_pages_v_blocks_external_link_path_idx" ON "_custom_collection_pages_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_custom_collection_pages_v_parent_idx" ON "_custom_collection_pages_v" USING btree ("parent_id");
  CREATE INDEX "_custom_collection_pages_v_version_version_collection_co_idx" ON "_custom_collection_pages_v" USING btree ("version_collection_config_id");
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
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_site_idx" ON "categories" USING btree ("site_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "menu_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "footer_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_custom_collections_fk" FOREIGN KEY ("custom_collections_id") REFERENCES "public"."custom_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_custom_collection_pages_fk" FOREIGN KEY ("custom_collection_pages_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_custom_collection_link" ADD CONSTRAINT "menu_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_blocks_custom_collection_link" ADD CONSTRAINT "footer_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "events_rels_categories_id_idx" ON "events_rels" USING btree ("categories_id");
  CREATE INDEX "_events_v_rels_categories_id_idx" ON "_events_v_rels" USING btree ("categories_id");
  CREATE INDEX "news_rels_categories_id_idx" ON "news_rels" USING btree ("categories_id");
  CREATE INDEX "_news_v_rels_categories_id_idx" ON "_news_v_rels" USING btree ("categories_id");
  CREATE INDEX "reports_rels_categories_id_idx" ON "reports_rels" USING btree ("categories_id");
  CREATE INDEX "_reports_v_rels_categories_id_idx" ON "_reports_v_rels" USING btree ("categories_id");
  CREATE INDEX "resources_rels_categories_id_idx" ON "resources_rels" USING btree ("categories_id");
  CREATE INDEX "_resources_v_rels_categories_id_idx" ON "_resources_v_rels" USING btree ("categories_id");
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_custo_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_cu_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_cus_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link__idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_l_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_custom_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("custom_collections_id");
  CREATE INDEX "payload_locked_documents_rels_custom_collection_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("custom_collection_pages_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "menu_blocks_custom_collection_link_custom_collection_idx" ON "menu_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_custom_collection_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "footer_blocks_custom_collection_link_custom_collection_idx" ON "footer_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_custom_collectio_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_custom_collecti_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_custom_colle_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  ALTER TABLE "posts_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "events_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_events_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "news_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_news_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "reports_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_reports_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "resources_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_resources_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "search_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";`)
}
