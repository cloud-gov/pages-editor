import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_site_collection_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_home_page_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_site_collection_v_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__home_page_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_home_page_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_page_site_collection_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Welcome to Our Site',
  	"subtitle" varchar DEFAULT 'A modern, accessible website built with the best tools',
  	"description" varchar DEFAULT 'This is a description of what your site offers and why visitors should care.',
  	"bg_image_id" integer,
  	"cta_button_text" varchar DEFAULT 'Get Started',
  	"cta_button_url" varchar DEFAULT '/about',
  	"cta_button_style" "enum_home_page_site_collection_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_site_collection_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_text" varchar DEFAULT 'Learn More'
  );
  
  CREATE TABLE "home_page_site_collection_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_site_collection_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_home_page_site_collection_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_home_page_site_collection_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Welcome to Our Site',
  	"subtitle" varchar DEFAULT 'A modern, accessible website built with the best tools',
  	"description" varchar DEFAULT 'This is a description of what your site offers and why visitors should care.',
  	"bg_image_id" integer,
  	"cta_button_text" varchar DEFAULT 'Get Started',
  	"cta_button_url" varchar DEFAULT '/about',
  	"cta_button_style" "enum__home_page_site_collection_v_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_site_collection_v_blocks_card_grid_cards" (
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
  
  CREATE TABLE "_home_page_site_collection_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_site_collection_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__home_page_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "home_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Welcome to Our Site',
  	"subtitle" varchar DEFAULT 'A modern, accessible website built with the best tools',
  	"description" varchar DEFAULT 'This is a description of what your site offers and why visitors should care.',
  	"bg_image_id" integer,
  	"cta_button_text" varchar DEFAULT 'Get Started',
  	"cta_button_url" varchar DEFAULT '/about',
  	"cta_button_style" "enum_home_page_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_text" varchar DEFAULT 'Learn More'
  );
  
  CREATE TABLE "home_page_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_page_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Welcome to Our Site',
  	"subtitle" varchar DEFAULT 'A modern, accessible website built with the best tools',
  	"description" varchar DEFAULT 'This is a description of what your site offers and why visitors should care.',
  	"bg_image_id" integer,
  	"cta_button_text" varchar DEFAULT 'Get Started',
  	"cta_button_url" varchar DEFAULT '/about',
  	"cta_button_style" "enum__home_page_v_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_card_grid_cards" (
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
  
  CREATE TABLE "_home_page_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "home_page_site_collection_id" integer;
  ALTER TABLE "home_page_site_collection_blocks_hero" ADD CONSTRAINT "home_page_site_collection_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_hero" ADD CONSTRAINT "home_page_site_collection_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_card_grid_cards" ADD CONSTRAINT "home_page_site_collection_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_card_grid_cards" ADD CONSTRAINT "home_page_site_collection_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_site_collection_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_card_grid" ADD CONSTRAINT "home_page_site_collection_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_text_block" ADD CONSTRAINT "home_page_site_collection_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_site_collection" ADD CONSTRAINT "home_page_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_hero" ADD CONSTRAINT "_home_page_site_collection_v_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_hero" ADD CONSTRAINT "_home_page_site_collection_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_card_grid_cards" ADD CONSTRAINT "_home_page_site_collection_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_card_grid_cards" ADD CONSTRAINT "_home_page_site_collection_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_site_collection_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_card_grid" ADD CONSTRAINT "_home_page_site_collection_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_text_block" ADD CONSTRAINT "_home_page_site_collection_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v" ADD CONSTRAINT "_home_page_site_collection_v_parent_id_home_page_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v" ADD CONSTRAINT "_home_page_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_hero" ADD CONSTRAINT "home_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_card_grid_cards" ADD CONSTRAINT "home_page_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_card_grid_cards" ADD CONSTRAINT "home_page_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_card_grid" ADD CONSTRAINT "home_page_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_text_block" ADD CONSTRAINT "home_page_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero" ADD CONSTRAINT "_home_page_v_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_hero" ADD CONSTRAINT "_home_page_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_card_grid_cards" ADD CONSTRAINT "_home_page_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_card_grid_cards" ADD CONSTRAINT "_home_page_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_card_grid" ADD CONSTRAINT "_home_page_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_text_block" ADD CONSTRAINT "_home_page_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_site_collection_blocks_hero_order_idx" ON "home_page_site_collection_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_page_site_collection_blocks_hero_parent_id_idx" ON "home_page_site_collection_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_page_site_collection_blocks_hero_path_idx" ON "home_page_site_collection_blocks_hero" USING btree ("_path");
  CREATE INDEX "home_page_site_collection_blocks_hero_bg_image_idx" ON "home_page_site_collection_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "home_page_site_collection_blocks_card_grid_cards_order_idx" ON "home_page_site_collection_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "home_page_site_collection_blocks_card_grid_cards_parent_id_idx" ON "home_page_site_collection_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_site_collection_blocks_card_grid_cards_image_idx" ON "home_page_site_collection_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "home_page_site_collection_blocks_card_grid_order_idx" ON "home_page_site_collection_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "home_page_site_collection_blocks_card_grid_parent_id_idx" ON "home_page_site_collection_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "home_page_site_collection_blocks_card_grid_path_idx" ON "home_page_site_collection_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "home_page_site_collection_blocks_text_block_order_idx" ON "home_page_site_collection_blocks_text_block" USING btree ("_order");
  CREATE INDEX "home_page_site_collection_blocks_text_block_parent_id_idx" ON "home_page_site_collection_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_site_collection_blocks_text_block_path_idx" ON "home_page_site_collection_blocks_text_block" USING btree ("_path");
  CREATE INDEX "home_page_site_collection_site_idx" ON "home_page_site_collection" USING btree ("site_id");
  CREATE INDEX "home_page_site_collection_updated_at_idx" ON "home_page_site_collection" USING btree ("updated_at");
  CREATE INDEX "home_page_site_collection_created_at_idx" ON "home_page_site_collection" USING btree ("created_at");
  CREATE INDEX "home_page_site_collection__status_idx" ON "home_page_site_collection" USING btree ("_status");
  CREATE INDEX "_home_page_site_collection_v_blocks_hero_order_idx" ON "_home_page_site_collection_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_home_page_site_collection_v_blocks_hero_parent_id_idx" ON "_home_page_site_collection_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_hero_path_idx" ON "_home_page_site_collection_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_home_page_site_collection_v_blocks_hero_bg_image_idx" ON "_home_page_site_collection_v_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_cards_order_idx" ON "_home_page_site_collection_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_cards_parent_id_idx" ON "_home_page_site_collection_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_cards_image_idx" ON "_home_page_site_collection_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_order_idx" ON "_home_page_site_collection_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_parent_id_idx" ON "_home_page_site_collection_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_path_idx" ON "_home_page_site_collection_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_home_page_site_collection_v_blocks_text_block_order_idx" ON "_home_page_site_collection_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_home_page_site_collection_v_blocks_text_block_parent_id_idx" ON "_home_page_site_collection_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_text_block_path_idx" ON "_home_page_site_collection_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_home_page_site_collection_v_parent_idx" ON "_home_page_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_home_page_site_collection_v_version_version_site_idx" ON "_home_page_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_home_page_site_collection_v_version_version_updated_at_idx" ON "_home_page_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_home_page_site_collection_v_version_version_created_at_idx" ON "_home_page_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_home_page_site_collection_v_version_version__status_idx" ON "_home_page_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_home_page_site_collection_v_created_at_idx" ON "_home_page_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_home_page_site_collection_v_updated_at_idx" ON "_home_page_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_site_collection_v_latest_idx" ON "_home_page_site_collection_v" USING btree ("latest");
  CREATE INDEX "_home_page_site_collection_v_autosave_idx" ON "_home_page_site_collection_v" USING btree ("autosave");
  CREATE INDEX "home_page_blocks_hero_order_idx" ON "home_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_page_blocks_hero_parent_id_idx" ON "home_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_hero_path_idx" ON "home_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "home_page_blocks_hero_bg_image_idx" ON "home_page_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "home_page_blocks_card_grid_cards_order_idx" ON "home_page_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "home_page_blocks_card_grid_cards_parent_id_idx" ON "home_page_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_card_grid_cards_image_idx" ON "home_page_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "home_page_blocks_card_grid_order_idx" ON "home_page_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "home_page_blocks_card_grid_parent_id_idx" ON "home_page_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_card_grid_path_idx" ON "home_page_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "home_page_blocks_text_block_order_idx" ON "home_page_blocks_text_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_text_block_parent_id_idx" ON "home_page_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_text_block_path_idx" ON "home_page_blocks_text_block" USING btree ("_path");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "_home_page_v_blocks_hero_order_idx" ON "_home_page_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_hero_parent_id_idx" ON "_home_page_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_hero_path_idx" ON "_home_page_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_hero_bg_image_idx" ON "_home_page_v_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "_home_page_v_blocks_card_grid_cards_order_idx" ON "_home_page_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_card_grid_cards_parent_id_idx" ON "_home_page_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_card_grid_cards_image_idx" ON "_home_page_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_home_page_v_blocks_card_grid_order_idx" ON "_home_page_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_card_grid_parent_id_idx" ON "_home_page_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_card_grid_path_idx" ON "_home_page_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_text_block_order_idx" ON "_home_page_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_text_block_parent_id_idx" ON "_home_page_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_text_block_path_idx" ON "_home_page_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_autosave_idx" ON "_home_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_page_site_collection_fk" FOREIGN KEY ("home_page_site_collection_id") REFERENCES "public"."home_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_home_page_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("home_page_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_site_collection_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_site_collection_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_site_collection_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_site_collection_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_site_collection_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_site_collection_v_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_site_collection_v_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_site_collection_v_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_site_collection_blocks_hero" CASCADE;
  DROP TABLE "home_page_site_collection_blocks_card_grid_cards" CASCADE;
  DROP TABLE "home_page_site_collection_blocks_card_grid" CASCADE;
  DROP TABLE "home_page_site_collection_blocks_text_block" CASCADE;
  DROP TABLE "home_page_site_collection" CASCADE;
  DROP TABLE "_home_page_site_collection_v_blocks_hero" CASCADE;
  DROP TABLE "_home_page_site_collection_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_home_page_site_collection_v_blocks_card_grid" CASCADE;
  DROP TABLE "_home_page_site_collection_v_blocks_text_block" CASCADE;
  DROP TABLE "_home_page_site_collection_v" CASCADE;
  DROP TABLE "home_page_blocks_hero" CASCADE;
  DROP TABLE "home_page_blocks_card_grid_cards" CASCADE;
  DROP TABLE "home_page_blocks_card_grid" CASCADE;
  DROP TABLE "home_page_blocks_text_block" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "_home_page_v_blocks_hero" CASCADE;
  DROP TABLE "_home_page_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_home_page_v_blocks_card_grid" CASCADE;
  DROP TABLE "_home_page_v_blocks_text_block" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_home_page_site_collection_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_home_page_site_collection_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "home_page_site_collection_id";
  DROP TYPE "public"."enum_home_page_site_collection_blocks_hero_cta_button_style";
  DROP TYPE "public"."enum_home_page_site_collection_status";
  DROP TYPE "public"."enum__home_page_site_collection_v_blocks_hero_cta_button_style";
  DROP TYPE "public"."enum__home_page_site_collection_v_version_status";
  DROP TYPE "public"."enum_home_page_blocks_hero_cta_button_style";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_blocks_hero_cta_button_style";
  DROP TYPE "public"."enum__home_page_v_version_status";`)
}
