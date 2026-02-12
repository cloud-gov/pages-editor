import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_collection_types_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__collection_types_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_collection_entries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__collection_entries_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "collection_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"description" varchar,
  	"image_id" integer,
  	"updated_by_id" integer,
  	"site_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_collection_types_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_collection_types_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_updated_by_id" integer,
  	"version_site_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__collection_types_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "collection_entries_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "collection_entries_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "collection_entries_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_text" varchar DEFAULT 'Learn More'
  );
  
  CREATE TABLE "collection_entries_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"block_name" varchar
  );
  
  CREATE TABLE "collection_entries_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"bg_image_id" integer,
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
  
  CREATE TABLE "collection_entries_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "collection_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_type_id" integer,
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"content_date" timestamp(3) with time zone,
  	"site_id" integer,
  	"updated_by_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"show_in_page_nav" boolean DEFAULT true,
  	"review_ready" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_collection_entries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "collection_entries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_collection_entries_v_version_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_text" varchar DEFAULT 'Learn More',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"bg_image_id" integer,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_collection_entries_v_blocks_external_link" (
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
  
  CREATE TABLE "_collection_entries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_collection_type_id" integer,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_content_date" timestamp(3) with time zone,
  	"version_site_id" integer,
  	"version_updated_by_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_show_in_page_nav" boolean DEFAULT true,
  	"version_review_ready" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__collection_entries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_collection_entries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "collection_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "collection_entries_id" integer;
  ALTER TABLE "collection_types" ADD CONSTRAINT "collection_types_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_types" ADD CONSTRAINT "collection_types_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_types" ADD CONSTRAINT "collection_types_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_types_v" ADD CONSTRAINT "_collection_types_v_parent_id_collection_types_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_types_v" ADD CONSTRAINT "_collection_types_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_types_v" ADD CONSTRAINT "_collection_types_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_types_v" ADD CONSTRAINT "_collection_types_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_files" ADD CONSTRAINT "collection_entries_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_files" ADD CONSTRAINT "collection_entries_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_rich_text" ADD CONSTRAINT "collection_entries_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_card_grid_cards" ADD CONSTRAINT "collection_entries_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_card_grid_cards" ADD CONSTRAINT "collection_entries_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_card_grid" ADD CONSTRAINT "collection_entries_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_text_block" ADD CONSTRAINT "collection_entries_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_text_block" ADD CONSTRAINT "collection_entries_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_internal_item" ADD CONSTRAINT "collection_entries_blocks_internal_item_item_id_collection_entries_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_internal_item" ADD CONSTRAINT "collection_entries_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_external_link" ADD CONSTRAINT "collection_entries_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries" ADD CONSTRAINT "collection_entries_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries" ADD CONSTRAINT "collection_entries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries" ADD CONSTRAINT "collection_entries_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries" ADD CONSTRAINT "collection_entries_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_rels" ADD CONSTRAINT "collection_entries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_entries_rels" ADD CONSTRAINT "collection_entries_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_version_files" ADD CONSTRAINT "_collection_entries_v_version_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_version_files" ADD CONSTRAINT "_collection_entries_v_version_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_rich_text" ADD CONSTRAINT "_collection_entries_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_card_grid_cards" ADD CONSTRAINT "_collection_entries_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_card_grid_cards" ADD CONSTRAINT "_collection_entries_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_card_grid" ADD CONSTRAINT "_collection_entries_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_text_block" ADD CONSTRAINT "_collection_entries_v_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_text_block" ADD CONSTRAINT "_collection_entries_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_internal_item" ADD CONSTRAINT "_collection_entries_v_blocks_internal_item_item_id_collection_entries_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_internal_item" ADD CONSTRAINT "_collection_entries_v_blocks_internal_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_external_link" ADD CONSTRAINT "_collection_entries_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v" ADD CONSTRAINT "_collection_entries_v_parent_id_collection_entries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v" ADD CONSTRAINT "_collection_entries_v_version_collection_type_id_collection_types_id_fk" FOREIGN KEY ("version_collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v" ADD CONSTRAINT "_collection_entries_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v" ADD CONSTRAINT "_collection_entries_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v" ADD CONSTRAINT "_collection_entries_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_rels" ADD CONSTRAINT "_collection_entries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_rels" ADD CONSTRAINT "_collection_entries_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "collection_types_slug_idx" ON "collection_types" USING btree ("slug");
  CREATE INDEX "collection_types_image_idx" ON "collection_types" USING btree ("image_id");
  CREATE INDEX "collection_types_updated_by_idx" ON "collection_types" USING btree ("updated_by_id");
  CREATE INDEX "collection_types_site_idx" ON "collection_types" USING btree ("site_id");
  CREATE INDEX "collection_types_updated_at_idx" ON "collection_types" USING btree ("updated_at");
  CREATE INDEX "collection_types_created_at_idx" ON "collection_types" USING btree ("created_at");
  CREATE INDEX "collection_types__status_idx" ON "collection_types" USING btree ("_status");
  CREATE INDEX "_collection_types_v_parent_idx" ON "_collection_types_v" USING btree ("parent_id");
  CREATE INDEX "_collection_types_v_version_version_slug_idx" ON "_collection_types_v" USING btree ("version_slug");
  CREATE INDEX "_collection_types_v_version_version_image_idx" ON "_collection_types_v" USING btree ("version_image_id");
  CREATE INDEX "_collection_types_v_version_version_updated_by_idx" ON "_collection_types_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_collection_types_v_version_version_site_idx" ON "_collection_types_v" USING btree ("version_site_id");
  CREATE INDEX "_collection_types_v_version_version_updated_at_idx" ON "_collection_types_v" USING btree ("version_updated_at");
  CREATE INDEX "_collection_types_v_version_version_created_at_idx" ON "_collection_types_v" USING btree ("version_created_at");
  CREATE INDEX "_collection_types_v_version_version__status_idx" ON "_collection_types_v" USING btree ("version__status");
  CREATE INDEX "_collection_types_v_created_at_idx" ON "_collection_types_v" USING btree ("created_at");
  CREATE INDEX "_collection_types_v_updated_at_idx" ON "_collection_types_v" USING btree ("updated_at");
  CREATE INDEX "_collection_types_v_latest_idx" ON "_collection_types_v" USING btree ("latest");
  CREATE INDEX "_collection_types_v_autosave_idx" ON "_collection_types_v" USING btree ("autosave");
  CREATE INDEX "collection_entries_files_order_idx" ON "collection_entries_files" USING btree ("_order");
  CREATE INDEX "collection_entries_files_parent_id_idx" ON "collection_entries_files" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_files_file_idx" ON "collection_entries_files" USING btree ("file_id");
  CREATE INDEX "collection_entries_blocks_rich_text_order_idx" ON "collection_entries_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_rich_text_parent_id_idx" ON "collection_entries_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_rich_text_path_idx" ON "collection_entries_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_card_grid_cards_order_idx" ON "collection_entries_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_card_grid_cards_parent_id_idx" ON "collection_entries_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_card_grid_cards_image_idx" ON "collection_entries_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "collection_entries_blocks_card_grid_order_idx" ON "collection_entries_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_card_grid_parent_id_idx" ON "collection_entries_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_card_grid_path_idx" ON "collection_entries_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_text_block_order_idx" ON "collection_entries_blocks_text_block" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_text_block_parent_id_idx" ON "collection_entries_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_text_block_path_idx" ON "collection_entries_blocks_text_block" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_text_block_bg_image_idx" ON "collection_entries_blocks_text_block" USING btree ("bg_image_id");
  CREATE INDEX "collection_entries_blocks_internal_item_order_idx" ON "collection_entries_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_internal_item_parent_id_idx" ON "collection_entries_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_internal_item_path_idx" ON "collection_entries_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_internal_item_item_idx" ON "collection_entries_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "collection_entries_blocks_external_link_order_idx" ON "collection_entries_blocks_external_link" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_external_link_parent_id_idx" ON "collection_entries_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_external_link_path_idx" ON "collection_entries_blocks_external_link" USING btree ("_path");
  CREATE INDEX "collection_entries_collection_type_idx" ON "collection_entries" USING btree ("collection_type_id");
  CREATE INDEX "collection_entries_image_idx" ON "collection_entries" USING btree ("image_id");
  CREATE INDEX "collection_entries_slug_idx" ON "collection_entries" USING btree ("slug");
  CREATE INDEX "collection_entries_site_idx" ON "collection_entries" USING btree ("site_id");
  CREATE INDEX "collection_entries_updated_by_idx" ON "collection_entries" USING btree ("updated_by_id");
  CREATE INDEX "collection_entries_updated_at_idx" ON "collection_entries" USING btree ("updated_at");
  CREATE INDEX "collection_entries_created_at_idx" ON "collection_entries" USING btree ("created_at");
  CREATE INDEX "collection_entries__status_idx" ON "collection_entries" USING btree ("_status");
  CREATE INDEX "collection_entries_rels_order_idx" ON "collection_entries_rels" USING btree ("order");
  CREATE INDEX "collection_entries_rels_parent_idx" ON "collection_entries_rels" USING btree ("parent_id");
  CREATE INDEX "collection_entries_rels_path_idx" ON "collection_entries_rels" USING btree ("path");
  CREATE INDEX "collection_entries_rels_tags_id_idx" ON "collection_entries_rels" USING btree ("tags_id");
  CREATE INDEX "_collection_entries_v_version_files_order_idx" ON "_collection_entries_v_version_files" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_version_files_parent_id_idx" ON "_collection_entries_v_version_files" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_version_files_file_idx" ON "_collection_entries_v_version_files" USING btree ("file_id");
  CREATE INDEX "_collection_entries_v_blocks_rich_text_order_idx" ON "_collection_entries_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_rich_text_parent_id_idx" ON "_collection_entries_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_rich_text_path_idx" ON "_collection_entries_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_card_grid_cards_order_idx" ON "_collection_entries_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_card_grid_cards_parent_id_idx" ON "_collection_entries_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_card_grid_cards_image_idx" ON "_collection_entries_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_collection_entries_v_blocks_card_grid_order_idx" ON "_collection_entries_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_card_grid_parent_id_idx" ON "_collection_entries_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_card_grid_path_idx" ON "_collection_entries_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_text_block_order_idx" ON "_collection_entries_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_text_block_parent_id_idx" ON "_collection_entries_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_text_block_path_idx" ON "_collection_entries_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_text_block_bg_image_idx" ON "_collection_entries_v_blocks_text_block" USING btree ("bg_image_id");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_order_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_parent_id_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_path_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_internal_item_item_idx" ON "_collection_entries_v_blocks_internal_item" USING btree ("item_id");
  CREATE INDEX "_collection_entries_v_blocks_external_link_order_idx" ON "_collection_entries_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_external_link_parent_id_idx" ON "_collection_entries_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_external_link_path_idx" ON "_collection_entries_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_parent_idx" ON "_collection_entries_v" USING btree ("parent_id");
  CREATE INDEX "_collection_entries_v_version_version_collection_type_idx" ON "_collection_entries_v" USING btree ("version_collection_type_id");
  CREATE INDEX "_collection_entries_v_version_version_image_idx" ON "_collection_entries_v" USING btree ("version_image_id");
  CREATE INDEX "_collection_entries_v_version_version_slug_idx" ON "_collection_entries_v" USING btree ("version_slug");
  CREATE INDEX "_collection_entries_v_version_version_site_idx" ON "_collection_entries_v" USING btree ("version_site_id");
  CREATE INDEX "_collection_entries_v_version_version_updated_by_idx" ON "_collection_entries_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_collection_entries_v_version_version_updated_at_idx" ON "_collection_entries_v" USING btree ("version_updated_at");
  CREATE INDEX "_collection_entries_v_version_version_created_at_idx" ON "_collection_entries_v" USING btree ("version_created_at");
  CREATE INDEX "_collection_entries_v_version_version__status_idx" ON "_collection_entries_v" USING btree ("version__status");
  CREATE INDEX "_collection_entries_v_created_at_idx" ON "_collection_entries_v" USING btree ("created_at");
  CREATE INDEX "_collection_entries_v_updated_at_idx" ON "_collection_entries_v" USING btree ("updated_at");
  CREATE INDEX "_collection_entries_v_latest_idx" ON "_collection_entries_v" USING btree ("latest");
  CREATE INDEX "_collection_entries_v_autosave_idx" ON "_collection_entries_v" USING btree ("autosave");
  CREATE INDEX "_collection_entries_v_rels_order_idx" ON "_collection_entries_v_rels" USING btree ("order");
  CREATE INDEX "_collection_entries_v_rels_parent_idx" ON "_collection_entries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_collection_entries_v_rels_path_idx" ON "_collection_entries_v_rels" USING btree ("path");
  CREATE INDEX "_collection_entries_v_rels_tags_id_idx" ON "_collection_entries_v_rels" USING btree ("tags_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collection_types_fk" FOREIGN KEY ("collection_types_id") REFERENCES "public"."collection_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collection_entries_fk" FOREIGN KEY ("collection_entries_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_collection_types_id_idx" ON "payload_locked_documents_rels" USING btree ("collection_types_id");
  CREATE INDEX "payload_locked_documents_rels_collection_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("collection_entries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_types_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_entries_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_version_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_internal_item" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "collection_types" CASCADE;
  DROP TABLE "_collection_types_v" CASCADE;
  DROP TABLE "collection_entries_files" CASCADE;
  DROP TABLE "collection_entries_blocks_rich_text" CASCADE;
  DROP TABLE "collection_entries_blocks_card_grid_cards" CASCADE;
  DROP TABLE "collection_entries_blocks_card_grid" CASCADE;
  DROP TABLE "collection_entries_blocks_text_block" CASCADE;
  DROP TABLE "collection_entries_blocks_internal_item" CASCADE;
  DROP TABLE "collection_entries_blocks_external_link" CASCADE;
  DROP TABLE "collection_entries" CASCADE;
  DROP TABLE "collection_entries_rels" CASCADE;
  DROP TABLE "_collection_entries_v_version_files" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_rich_text" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_card_grid" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_text_block" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_internal_item" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_external_link" CASCADE;
  DROP TABLE "_collection_entries_v" CASCADE;
  DROP TABLE "_collection_entries_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_collection_types_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_collection_entries_fk";
  
  DROP INDEX "payload_locked_documents_rels_collection_types_id_idx";
  DROP INDEX "payload_locked_documents_rels_collection_entries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "collection_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "collection_entries_id";
  DROP TYPE "public"."enum_collection_types_status";
  DROP TYPE "public"."enum__collection_types_v_version_status";
  DROP TYPE "public"."enum_collection_entries_status";
  DROP TYPE "public"."enum__collection_entries_v_version_status";`)
}
