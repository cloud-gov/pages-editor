import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."sidenav_collection" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_side_navigation_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__side_navigation_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_side_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__side_navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "side_navigation_site_collection_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar DEFAULT 'Page Navigation',
  	"fallback_to_all_pages" boolean DEFAULT false,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_side_navigation_site_collection_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_enabled" boolean DEFAULT true,
  	"version_title" varchar DEFAULT 'Page Navigation',
  	"version_fallback_to_all_pages" boolean DEFAULT false,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__side_navigation_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "side_navigation_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar DEFAULT 'Page Navigation',
  	"fallback_to_all_pages" boolean DEFAULT false,
  	"_status" "enum_side_navigation_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_side_navigation_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_title" varchar DEFAULT 'Page Navigation',
  	"version_fallback_to_all_pages" boolean DEFAULT false,
  	"version__status" "enum__side_navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "side_navigation_site_collection_id" integer;
  ALTER TABLE "side_navigation_site_collection_blocks_page_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_page_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_collection_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_external_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_dropdown" ADD CONSTRAINT "side_navigation_site_collection_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection" ADD CONSTRAINT "side_navigation_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_external_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_dropdown" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v" ADD CONSTRAINT "_side_navigation_site_collection_v_parent_id_side_navigation_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v" ADD CONSTRAINT "_side_navigation_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_page_link" ADD CONSTRAINT "side_navigation_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_page_link" ADD CONSTRAINT "side_navigation_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_collection_link" ADD CONSTRAINT "side_navigation_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_external_link" ADD CONSTRAINT "side_navigation_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_dropdown" ADD CONSTRAINT "side_navigation_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_collection_link" ADD CONSTRAINT "_side_navigation_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_external_link" ADD CONSTRAINT "_side_navigation_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_dropdown" ADD CONSTRAINT "_side_navigation_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_order_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_parent_id_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_path_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_path");
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_page_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "side_navigation_site_collection_blocks_collection_link_order_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_collection_link_parent_id_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_collection_link_path_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "side_navigation_site_collection_blocks_external_link_order_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_external_link_parent_id_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_external_link_path_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_path");
  CREATE INDEX "side_navigation_site_collection_blocks_dropdown_order_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_dropdown_parent_id_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_dropdown_path_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "side_navigation_site_collection_site_idx" ON "side_navigation_site_collection" USING btree ("site_id");
  CREATE INDEX "side_navigation_site_collection_updated_at_idx" ON "side_navigation_site_collection" USING btree ("updated_at");
  CREATE INDEX "side_navigation_site_collection_created_at_idx" ON "side_navigation_site_collection" USING btree ("created_at");
  CREATE INDEX "side_navigation_site_collection__status_idx" ON "side_navigation_site_collection" USING btree ("_status");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_order_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_path_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_page_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_collection_link_order_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_collection_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_collection_link_path_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_external_link_order_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_external_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_external_link_path_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_dropdown_order_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_dropdown_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_dropdown_path_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "_side_navigation_site_collection_v_parent_idx" ON "_side_navigation_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_version_version_site_idx" ON "_side_navigation_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_side_navigation_site_collection_v_version_version_updated_at_idx" ON "_side_navigation_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_side_navigation_site_collection_v_version_version_created_at_idx" ON "_side_navigation_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_side_navigation_site_collection_v_version_version__status_idx" ON "_side_navigation_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_side_navigation_site_collection_v_created_at_idx" ON "_side_navigation_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_side_navigation_site_collection_v_updated_at_idx" ON "_side_navigation_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_side_navigation_site_collection_v_latest_idx" ON "_side_navigation_site_collection_v" USING btree ("latest");
  CREATE INDEX "_side_navigation_site_collection_v_autosave_idx" ON "_side_navigation_site_collection_v" USING btree ("autosave");
  CREATE INDEX "side_navigation_blocks_page_link_order_idx" ON "side_navigation_blocks_page_link" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_page_link_parent_id_idx" ON "side_navigation_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_page_link_path_idx" ON "side_navigation_blocks_page_link" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_page_link_page_idx" ON "side_navigation_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "side_navigation_blocks_collection_link_order_idx" ON "side_navigation_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_collection_link_parent_id_idx" ON "side_navigation_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_collection_link_path_idx" ON "side_navigation_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_external_link_order_idx" ON "side_navigation_blocks_external_link" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_external_link_parent_id_idx" ON "side_navigation_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_external_link_path_idx" ON "side_navigation_blocks_external_link" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_dropdown_order_idx" ON "side_navigation_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_dropdown_parent_id_idx" ON "side_navigation_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_dropdown_path_idx" ON "side_navigation_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "side_navigation__status_idx" ON "side_navigation" USING btree ("_status");
  CREATE INDEX "_side_navigation_v_blocks_page_link_order_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_page_link_parent_id_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_page_link_path_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_page_link_page_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_side_navigation_v_blocks_collection_link_order_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_collection_link_parent_id_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_collection_link_path_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_external_link_order_idx" ON "_side_navigation_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_external_link_parent_id_idx" ON "_side_navigation_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_external_link_path_idx" ON "_side_navigation_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_dropdown_order_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_dropdown_parent_id_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_dropdown_path_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_version_version__status_idx" ON "_side_navigation_v" USING btree ("version__status");
  CREATE INDEX "_side_navigation_v_created_at_idx" ON "_side_navigation_v" USING btree ("created_at");
  CREATE INDEX "_side_navigation_v_updated_at_idx" ON "_side_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_side_navigation_v_latest_idx" ON "_side_navigation_v" USING btree ("latest");
  CREATE INDEX "_side_navigation_v_autosave_idx" ON "_side_navigation_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_side_navigation_site_collection_fk" FOREIGN KEY ("side_navigation_site_collection_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_side_navigation_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("side_navigation_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "side_navigation_site_collection_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "side_navigation_site_collection_blocks_page_link" CASCADE;
  DROP TABLE "side_navigation_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "side_navigation_site_collection_blocks_external_link" CASCADE;
  DROP TABLE "side_navigation_site_collection_blocks_dropdown" CASCADE;
  DROP TABLE "side_navigation_site_collection" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_page_link" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_external_link" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_dropdown" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v" CASCADE;
  DROP TABLE "side_navigation_blocks_page_link" CASCADE;
  DROP TABLE "side_navigation_blocks_collection_link" CASCADE;
  DROP TABLE "side_navigation_blocks_external_link" CASCADE;
  DROP TABLE "side_navigation_blocks_dropdown" CASCADE;
  DROP TABLE "side_navigation" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_page_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_collection_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_external_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_dropdown" CASCADE;
  DROP TABLE "_side_navigation_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_side_navigation_site_collection_fk";
  
  DROP INDEX "payload_locked_documents_rels_side_navigation_site_collection_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "side_navigation_site_collection_id";
  DROP TYPE "public"."sidenav_collection";
  DROP TYPE "public"."enum_side_navigation_site_collection_status";
  DROP TYPE "public"."enum__side_navigation_site_collection_v_version_status";
  DROP TYPE "public"."enum_side_navigation_status";
  DROP TYPE "public"."enum__side_navigation_v_version_status";`)
}
