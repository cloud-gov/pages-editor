import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_collection_entries_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__collection_entries_v_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_cta_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TABLE "collection_entries_blocks_hero" (
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
  	"cta_button_style" "enum_collection_entries_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "_collection_entries_v_blocks_hero" (
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
  	"cta_button_style" "enum__collection_entries_v_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
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
  	"cta_button_style" "enum_pages_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
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
  	"cta_button_style" "enum__pages_v_blocks_hero_cta_button_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_site_collection_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_site_collection_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_page_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_page_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "collection_entries_blocks_hero" ADD CONSTRAINT "collection_entries_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_hero" ADD CONSTRAINT "collection_entries_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_hero" ADD CONSTRAINT "_collection_entries_v_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_hero" ADD CONSTRAINT "_collection_entries_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_rich_text" ADD CONSTRAINT "home_page_site_collection_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_rich_text" ADD CONSTRAINT "_home_page_site_collection_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_blocks_rich_text" ADD CONSTRAINT "home_page_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_rich_text" ADD CONSTRAINT "_home_page_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "collection_entries_blocks_hero_order_idx" ON "collection_entries_blocks_hero" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_hero_parent_id_idx" ON "collection_entries_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_hero_path_idx" ON "collection_entries_blocks_hero" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_hero_bg_image_idx" ON "collection_entries_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "_collection_entries_v_blocks_hero_order_idx" ON "_collection_entries_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_hero_parent_id_idx" ON "_collection_entries_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_hero_path_idx" ON "_collection_entries_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_hero_bg_image_idx" ON "_collection_entries_v_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_bg_image_idx" ON "pages_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_bg_image_idx" ON "_pages_v_blocks_hero" USING btree ("bg_image_id");
  CREATE INDEX "home_page_site_collection_blocks_rich_text_order_idx" ON "home_page_site_collection_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "home_page_site_collection_blocks_rich_text_parent_id_idx" ON "home_page_site_collection_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "home_page_site_collection_blocks_rich_text_path_idx" ON "home_page_site_collection_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_home_page_site_collection_v_blocks_rich_text_order_idx" ON "_home_page_site_collection_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_home_page_site_collection_v_blocks_rich_text_parent_id_idx" ON "_home_page_site_collection_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_rich_text_path_idx" ON "_home_page_site_collection_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "home_page_blocks_rich_text_order_idx" ON "home_page_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "home_page_blocks_rich_text_parent_id_idx" ON "home_page_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_rich_text_path_idx" ON "home_page_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_rich_text_order_idx" ON "_home_page_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_rich_text_parent_id_idx" ON "_home_page_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_rich_text_path_idx" ON "_home_page_v_blocks_rich_text" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "collection_entries_blocks_hero" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "home_page_site_collection_blocks_rich_text" CASCADE;
  DROP TABLE "_home_page_site_collection_v_blocks_rich_text" CASCADE;
  DROP TABLE "home_page_blocks_rich_text" CASCADE;
  DROP TABLE "_home_page_v_blocks_rich_text" CASCADE;
  DROP TYPE "public"."enum_collection_entries_blocks_hero_cta_button_style";
  DROP TYPE "public"."enum__collection_entries_v_blocks_hero_cta_button_style";
  DROP TYPE "public"."enum_pages_blocks_hero_cta_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_cta_button_style";`)
}
