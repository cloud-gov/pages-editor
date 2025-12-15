import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  CREATE INDEX "_custom_collection_pages_v_blocks_external_link_path_idx" ON "_custom_collection_pages_v_blocks_external_link" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts_blocks_internal_item" CASCADE;
  DROP TABLE "posts_blocks_external_link" CASCADE;
  DROP TABLE "_posts_v_blocks_internal_item" CASCADE;
  DROP TABLE "_posts_v_blocks_external_link" CASCADE;
  DROP TABLE "events_blocks_internal_item" CASCADE;
  DROP TABLE "events_blocks_external_link" CASCADE;
  DROP TABLE "_events_v_blocks_internal_item" CASCADE;
  DROP TABLE "_events_v_blocks_external_link" CASCADE;
  DROP TABLE "news_blocks_internal_item" CASCADE;
  DROP TABLE "news_blocks_external_link" CASCADE;
  DROP TABLE "_news_v_blocks_internal_item" CASCADE;
  DROP TABLE "_news_v_blocks_external_link" CASCADE;
  DROP TABLE "reports_blocks_internal_item" CASCADE;
  DROP TABLE "reports_blocks_external_link" CASCADE;
  DROP TABLE "_reports_v_blocks_internal_item" CASCADE;
  DROP TABLE "_reports_v_blocks_external_link" CASCADE;
  DROP TABLE "resources_blocks_internal_item" CASCADE;
  DROP TABLE "resources_blocks_external_link" CASCADE;
  DROP TABLE "_resources_v_blocks_internal_item" CASCADE;
  DROP TABLE "_resources_v_blocks_external_link" CASCADE;
  DROP TABLE "custom_collection_pages_blocks_internal_item" CASCADE;
  DROP TABLE "custom_collection_pages_blocks_external_link" CASCADE;
  DROP TABLE "_custom_collection_pages_v_blocks_internal_item" CASCADE;
  DROP TABLE "_custom_collection_pages_v_blocks_external_link" CASCADE;`)
}
