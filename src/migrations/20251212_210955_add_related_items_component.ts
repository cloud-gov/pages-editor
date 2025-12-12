import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_404_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_404_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__404_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__404_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "404" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Page Not Found',
  	"heading" varchar DEFAULT '404 - Page Not Found',
  	"content" jsonb,
  	"show_search" boolean DEFAULT true,
  	"_status" "enum_404_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "posts_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_external_link" (
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
  
  CREATE TABLE "events_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_external_link" (
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
  
  CREATE TABLE "news_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_news_v_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_news_v_blocks_external_link" (
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
  
  CREATE TABLE "reports_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "reports_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_reports_v_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_reports_v_blocks_external_link" (
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
  
  CREATE TABLE "resources_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "resources_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_resources_v_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_resources_v_blocks_external_link" (
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
  
  CREATE TABLE "404_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Page Not Found',
  	"heading" varchar DEFAULT '404 - Page Not Found',
  	"content" jsonb,
  	"show_search" boolean DEFAULT true,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_404_site_collection_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_404_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar DEFAULT 'Page Not Found',
  	"version_heading" varchar DEFAULT '404 - Page Not Found',
  	"version_content" jsonb,
  	"version_show_search" boolean DEFAULT true,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__404_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_404_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar DEFAULT 'Page Not Found',
  	"version_heading" varchar DEFAULT '404 - Page Not Found',
  	"version_content" jsonb,
  	"version_show_search" boolean DEFAULT true,
  	"version__status" "enum__404_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "404_site_collection_id" integer;
  ALTER TABLE "posts_blocks_internal_item" ADD CONSTRAINT "posts_blocks_internal_item_item_id_posts_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_internal_item" ADD CONSTRAINT "posts_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_external_link" ADD CONSTRAINT "posts_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_internal_item" ADD CONSTRAINT "_posts_v_blocks_internal_item_item_id_posts_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_internal_item" ADD CONSTRAINT "_posts_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_external_link" ADD CONSTRAINT "_posts_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_internal_item" ADD CONSTRAINT "events_blocks_internal_item_item_id_events_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_blocks_internal_item" ADD CONSTRAINT "events_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_external_link" ADD CONSTRAINT "events_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_internal_item" ADD CONSTRAINT "_events_v_blocks_internal_item_item_id_events_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_internal_item" ADD CONSTRAINT "_events_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_external_link" ADD CONSTRAINT "_events_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_internal_item" ADD CONSTRAINT "news_blocks_internal_item_item_id_news_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_internal_item" ADD CONSTRAINT "news_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_external_link" ADD CONSTRAINT "news_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_internal_item" ADD CONSTRAINT "_news_v_blocks_internal_item_item_id_news_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_internal_item" ADD CONSTRAINT "_news_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_external_link" ADD CONSTRAINT "_news_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_internal_item" ADD CONSTRAINT "reports_blocks_internal_item_item_id_reports_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_blocks_internal_item" ADD CONSTRAINT "reports_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_external_link" ADD CONSTRAINT "reports_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_internal_item" ADD CONSTRAINT "_reports_v_blocks_internal_item_item_id_reports_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_internal_item" ADD CONSTRAINT "_reports_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_external_link" ADD CONSTRAINT "_reports_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_internal_item" ADD CONSTRAINT "resources_blocks_internal_item_item_id_resources_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_blocks_internal_item" ADD CONSTRAINT "resources_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_external_link" ADD CONSTRAINT "resources_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_internal_item" ADD CONSTRAINT "_resources_v_blocks_internal_item_item_id_resources_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_internal_item" ADD CONSTRAINT "_resources_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_external_link" ADD CONSTRAINT "_resources_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_blocks_internal_item" ADD CONSTRAINT "custom_collection_pages_blocks_internal_item_item_id_custom_collection_pages_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_blocks_internal_item" ADD CONSTRAINT "custom_collection_pages_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_collection_pages_blocks_external_link" ADD CONSTRAINT "custom_collection_pages_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_blocks_internal_item" ADD CONSTRAINT "_custom_collection_pages_v_blocks_internal_item_item_id_custom_collection_pages_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."custom_collection_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_blocks_internal_item" ADD CONSTRAINT "_custom_collection_pages_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_collection_pages_v_blocks_external_link" ADD CONSTRAINT "_custom_collection_pages_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_custom_collection_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "404_site_collection" ADD CONSTRAINT "404_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_404_site_collection_v" ADD CONSTRAINT "_404_site_collection_v_parent_id_404_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."404_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_404_site_collection_v" ADD CONSTRAINT "_404_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "404__status_idx" ON "404" USING btree ("_status");
  CREATE INDEX "posts_blocks_internal_item_order_idx" ON "posts_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "posts_blocks_internal_item_parent_id_idx" ON "posts_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_internal_item_path_idx" ON "posts_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "posts_blocks_internal_item_item_idx" ON "posts_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "posts_blocks_external_link_order_idx" ON "posts_blocks_external_link" USING btree ("_order");
  CREATE INDEX "posts_blocks_external_link_parent_id_idx" ON "posts_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_external_link_path_idx" ON "posts_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_internal_item_order_idx" ON "_posts_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_internal_item_parent_id_idx" ON "_posts_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_internal_item_path_idx" ON "_posts_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_internal_item_item_idx" ON "_posts_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_posts_v_blocks_external_link_order_idx" ON "_posts_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_external_link_parent_id_idx" ON "_posts_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_external_link_path_idx" ON "_posts_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "events_blocks_internal_item_order_idx" ON "events_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "events_blocks_internal_item_parent_id_idx" ON "events_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_internal_item_path_idx" ON "events_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "events_blocks_internal_item_item_idx" ON "events_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "events_blocks_external_link_order_idx" ON "events_blocks_external_link" USING btree ("_order");
  CREATE INDEX "events_blocks_external_link_parent_id_idx" ON "events_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_external_link_path_idx" ON "events_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_internal_item_order_idx" ON "_events_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_internal_item_parent_id_idx" ON "_events_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_internal_item_path_idx" ON "_events_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_internal_item_item_idx" ON "_events_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_events_v_blocks_external_link_order_idx" ON "_events_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_external_link_parent_id_idx" ON "_events_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_external_link_path_idx" ON "_events_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "news_blocks_internal_item_order_idx" ON "news_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "news_blocks_internal_item_parent_id_idx" ON "news_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_internal_item_path_idx" ON "news_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "news_blocks_internal_item_item_idx" ON "news_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "news_blocks_external_link_order_idx" ON "news_blocks_external_link" USING btree ("_order");
  CREATE INDEX "news_blocks_external_link_parent_id_idx" ON "news_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_external_link_path_idx" ON "news_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_news_v_blocks_internal_item_order_idx" ON "_news_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_internal_item_parent_id_idx" ON "_news_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_internal_item_path_idx" ON "_news_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_news_v_blocks_internal_item_item_idx" ON "_news_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_news_v_blocks_external_link_order_idx" ON "_news_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_external_link_parent_id_idx" ON "_news_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_external_link_path_idx" ON "_news_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "reports_blocks_internal_item_order_idx" ON "reports_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "reports_blocks_internal_item_parent_id_idx" ON "reports_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_internal_item_path_idx" ON "reports_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "reports_blocks_internal_item_item_idx" ON "reports_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "reports_blocks_external_link_order_idx" ON "reports_blocks_external_link" USING btree ("_order");
  CREATE INDEX "reports_blocks_external_link_parent_id_idx" ON "reports_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_external_link_path_idx" ON "reports_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_reports_v_blocks_internal_item_order_idx" ON "_reports_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_internal_item_parent_id_idx" ON "_reports_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_internal_item_path_idx" ON "_reports_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_reports_v_blocks_internal_item_item_idx" ON "_reports_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_reports_v_blocks_external_link_order_idx" ON "_reports_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_external_link_parent_id_idx" ON "_reports_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_external_link_path_idx" ON "_reports_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "resources_blocks_internal_item_order_idx" ON "resources_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "resources_blocks_internal_item_parent_id_idx" ON "resources_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_internal_item_path_idx" ON "resources_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "resources_blocks_internal_item_item_idx" ON "resources_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "resources_blocks_external_link_order_idx" ON "resources_blocks_external_link" USING btree ("_order");
  CREATE INDEX "resources_blocks_external_link_parent_id_idx" ON "resources_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_external_link_path_idx" ON "resources_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_resources_v_blocks_internal_item_order_idx" ON "_resources_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_internal_item_parent_id_idx" ON "_resources_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_internal_item_path_idx" ON "_resources_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_resources_v_blocks_internal_item_item_idx" ON "_resources_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_resources_v_blocks_external_link_order_idx" ON "_resources_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_external_link_parent_id_idx" ON "_resources_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_external_link_path_idx" ON "_resources_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "custom_collection_pages_blocks_internal_item_order_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "custom_collection_pages_blocks_internal_item_parent_id_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "custom_collection_pages_blocks_internal_item_path_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "custom_collection_pages_blocks_internal_item_item_idx" ON "custom_collection_pages_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "custom_collection_pages_blocks_external_link_order_idx" ON "custom_collection_pages_blocks_external_link" USING btree ("_order");
  CREATE INDEX "custom_collection_pages_blocks_external_link_parent_id_idx" ON "custom_collection_pages_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "custom_collection_pages_blocks_external_link_path_idx" ON "custom_collection_pages_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_order_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_parent_id_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_path_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_custom_collection_pages_v_blocks_internal_item_item_idx" ON "_custom_collection_pages_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_custom_collection_pages_v_blocks_external_link_order_idx" ON "_custom_collection_pages_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_custom_collection_pages_v_blocks_external_link_parent_id_idx" ON "_custom_collection_pages_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_custom_collection_pages_v_blocks_external_link_path_idx" ON "_custom_collection_pages_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "404_site_collection_site_idx" ON "404_site_collection" USING btree ("site_id");
  CREATE INDEX "404_site_collection_updated_at_idx" ON "404_site_collection" USING btree ("updated_at");
  CREATE INDEX "404_site_collection_created_at_idx" ON "404_site_collection" USING btree ("created_at");
  CREATE INDEX "404_site_collection__status_idx" ON "404_site_collection" USING btree ("_status");
  CREATE INDEX "_404_site_collection_v_parent_idx" ON "_404_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_404_site_collection_v_version_version_site_idx" ON "_404_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_404_site_collection_v_version_version_updated_at_idx" ON "_404_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_404_site_collection_v_version_version_created_at_idx" ON "_404_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_404_site_collection_v_version_version__status_idx" ON "_404_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_404_site_collection_v_created_at_idx" ON "_404_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_404_site_collection_v_updated_at_idx" ON "_404_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_404_site_collection_v_latest_idx" ON "_404_site_collection_v" USING btree ("latest");
  CREATE INDEX "_404_site_collection_v_autosave_idx" ON "_404_site_collection_v" USING btree ("autosave");
  CREATE INDEX "_404_v_version_version__status_idx" ON "_404_v" USING btree ("version__status");
  CREATE INDEX "_404_v_created_at_idx" ON "_404_v" USING btree ("created_at");
  CREATE INDEX "_404_v_updated_at_idx" ON "_404_v" USING btree ("updated_at");
  CREATE INDEX "_404_v_latest_idx" ON "_404_v" USING btree ("latest");
  CREATE INDEX "_404_v_autosave_idx" ON "_404_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_404_site_collection_fk" FOREIGN KEY ("404_site_collection_id") REFERENCES "public"."404_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_404_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("404_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "404" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_collection_pages_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "custom_collection_pages_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collection_pages_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_custom_collection_pages_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "404_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_404_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_404_v" DISABLE ROW LEVEL SECURITY;
  DROP INDEX IF EXISTS "payload_locked_documents_rels_404_site_collection_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_404_site_collection_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "404_site_collection_id";
  DROP TABLE IF EXISTS "404" CASCADE;
  DROP TABLE IF EXISTS "posts_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "posts_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_posts_v_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "_posts_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "events_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "events_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_events_v_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "_events_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "news_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "news_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_news_v_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "_news_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "reports_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "reports_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_reports_v_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "_reports_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "resources_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "resources_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_resources_v_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "_resources_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "custom_collection_pages_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "custom_collection_pages_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_custom_collection_pages_v_blocks_internal_item" CASCADE;
  DROP TABLE IF EXISTS "_custom_collection_pages_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "404_site_collection" CASCADE;
  DROP TABLE IF EXISTS "_404_site_collection_v" CASCADE;
  DROP TABLE IF EXISTS "_404_v" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_404_status";
  DROP TYPE IF EXISTS "public"."enum_404_site_collection_status";
  DROP TYPE IF EXISTS "public"."enum__404_site_collection_v_version_status";
  DROP TYPE IF EXISTS "public"."enum__404_v_version_status";`)
}
