import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_event_type" AS ENUM('onetime', 'series');
  CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('onetime', 'series');
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "collection_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menu_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"page_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"page_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_dropdown_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"page_id" integer NOT NULL
  );
  
  CREATE TABLE "menu_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "media" RENAME COLUMN "alt" TO "alt_text";
  DROP INDEX "_site_config_site_collection_v_version_version_updated_at_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_created_at_idx";
  DROP INDEX "payload_locked_documents_rels_site_config_site_collection_id_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  ALTER TABLE "posts" ADD COLUMN "description" varchar;
  ALTER TABLE "posts" ADD COLUMN "image_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "events" ADD COLUMN "image_id" integer;
  ALTER TABLE "events" ADD COLUMN "event_type" "enum_events_event_type" DEFAULT 'onetime';
  ALTER TABLE "events" ADD COLUMN "content" jsonb;
  ALTER TABLE "_events_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "_events_v" ADD COLUMN "version_event_type" "enum__events_v_version_event_type" DEFAULT 'onetime';
  ALTER TABLE "_events_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "news" ADD COLUMN "description" varchar;
  ALTER TABLE "news" ADD COLUMN "image_id" integer;
  ALTER TABLE "_news_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "collection_landing_pages_id" integer;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_page_link" ADD CONSTRAINT "menu_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_blocks_page_link" ADD CONSTRAINT "menu_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_link" ADD CONSTRAINT "menu_blocks_collection_link_page_id_collection_landing_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."collection_landing_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_link" ADD CONSTRAINT "menu_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_dropdown_sub_items" ADD CONSTRAINT "menu_blocks_dropdown_sub_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_blocks_dropdown_sub_items" ADD CONSTRAINT "menu_blocks_dropdown_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_blocks_dropdown"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_dropdown" ADD CONSTRAINT "menu_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX "events_rels_categories_id_idx" ON "events_rels" USING btree ("categories_id");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");
  CREATE INDEX "_events_v_rels_categories_id_idx" ON "_events_v_rels" USING btree ("categories_id");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_categories_id_idx" ON "news_rels" USING btree ("categories_id");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_categories_id_idx" ON "_news_v_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "collection_landing_pages_slug_idx" ON "collection_landing_pages" USING btree ("slug");
  CREATE INDEX "collection_landing_pages_updated_at_idx" ON "collection_landing_pages" USING btree ("updated_at");
  CREATE INDEX "collection_landing_pages_created_at_idx" ON "collection_landing_pages" USING btree ("created_at");
  CREATE INDEX "menu_blocks_page_link_order_idx" ON "menu_blocks_page_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_page_link_parent_id_idx" ON "menu_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_page_link_path_idx" ON "menu_blocks_page_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_page_link_page_idx" ON "menu_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "menu_blocks_collection_link_order_idx" ON "menu_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_collection_link_parent_id_idx" ON "menu_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_collection_link_path_idx" ON "menu_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_collection_link_page_idx" ON "menu_blocks_collection_link" USING btree ("page_id");
  CREATE INDEX "menu_blocks_dropdown_sub_items_order_idx" ON "menu_blocks_dropdown_sub_items" USING btree ("_order");
  CREATE INDEX "menu_blocks_dropdown_sub_items_parent_id_idx" ON "menu_blocks_dropdown_sub_items" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_dropdown_sub_items_page_idx" ON "menu_blocks_dropdown_sub_items" USING btree ("page_id");
  CREATE INDEX "menu_blocks_dropdown_order_idx" ON "menu_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "menu_blocks_dropdown_parent_id_idx" ON "menu_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_dropdown_path_idx" ON "menu_blocks_dropdown" USING btree ("_path");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collection_landing_pages_fk" FOREIGN KEY ("collection_landing_pages_id") REFERENCES "public"."collection_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_image_idx" ON "posts" USING btree ("image_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_version_version_image_idx" ON "_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_site_config_site_collection_v_version_version_updated_a_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_config_site_collection_v_version_version_created_a_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "payload_locked_documents_rels_site_config_site_collectio_idx" ON "payload_locked_documents_rels" USING btree ("site_config_site_collection_id");
  CREATE INDEX "payload_locked_documents_rels_collection_landing_pages_i_idx" ON "payload_locked_documents_rels" USING btree ("collection_landing_pages_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "media" DROP COLUMN "_status";
  ALTER TABLE "media" DROP COLUMN "review_ready";
  DROP TYPE "public"."enum_media_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_status" AS ENUM('draft', 'published');
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_landing_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_blocks_dropdown_sub_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "collection_landing_pages" CASCADE;
  DROP TABLE "menu_blocks_page_link" CASCADE;
  DROP TABLE "menu_blocks_collection_link" CASCADE;
  DROP TABLE "menu_blocks_dropdown_sub_items" CASCADE;
  DROP TABLE "menu_blocks_dropdown" CASCADE;
  DROP TABLE "menu" CASCADE;
  ALTER TABLE "media" RENAME COLUMN "alt_text" TO "alt";
  ALTER TABLE "posts" DROP CONSTRAINT "posts_image_id_media_id_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_categories_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_categories_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_image_id_media_id_fk";
  
  ALTER TABLE "_events_v" DROP CONSTRAINT "_events_v_version_image_id_media_id_fk";
  
  ALTER TABLE "news" DROP CONSTRAINT "news_image_id_media_id_fk";
  
  ALTER TABLE "_news_v" DROP CONSTRAINT "_news_v_version_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_collection_landing_pages_fk";
  
  DROP INDEX "posts_image_idx";
  DROP INDEX "posts_rels_categories_id_idx";
  DROP INDEX "_posts_v_version_version_image_idx";
  DROP INDEX "_posts_v_rels_categories_id_idx";
  DROP INDEX "events_image_idx";
  DROP INDEX "_events_v_version_version_image_idx";
  DROP INDEX "news_image_idx";
  DROP INDEX "_news_v_version_version_image_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_updated_a_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_created_a_idx";
  DROP INDEX "payload_locked_documents_rels_site_config_site_collectio_idx";
  DROP INDEX "payload_locked_documents_rels_collection_landing_pages_i_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  ALTER TABLE "media" ADD COLUMN "caption" jsonb;
  ALTER TABLE "media" ADD COLUMN "_status" "enum_media_status" DEFAULT 'draft';
  ALTER TABLE "media" ADD COLUMN "review_ready" boolean DEFAULT true;
  CREATE INDEX "_site_config_site_collection_v_version_version_updated_at_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_config_site_collection_v_version_version_created_at_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "payload_locked_documents_rels_site_config_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("site_config_site_collection_id");
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "posts" DROP COLUMN "description";
  ALTER TABLE "posts" DROP COLUMN "image_id";
  ALTER TABLE "posts_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_image_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "events" DROP COLUMN "image_id";
  ALTER TABLE "events" DROP COLUMN "event_type";
  ALTER TABLE "events" DROP COLUMN "content";
  ALTER TABLE "_events_v" DROP COLUMN "version_image_id";
  ALTER TABLE "_events_v" DROP COLUMN "version_event_type";
  ALTER TABLE "_events_v" DROP COLUMN "version_content";
  ALTER TABLE "news" DROP COLUMN "description";
  ALTER TABLE "news" DROP COLUMN "image_id";
  ALTER TABLE "_news_v" DROP COLUMN "version_description";
  ALTER TABLE "_news_v" DROP COLUMN "version_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "collection_landing_pages_id";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum__events_v_version_event_type";`)
}
