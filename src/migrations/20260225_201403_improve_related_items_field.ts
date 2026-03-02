import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "posts_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "news_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_news_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_news_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "reports_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "reports_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_reports_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_reports_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "resources_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "resources_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_resources_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_resources_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "collection_entries_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "collection_entries_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "posts_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_blocks_internal_item" CASCADE;
  DROP TABLE "_posts_v_blocks_internal_item" CASCADE;
  DROP TABLE "events_blocks_internal_item" CASCADE;
  DROP TABLE "_events_v_blocks_internal_item" CASCADE;
  DROP TABLE "news_blocks_internal_item" CASCADE;
  DROP TABLE "_news_v_blocks_internal_item" CASCADE;
  DROP TABLE "reports_blocks_internal_item" CASCADE;
  DROP TABLE "_reports_v_blocks_internal_item" CASCADE;
  DROP TABLE "resources_blocks_internal_item" CASCADE;
  DROP TABLE "_resources_v_blocks_internal_item" CASCADE;
  DROP TABLE "collection_entries_blocks_internal_item" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_internal_item" CASCADE;
  ALTER TABLE "collection_entries" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "_collection_entries_v" ALTER COLUMN "version_description" SET DATA TYPE varchar;
  ALTER TABLE "posts_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_posts_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "events_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_events_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "news_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_news_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "reports_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_reports_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "resources_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_resources_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "collection_entries_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_collection_entries_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "posts_blocks_page_link" ADD CONSTRAINT "posts_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_page_link" ADD CONSTRAINT "posts_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_collection_entry_link" ADD CONSTRAINT "posts_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_collection_entry_link" ADD CONSTRAINT "posts_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_page_link" ADD CONSTRAINT "_posts_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_page_link" ADD CONSTRAINT "_posts_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_collection_entry_link" ADD CONSTRAINT "_posts_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_collection_entry_link" ADD CONSTRAINT "_posts_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_page_link" ADD CONSTRAINT "events_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_blocks_page_link" ADD CONSTRAINT "events_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_collection_entry_link" ADD CONSTRAINT "events_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_blocks_collection_entry_link" ADD CONSTRAINT "events_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_page_link" ADD CONSTRAINT "_events_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_page_link" ADD CONSTRAINT "_events_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_collection_entry_link" ADD CONSTRAINT "_events_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_collection_entry_link" ADD CONSTRAINT "_events_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_page_link" ADD CONSTRAINT "news_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_page_link" ADD CONSTRAINT "news_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_collection_entry_link" ADD CONSTRAINT "news_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_collection_entry_link" ADD CONSTRAINT "news_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_page_link" ADD CONSTRAINT "_news_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_page_link" ADD CONSTRAINT "_news_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_collection_entry_link" ADD CONSTRAINT "_news_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_collection_entry_link" ADD CONSTRAINT "_news_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_page_link" ADD CONSTRAINT "reports_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_blocks_page_link" ADD CONSTRAINT "reports_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_collection_entry_link" ADD CONSTRAINT "reports_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_blocks_collection_entry_link" ADD CONSTRAINT "reports_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_page_link" ADD CONSTRAINT "_reports_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_page_link" ADD CONSTRAINT "_reports_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_collection_entry_link" ADD CONSTRAINT "_reports_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_collection_entry_link" ADD CONSTRAINT "_reports_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_page_link" ADD CONSTRAINT "resources_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_blocks_page_link" ADD CONSTRAINT "resources_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_collection_entry_link" ADD CONSTRAINT "resources_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_blocks_collection_entry_link" ADD CONSTRAINT "resources_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_page_link" ADD CONSTRAINT "_resources_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_page_link" ADD CONSTRAINT "_resources_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_collection_entry_link" ADD CONSTRAINT "_resources_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_collection_entry_link" ADD CONSTRAINT "_resources_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_page_link" ADD CONSTRAINT "collection_entries_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_page_link" ADD CONSTRAINT "collection_entries_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_collection_entry_link" ADD CONSTRAINT "collection_entries_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_collection_entry_link" ADD CONSTRAINT "collection_entries_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_page_link" ADD CONSTRAINT "_collection_entries_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_page_link" ADD CONSTRAINT "_collection_entries_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_collection_entry_link" ADD CONSTRAINT "_collection_entries_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_collection_entry_link" ADD CONSTRAINT "_collection_entries_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_blocks_page_link_order_idx" ON "posts_blocks_page_link" USING btree ("_order");
  CREATE INDEX "posts_blocks_page_link_parent_id_idx" ON "posts_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_page_link_path_idx" ON "posts_blocks_page_link" USING btree ("_path");
  CREATE INDEX "posts_blocks_page_link_page_idx" ON "posts_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "posts_blocks_collection_entry_link_order_idx" ON "posts_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "posts_blocks_collection_entry_link_parent_id_idx" ON "posts_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_collection_entry_link_path_idx" ON "posts_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "posts_blocks_collection_entry_link_collection_entry_idx" ON "posts_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_posts_v_blocks_page_link_order_idx" ON "_posts_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_page_link_parent_id_idx" ON "_posts_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_page_link_path_idx" ON "_posts_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_page_link_page_idx" ON "_posts_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_order_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_parent_id_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_path_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_collection_entry_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "events_blocks_page_link_order_idx" ON "events_blocks_page_link" USING btree ("_order");
  CREATE INDEX "events_blocks_page_link_parent_id_idx" ON "events_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_page_link_path_idx" ON "events_blocks_page_link" USING btree ("_path");
  CREATE INDEX "events_blocks_page_link_page_idx" ON "events_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "events_blocks_collection_entry_link_order_idx" ON "events_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "events_blocks_collection_entry_link_parent_id_idx" ON "events_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_collection_entry_link_path_idx" ON "events_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "events_blocks_collection_entry_link_collection_entry_idx" ON "events_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_events_v_blocks_page_link_order_idx" ON "_events_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_page_link_parent_id_idx" ON "_events_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_page_link_path_idx" ON "_events_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_page_link_page_idx" ON "_events_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_events_v_blocks_collection_entry_link_order_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_collection_entry_link_parent_id_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_collection_entry_link_path_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_collection_entry_link_collection_entry_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "news_blocks_page_link_order_idx" ON "news_blocks_page_link" USING btree ("_order");
  CREATE INDEX "news_blocks_page_link_parent_id_idx" ON "news_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_page_link_path_idx" ON "news_blocks_page_link" USING btree ("_path");
  CREATE INDEX "news_blocks_page_link_page_idx" ON "news_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "news_blocks_collection_entry_link_order_idx" ON "news_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "news_blocks_collection_entry_link_parent_id_idx" ON "news_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_collection_entry_link_path_idx" ON "news_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "news_blocks_collection_entry_link_collection_entry_idx" ON "news_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_news_v_blocks_page_link_order_idx" ON "_news_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_page_link_parent_id_idx" ON "_news_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_page_link_path_idx" ON "_news_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_news_v_blocks_page_link_page_idx" ON "_news_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_news_v_blocks_collection_entry_link_order_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_collection_entry_link_parent_id_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_collection_entry_link_path_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_news_v_blocks_collection_entry_link_collection_entry_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "reports_blocks_page_link_order_idx" ON "reports_blocks_page_link" USING btree ("_order");
  CREATE INDEX "reports_blocks_page_link_parent_id_idx" ON "reports_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_page_link_path_idx" ON "reports_blocks_page_link" USING btree ("_path");
  CREATE INDEX "reports_blocks_page_link_page_idx" ON "reports_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "reports_blocks_collection_entry_link_order_idx" ON "reports_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "reports_blocks_collection_entry_link_parent_id_idx" ON "reports_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_collection_entry_link_path_idx" ON "reports_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "reports_blocks_collection_entry_link_collection_entry_idx" ON "reports_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_reports_v_blocks_page_link_order_idx" ON "_reports_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_page_link_parent_id_idx" ON "_reports_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_page_link_path_idx" ON "_reports_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_reports_v_blocks_page_link_page_idx" ON "_reports_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_order_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_parent_id_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_path_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_collection_entry_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "resources_blocks_page_link_order_idx" ON "resources_blocks_page_link" USING btree ("_order");
  CREATE INDEX "resources_blocks_page_link_parent_id_idx" ON "resources_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_page_link_path_idx" ON "resources_blocks_page_link" USING btree ("_path");
  CREATE INDEX "resources_blocks_page_link_page_idx" ON "resources_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "resources_blocks_collection_entry_link_order_idx" ON "resources_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "resources_blocks_collection_entry_link_parent_id_idx" ON "resources_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_collection_entry_link_path_idx" ON "resources_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "resources_blocks_collection_entry_link_collection_entry_idx" ON "resources_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_resources_v_blocks_page_link_order_idx" ON "_resources_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_page_link_parent_id_idx" ON "_resources_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_page_link_path_idx" ON "_resources_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_resources_v_blocks_page_link_page_idx" ON "_resources_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_order_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_parent_id_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_path_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_collection_ent_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "collection_entries_blocks_page_link_order_idx" ON "collection_entries_blocks_page_link" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_page_link_parent_id_idx" ON "collection_entries_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_page_link_path_idx" ON "collection_entries_blocks_page_link" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_page_link_page_idx" ON "collection_entries_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "collection_entries_blocks_collection_entry_link_order_idx" ON "collection_entries_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_collection_entry_link_parent_id_idx" ON "collection_entries_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_collection_entry_link_path_idx" ON "collection_entries_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_collection_entry_link_collecti_idx" ON "collection_entries_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_collection_entries_v_blocks_page_link_order_idx" ON "_collection_entries_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_page_link_parent_id_idx" ON "_collection_entries_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_page_link_path_idx" ON "_collection_entries_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_page_link_page_idx" ON "_collection_entries_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_collection_entries_v_blocks_collection_entry_link_order_idx" ON "_collection_entries_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_collection_entry_link_parent_id_idx" ON "_collection_entries_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_collection_entry_link_path_idx" ON "_collection_entries_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_collection_entry_link_colle_idx" ON "_collection_entries_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  ALTER TABLE "posts_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "posts_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "_posts_v_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "_posts_v_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "events_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "events_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "_events_v_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "_events_v_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "news_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "news_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "_news_v_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "_news_v_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "reports_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "reports_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "_reports_v_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "_reports_v_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "resources_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "resources_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "_resources_v_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "_resources_v_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "collection_entries_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "collection_entries_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "collection_entries" DROP COLUMN "show_in_page_nav";
  ALTER TABLE "_collection_entries_v_blocks_external_link" DROP COLUMN "title";
  ALTER TABLE "_collection_entries_v_blocks_external_link" DROP COLUMN "description";
  ALTER TABLE "_collection_entries_v" DROP COLUMN "version_show_in_page_nav";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "posts_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
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
  
  CREATE TABLE "events_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
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
  
  CREATE TABLE "news_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
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
  
  CREATE TABLE "reports_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
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
  
  CREATE TABLE "resources_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
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
  
  CREATE TABLE "collection_entries_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_internal_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_id" integer,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "posts_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_blocks_page_link" CASCADE;
  DROP TABLE "posts_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_posts_v_blocks_page_link" CASCADE;
  DROP TABLE "_posts_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "events_blocks_page_link" CASCADE;
  DROP TABLE "events_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_events_v_blocks_page_link" CASCADE;
  DROP TABLE "_events_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "news_blocks_page_link" CASCADE;
  DROP TABLE "news_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_news_v_blocks_page_link" CASCADE;
  DROP TABLE "_news_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "reports_blocks_page_link" CASCADE;
  DROP TABLE "reports_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_reports_v_blocks_page_link" CASCADE;
  DROP TABLE "_reports_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "resources_blocks_page_link" CASCADE;
  DROP TABLE "resources_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_resources_v_blocks_page_link" CASCADE;
  DROP TABLE "_resources_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "collection_entries_blocks_page_link" CASCADE;
  DROP TABLE "collection_entries_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_page_link" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_collection_entry_link" CASCADE;
  ALTER TABLE "collection_entries" ALTER COLUMN "description" SET DATA TYPE jsonb USING NULL;
  ALTER TABLE "_collection_entries_v" ALTER COLUMN "version_description" SET DATA TYPE jsonb USING NULL;
  ALTER TABLE "posts_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "posts_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "_posts_v_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "_posts_v_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "events_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "events_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "_events_v_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "_events_v_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "news_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "news_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "_news_v_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "_news_v_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "reports_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "reports_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "_reports_v_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "_reports_v_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "resources_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "resources_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "_resources_v_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "_resources_v_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "collection_entries_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "collection_entries_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "collection_entries" ADD COLUMN "show_in_page_nav" boolean DEFAULT true;
  ALTER TABLE "_collection_entries_v_blocks_external_link" ADD COLUMN "title" varchar;
  ALTER TABLE "_collection_entries_v_blocks_external_link" ADD COLUMN "description" varchar;
  ALTER TABLE "_collection_entries_v" ADD COLUMN "version_show_in_page_nav" boolean DEFAULT true;
  ALTER TABLE "posts_blocks_internal_item" ADD CONSTRAINT "posts_blocks_internal_item_item_id_posts_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_internal_item" ADD CONSTRAINT "posts_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_internal_item" ADD CONSTRAINT "_posts_v_blocks_internal_item_item_id_posts_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_internal_item" ADD CONSTRAINT "_posts_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_internal_item" ADD CONSTRAINT "events_blocks_internal_item_item_id_events_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_blocks_internal_item" ADD CONSTRAINT "events_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_internal_item" ADD CONSTRAINT "_events_v_blocks_internal_item_item_id_events_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_internal_item" ADD CONSTRAINT "_events_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_internal_item" ADD CONSTRAINT "news_blocks_internal_item_item_id_news_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_internal_item" ADD CONSTRAINT "news_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_internal_item" ADD CONSTRAINT "_news_v_blocks_internal_item_item_id_news_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_internal_item" ADD CONSTRAINT "_news_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_internal_item" ADD CONSTRAINT "reports_blocks_internal_item_item_id_reports_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_blocks_internal_item" ADD CONSTRAINT "reports_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_internal_item" ADD CONSTRAINT "_reports_v_blocks_internal_item_item_id_reports_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_internal_item" ADD CONSTRAINT "_reports_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_internal_item" ADD CONSTRAINT "resources_blocks_internal_item_item_id_resources_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_blocks_internal_item" ADD CONSTRAINT "resources_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_internal_item" ADD CONSTRAINT "_resources_v_blocks_internal_item_item_id_resources_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_internal_item" ADD CONSTRAINT "_resources_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_internal_item" ADD CONSTRAINT "collection_entries_blocks_internal_item_item_id_collection_entries_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_internal_item" ADD CONSTRAINT "collection_entries_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_internal_item" ADD CONSTRAINT "_collection_entries_v_blocks_internal_item_item_id_collection_entries_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_internal_item" ADD CONSTRAINT "_collection_entries_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_blocks_internal_item_order_idx" ON "posts_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "posts_blocks_internal_item_parent_id_idx" ON "posts_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_internal_item_path_idx" ON "posts_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "posts_blocks_internal_item_item_idx" ON "posts_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_posts_v_blocks_internal_item_order_idx" ON "_posts_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_internal_item_parent_id_idx" ON "_posts_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_internal_item_path_idx" ON "_posts_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_internal_item_item_idx" ON "_posts_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "events_blocks_internal_item_order_idx" ON "events_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "events_blocks_internal_item_parent_id_idx" ON "events_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_internal_item_path_idx" ON "events_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "events_blocks_internal_item_item_idx" ON "events_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_events_v_blocks_internal_item_order_idx" ON "_events_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_internal_item_parent_id_idx" ON "_events_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_internal_item_path_idx" ON "_events_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_internal_item_item_idx" ON "_events_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "news_blocks_internal_item_order_idx" ON "news_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "news_blocks_internal_item_parent_id_idx" ON "news_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_internal_item_path_idx" ON "news_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "news_blocks_internal_item_item_idx" ON "news_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_news_v_blocks_internal_item_order_idx" ON "_news_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_internal_item_parent_id_idx" ON "_news_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_internal_item_path_idx" ON "_news_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_news_v_blocks_internal_item_item_idx" ON "_news_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "reports_blocks_internal_item_order_idx" ON "reports_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "reports_blocks_internal_item_parent_id_idx" ON "reports_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_internal_item_path_idx" ON "reports_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "reports_blocks_internal_item_item_idx" ON "reports_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_reports_v_blocks_internal_item_order_idx" ON "_reports_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_internal_item_parent_id_idx" ON "_reports_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_internal_item_path_idx" ON "_reports_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_reports_v_blocks_internal_item_item_idx" ON "_reports_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "resources_blocks_internal_item_order_idx" ON "resources_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "resources_blocks_internal_item_parent_id_idx" ON "resources_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_internal_item_path_idx" ON "resources_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "resources_blocks_internal_item_item_idx" ON "resources_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_resources_v_blocks_internal_item_order_idx" ON "_resources_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_internal_item_parent_id_idx" ON "_resources_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_internal_item_path_idx" ON "_resources_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_resources_v_blocks_internal_item_item_idx" ON "_resources_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "collection_entries_blocks_internal_item_order_idx" ON "collection_entries_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_internal_item_parent_id_idx" ON "collection_entries_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_internal_item_path_idx" ON "collection_entries_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_internal_item_item_idx" ON "collection_entries_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_order_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_parent_id_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_path_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_item_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("item_id");
  ALTER TABLE "posts_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_posts_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "events_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_events_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "news_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_news_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "reports_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_reports_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "resources_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_resources_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "collection_entries_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_collection_entries_v_blocks_external_link" DROP COLUMN "label";`)
}
