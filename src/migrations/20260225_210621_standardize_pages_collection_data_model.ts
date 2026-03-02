import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_text" varchar DEFAULT 'Learn More'
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"bg_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_cards" (
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
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Featured Content',
  	"description" varchar DEFAULT 'Discover our latest updates and important information.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_text_block" (
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
  
  CREATE TABLE "_pages_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_side_navigation_id_side_navigation_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_side_navigation_id_side_navigation_id_fk";
  
  DROP INDEX "pages_side_navigation_idx";
  DROP INDEX "_pages_v_version_version_side_navigation_idx";
  ALTER TABLE "pages" ADD COLUMN "content_date" timestamp(3) with time zone;
  ALTER TABLE "pages" ADD COLUMN "description" varchar;
  ALTER TABLE "pages" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_content_date" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_block" ADD CONSTRAINT "pages_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_block" ADD CONSTRAINT "pages_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_link" ADD CONSTRAINT "pages_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_link" ADD CONSTRAINT "pages_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_collection_entry_link" ADD CONSTRAINT "pages_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_collection_entry_link" ADD CONSTRAINT "pages_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_external_link" ADD CONSTRAINT "pages_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_block" ADD CONSTRAINT "_pages_v_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text_block" ADD CONSTRAINT "_pages_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_link" ADD CONSTRAINT "_pages_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_link" ADD CONSTRAINT "_pages_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_collection_entry_link" ADD CONSTRAINT "_pages_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_collection_entry_link" ADD CONSTRAINT "_pages_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_external_link" ADD CONSTRAINT "_pages_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_cards_image_idx" ON "pages_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_block_order_idx" ON "pages_blocks_text_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_block_parent_id_idx" ON "pages_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_block_path_idx" ON "pages_blocks_text_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_block_bg_image_idx" ON "pages_blocks_text_block" USING btree ("bg_image_id");
  CREATE INDEX "pages_blocks_page_link_order_idx" ON "pages_blocks_page_link" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_link_parent_id_idx" ON "pages_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_link_path_idx" ON "pages_blocks_page_link" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_link_page_idx" ON "pages_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "pages_blocks_collection_entry_link_order_idx" ON "pages_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "pages_blocks_collection_entry_link_parent_id_idx" ON "pages_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_collection_entry_link_path_idx" ON "pages_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "pages_blocks_collection_entry_link_collection_entry_idx" ON "pages_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "pages_blocks_external_link_order_idx" ON "pages_blocks_external_link" USING btree ("_order");
  CREATE INDEX "pages_blocks_external_link_parent_id_idx" ON "pages_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_external_link_path_idx" ON "pages_blocks_external_link" USING btree ("_path");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_tags_id_idx" ON "pages_rels" USING btree ("tags_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_order_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_image_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_text_block_order_idx" ON "_pages_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_block_parent_id_idx" ON "_pages_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_block_path_idx" ON "_pages_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_text_block_bg_image_idx" ON "_pages_v_blocks_text_block" USING btree ("bg_image_id");
  CREATE INDEX "_pages_v_blocks_page_link_order_idx" ON "_pages_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_link_parent_id_idx" ON "_pages_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_link_path_idx" ON "_pages_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_link_page_idx" ON "_pages_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_pages_v_blocks_collection_entry_link_order_idx" ON "_pages_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_collection_entry_link_parent_id_idx" ON "_pages_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_collection_entry_link_path_idx" ON "_pages_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_collection_entry_link_collection_entry_idx" ON "_pages_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_pages_v_blocks_external_link_order_idx" ON "_pages_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_external_link_parent_id_idx" ON "_pages_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_external_link_path_idx" ON "_pages_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_tags_id_idx" ON "_pages_v_rels" USING btree ("tags_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_updated_by_idx" ON "pages" USING btree ("updated_by_id");
  CREATE INDEX "_pages_v_version_version_updated_by_idx" ON "_pages_v" USING btree ("version_updated_by_id");
  ALTER TABLE "pages" DROP COLUMN "content";
  ALTER TABLE "pages" DROP COLUMN "side_navigation_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_content";
  ALTER TABLE "_pages_v" DROP COLUMN "version_side_navigation_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "pages_blocks_text_block" CASCADE;
  DROP TABLE "pages_blocks_page_link" CASCADE;
  DROP TABLE "pages_blocks_collection_entry_link" CASCADE;
  DROP TABLE "pages_blocks_external_link" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_page_link" CASCADE;
  DROP TABLE "_pages_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_pages_v_blocks_external_link" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_updated_by_id_users_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_updated_by_id_users_id_fk";
  
  DROP INDEX "pages_updated_by_idx";
  DROP INDEX "_pages_v_version_version_updated_by_idx";
  ALTER TABLE "pages" ADD COLUMN "content" jsonb;
  ALTER TABLE "pages" ADD COLUMN "side_navigation_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_side_navigation_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("version_side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_side_navigation_idx" ON "pages" USING btree ("side_navigation_id");
  CREATE INDEX "_pages_v_version_version_side_navigation_idx" ON "_pages_v" USING btree ("version_side_navigation_id");
  ALTER TABLE "pages" DROP COLUMN "content_date";
  ALTER TABLE "pages" DROP COLUMN "description";
  ALTER TABLE "pages" DROP COLUMN "updated_by_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_content_date";
  ALTER TABLE "_pages_v" DROP COLUMN "version_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_updated_by_id";`)
}
