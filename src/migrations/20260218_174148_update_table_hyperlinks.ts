import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "side_navigation_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_site_collection_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_site_collection_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_site_collection_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_site_collection_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_site_collection_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_site_collection_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_site_collection_v_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_site_collection_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_site_collection_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_site_collection_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_site_collection_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_site_collection_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_site_collection_v_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_site_collection_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_v_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_v_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_collection_type_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_type_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_collection_entry_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"collection_entry_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "side_navigation_blocks_page_link_2" CASCADE;
  DROP TABLE "side_navigation_blocks_collection_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_page_link_2" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_collection_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_custom_collection_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_slim_page_link" CASCADE;
  DROP TABLE "pre_footer_slim_collection_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_slim_external_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" CASCADE;
  DROP TABLE "_pre_footer_slim_collection_link_v" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_slim_external_link" CASCADE;
  DROP TABLE "menu_blocks_collection_link" CASCADE;
  DROP TABLE "menu_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_menu_v_blocks_collection_link" CASCADE;
  DROP TABLE "_menu_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "footer_blocks_collection_link" CASCADE;
  DROP TABLE "footer_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_footer_v_blocks_collection_link" CASCADE;
  DROP TABLE "_footer_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "pre_footer_blocks_collection_link" CASCADE;
  DROP TABLE "pre_footer_blocks_custom_collection_link" CASCADE;
  DROP TABLE "pre_footer_blocks_slim_page_link" CASCADE;
  DROP TABLE "pre_footer_blocks_slim_external_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_collection_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_slim_page_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_slim_external_link" CASCADE;
  ALTER TABLE "footer_site_collection_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "footer_site_collection_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_footer_site_collection_v_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_footer_site_collection_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "pre_footer_site_collection_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "pre_footer_site_collection_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "footer_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "footer_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_footer_v_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_footer_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "pre_footer_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "pre_footer_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_pre_footer_v_blocks_page_link" ADD COLUMN "label" varchar;
  ALTER TABLE "_pre_footer_v_blocks_external_link" ADD COLUMN "label" varchar;
  ALTER TABLE "side_navigation_blocks_link" ADD CONSTRAINT "side_navigation_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_collection_type_link" ADD CONSTRAINT "side_navigation_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_collection_type_link" ADD CONSTRAINT "side_navigation_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_collection_entry_link" ADD CONSTRAINT "side_navigation_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_collection_entry_link" ADD CONSTRAINT "side_navigation_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_link" ADD CONSTRAINT "_side_navigation_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_collection_type_link" ADD CONSTRAINT "_side_navigation_v_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_collection_type_link" ADD CONSTRAINT "_side_navigation_v_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_collection_entry_link" ADD CONSTRAINT "_side_navigation_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_collection_entry_link" ADD CONSTRAINT "_side_navigation_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_link" ADD CONSTRAINT "menu_site_collection_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_external_link" ADD CONSTRAINT "menu_site_collection_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_collection_type_link" ADD CONSTRAINT "menu_site_collection_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_collection_type_link" ADD CONSTRAINT "menu_site_collection_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_collection_entry_link" ADD CONSTRAINT "menu_site_collection_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_collection_entry_link" ADD CONSTRAINT "menu_site_collection_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_external_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_collection_type_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_collection_type_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_collection_entry_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_collection_entry_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_link" ADD CONSTRAINT "footer_site_collection_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_collection_type_link" ADD CONSTRAINT "footer_site_collection_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_collection_type_link" ADD CONSTRAINT "footer_site_collection_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_collection_entry_link" ADD CONSTRAINT "footer_site_collection_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_collection_entry_link" ADD CONSTRAINT "footer_site_collection_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_collection_type_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_collection_type_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_collection_entry_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_collection_entry_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_collection_type_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_collection_type_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_collection_entry_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_collection_entry_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_collection_type_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_collection_type_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_collection_entry_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_collection_entry_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_link" ADD CONSTRAINT "menu_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_external_link" ADD CONSTRAINT "menu_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_type_link" ADD CONSTRAINT "menu_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_type_link" ADD CONSTRAINT "menu_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_entry_link" ADD CONSTRAINT "menu_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_entry_link" ADD CONSTRAINT "menu_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_link" ADD CONSTRAINT "_menu_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_external_link" ADD CONSTRAINT "_menu_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_collection_type_link" ADD CONSTRAINT "_menu_v_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_collection_type_link" ADD CONSTRAINT "_menu_v_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_collection_entry_link" ADD CONSTRAINT "_menu_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_collection_entry_link" ADD CONSTRAINT "_menu_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_link" ADD CONSTRAINT "footer_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_collection_type_link" ADD CONSTRAINT "footer_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_blocks_collection_type_link" ADD CONSTRAINT "footer_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_collection_entry_link" ADD CONSTRAINT "footer_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_blocks_collection_entry_link" ADD CONSTRAINT "footer_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_link" ADD CONSTRAINT "_footer_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_collection_type_link" ADD CONSTRAINT "_footer_v_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_collection_type_link" ADD CONSTRAINT "_footer_v_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_collection_entry_link" ADD CONSTRAINT "_footer_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_collection_entry_link" ADD CONSTRAINT "_footer_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_link" ADD CONSTRAINT "pre_footer_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_collection_type_link" ADD CONSTRAINT "pre_footer_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_collection_type_link" ADD CONSTRAINT "pre_footer_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_collection_entry_link" ADD CONSTRAINT "pre_footer_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_collection_entry_link" ADD CONSTRAINT "pre_footer_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_link" ADD CONSTRAINT "_pre_footer_v_blocks_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_collection_type_link" ADD CONSTRAINT "_pre_footer_v_blocks_collection_type_link_collection_type_id_collection_types_id_fk" FOREIGN KEY ("collection_type_id") REFERENCES "public"."collection_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_collection_type_link" ADD CONSTRAINT "_pre_footer_v_blocks_collection_type_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_collection_entry_link" ADD CONSTRAINT "_pre_footer_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_collection_entry_link" ADD CONSTRAINT "_pre_footer_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "side_navigation_blocks_link_order_idx" ON "side_navigation_blocks_link" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_link_parent_id_idx" ON "side_navigation_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_link_path_idx" ON "side_navigation_blocks_link" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_collection_type_link_order_idx" ON "side_navigation_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_collection_type_link_parent_id_idx" ON "side_navigation_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_collection_type_link_path_idx" ON "side_navigation_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_collection_type_link_collection_t_idx" ON "side_navigation_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "side_navigation_blocks_collection_entry_link_order_idx" ON "side_navigation_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_collection_entry_link_parent_id_idx" ON "side_navigation_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_collection_entry_link_path_idx" ON "side_navigation_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_collection_entry_link_collection__idx" ON "side_navigation_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_side_navigation_v_blocks_link_order_idx" ON "_side_navigation_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_link_parent_id_idx" ON "_side_navigation_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_link_path_idx" ON "_side_navigation_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_collection_type_link_order_idx" ON "_side_navigation_v_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_collection_type_link_parent_id_idx" ON "_side_navigation_v_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_collection_type_link_path_idx" ON "_side_navigation_v_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_collection_type_link_collectio_idx" ON "_side_navigation_v_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "_side_navigation_v_blocks_collection_entry_link_order_idx" ON "_side_navigation_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_collection_entry_link_parent_id_idx" ON "_side_navigation_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_collection_entry_link_path_idx" ON "_side_navigation_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_collection_entry_link_collecti_idx" ON "_side_navigation_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "menu_site_collection_blocks_link_order_idx" ON "menu_site_collection_blocks_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_link_parent_id_idx" ON "menu_site_collection_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_link_path_idx" ON "menu_site_collection_blocks_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_external_link_order_idx" ON "menu_site_collection_blocks_external_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_external_link_parent_id_idx" ON "menu_site_collection_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_external_link_path_idx" ON "menu_site_collection_blocks_external_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_collection_type_link_order_idx" ON "menu_site_collection_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_collection_type_link_parent_id_idx" ON "menu_site_collection_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_collection_type_link_path_idx" ON "menu_site_collection_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_collection_type_link_collect_idx" ON "menu_site_collection_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "menu_site_collection_blocks_collection_entry_link_order_idx" ON "menu_site_collection_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_collection_entry_link_parent_id_idx" ON "menu_site_collection_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_collection_entry_link_path_idx" ON "menu_site_collection_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_collection_entry_link_collec_idx" ON "menu_site_collection_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_menu_site_collection_v_blocks_link_order_idx" ON "_menu_site_collection_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_link_parent_id_idx" ON "_menu_site_collection_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_link_path_idx" ON "_menu_site_collection_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_external_link_order_idx" ON "_menu_site_collection_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_external_link_parent_id_idx" ON "_menu_site_collection_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_external_link_path_idx" ON "_menu_site_collection_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_type_link_order_idx" ON "_menu_site_collection_v_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_type_link_parent_id_idx" ON "_menu_site_collection_v_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_type_link_path_idx" ON "_menu_site_collection_v_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_type_link_coll_idx" ON "_menu_site_collection_v_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_entry_link_order_idx" ON "_menu_site_collection_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_entry_link_parent_id_idx" ON "_menu_site_collection_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_entry_link_path_idx" ON "_menu_site_collection_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_entry_link_col_idx" ON "_menu_site_collection_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "footer_site_collection_blocks_link_order_idx" ON "footer_site_collection_blocks_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_link_parent_id_idx" ON "footer_site_collection_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_link_path_idx" ON "footer_site_collection_blocks_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_collection_type_link_order_idx" ON "footer_site_collection_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_collection_type_link_parent_id_idx" ON "footer_site_collection_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_collection_type_link_path_idx" ON "footer_site_collection_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_collection_type_link_colle_idx" ON "footer_site_collection_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "footer_site_collection_blocks_collection_entry_link_order_idx" ON "footer_site_collection_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_collection_entry_link_parent_id_idx" ON "footer_site_collection_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_collection_entry_link_path_idx" ON "footer_site_collection_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_collection_entry_link_coll_idx" ON "footer_site_collection_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_footer_site_collection_v_blocks_link_order_idx" ON "_footer_site_collection_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_link_parent_id_idx" ON "_footer_site_collection_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_link_path_idx" ON "_footer_site_collection_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_type_link_order_idx" ON "_footer_site_collection_v_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_type_link_parent_id_idx" ON "_footer_site_collection_v_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_type_link_path_idx" ON "_footer_site_collection_v_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_type_link_co_idx" ON "_footer_site_collection_v_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_entry_link_order_idx" ON "_footer_site_collection_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_entry_link_parent_id_idx" ON "_footer_site_collection_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_entry_link_path_idx" ON "_footer_site_collection_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_entry_link_c_idx" ON "_footer_site_collection_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "pre_footer_site_collection_blocks_link_order_idx" ON "pre_footer_site_collection_blocks_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_link_parent_id_idx" ON "pre_footer_site_collection_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_link_path_idx" ON "pre_footer_site_collection_blocks_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_type_link_order_idx" ON "pre_footer_site_collection_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_type_link_parent_id_idx" ON "pre_footer_site_collection_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_type_link_path_idx" ON "pre_footer_site_collection_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_type_link_c_idx" ON "pre_footer_site_collection_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_entry_link_order_idx" ON "pre_footer_site_collection_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_entry_link_parent_id_idx" ON "pre_footer_site_collection_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_entry_link_path_idx" ON "pre_footer_site_collection_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_entry_link__idx" ON "pre_footer_site_collection_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_link_order_idx" ON "_pre_footer_site_collection_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_link_path_idx" ON "_pre_footer_site_collection_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_type_link_order_idx" ON "_pre_footer_site_collection_v_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_type_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_type_link_path_idx" ON "_pre_footer_site_collection_v_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_type_lin_idx" ON "_pre_footer_site_collection_v_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_entry_link_order_idx" ON "_pre_footer_site_collection_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_entry_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_entry_link_path_idx" ON "_pre_footer_site_collection_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_entry_li_idx" ON "_pre_footer_site_collection_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "menu_blocks_link_order_idx" ON "menu_blocks_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_link_parent_id_idx" ON "menu_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_link_path_idx" ON "menu_blocks_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_external_link_order_idx" ON "menu_blocks_external_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_external_link_parent_id_idx" ON "menu_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_external_link_path_idx" ON "menu_blocks_external_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_collection_type_link_order_idx" ON "menu_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_collection_type_link_parent_id_idx" ON "menu_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_collection_type_link_path_idx" ON "menu_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_collection_type_link_collection_type_idx" ON "menu_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "menu_blocks_collection_entry_link_order_idx" ON "menu_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_collection_entry_link_parent_id_idx" ON "menu_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_collection_entry_link_path_idx" ON "menu_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_collection_entry_link_collection_entry_idx" ON "menu_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_menu_v_blocks_link_order_idx" ON "_menu_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_link_parent_id_idx" ON "_menu_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_link_path_idx" ON "_menu_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_external_link_order_idx" ON "_menu_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_external_link_parent_id_idx" ON "_menu_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_external_link_path_idx" ON "_menu_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_collection_type_link_order_idx" ON "_menu_v_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_collection_type_link_parent_id_idx" ON "_menu_v_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_collection_type_link_path_idx" ON "_menu_v_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_collection_type_link_collection_type_idx" ON "_menu_v_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "_menu_v_blocks_collection_entry_link_order_idx" ON "_menu_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_collection_entry_link_parent_id_idx" ON "_menu_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_collection_entry_link_path_idx" ON "_menu_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_collection_entry_link_collection_entry_idx" ON "_menu_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "footer_blocks_link_order_idx" ON "footer_blocks_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_link_parent_id_idx" ON "footer_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_link_path_idx" ON "footer_blocks_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_collection_type_link_order_idx" ON "footer_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_collection_type_link_parent_id_idx" ON "footer_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_collection_type_link_path_idx" ON "footer_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_collection_type_link_collection_type_idx" ON "footer_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "footer_blocks_collection_entry_link_order_idx" ON "footer_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_collection_entry_link_parent_id_idx" ON "footer_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_collection_entry_link_path_idx" ON "footer_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_collection_entry_link_collection_entry_idx" ON "footer_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_footer_v_blocks_link_order_idx" ON "_footer_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_link_parent_id_idx" ON "_footer_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_link_path_idx" ON "_footer_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_collection_type_link_order_idx" ON "_footer_v_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_collection_type_link_parent_id_idx" ON "_footer_v_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_collection_type_link_path_idx" ON "_footer_v_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_collection_type_link_collection_type_idx" ON "_footer_v_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "_footer_v_blocks_collection_entry_link_order_idx" ON "_footer_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_collection_entry_link_parent_id_idx" ON "_footer_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_collection_entry_link_path_idx" ON "_footer_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_collection_entry_link_collection_entry_idx" ON "_footer_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "pre_footer_blocks_link_order_idx" ON "pre_footer_blocks_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_link_parent_id_idx" ON "pre_footer_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_link_path_idx" ON "pre_footer_blocks_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_collection_type_link_order_idx" ON "pre_footer_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_collection_type_link_parent_id_idx" ON "pre_footer_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_collection_type_link_path_idx" ON "pre_footer_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_collection_type_link_collection_type_idx" ON "pre_footer_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "pre_footer_blocks_collection_entry_link_order_idx" ON "pre_footer_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_collection_entry_link_parent_id_idx" ON "pre_footer_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_collection_entry_link_path_idx" ON "pre_footer_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_collection_entry_link_collection_entry_idx" ON "pre_footer_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_pre_footer_v_blocks_link_order_idx" ON "_pre_footer_v_blocks_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_link_parent_id_idx" ON "_pre_footer_v_blocks_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_link_path_idx" ON "_pre_footer_v_blocks_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_collection_type_link_order_idx" ON "_pre_footer_v_blocks_collection_type_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_collection_type_link_parent_id_idx" ON "_pre_footer_v_blocks_collection_type_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_collection_type_link_path_idx" ON "_pre_footer_v_blocks_collection_type_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_collection_type_link_collection_typ_idx" ON "_pre_footer_v_blocks_collection_type_link" USING btree ("collection_type_id");
  CREATE INDEX "_pre_footer_v_blocks_collection_entry_link_order_idx" ON "_pre_footer_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_collection_entry_link_parent_id_idx" ON "_pre_footer_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_collection_entry_link_path_idx" ON "_pre_footer_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_collection_entry_link_collection_en_idx" ON "_pre_footer_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  ALTER TABLE "side_navigation_blocks_external_link" DROP COLUMN "order";
  ALTER TABLE "side_navigation_blocks_page_link" DROP COLUMN "order";
  ALTER TABLE "_side_navigation_v_blocks_external_link" DROP COLUMN "order";
  ALTER TABLE "_side_navigation_v_blocks_page_link" DROP COLUMN "order";
  ALTER TABLE "footer_site_collection_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "footer_site_collection_blocks_external_link" DROP COLUMN "name";
  ALTER TABLE "_footer_site_collection_v_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "_footer_site_collection_v_blocks_external_link" DROP COLUMN "name";
  ALTER TABLE "pre_footer_site_collection_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "pre_footer_site_collection_blocks_external_link" DROP COLUMN "name";
  ALTER TABLE "_pre_footer_site_collection_v_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "_pre_footer_site_collection_v_blocks_external_link" DROP COLUMN "name";
  ALTER TABLE "footer_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "footer_blocks_external_link" DROP COLUMN "name";
  ALTER TABLE "_footer_v_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "_footer_v_blocks_external_link" DROP COLUMN "name";
  ALTER TABLE "pre_footer_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "pre_footer_blocks_external_link" DROP COLUMN "name";
  ALTER TABLE "_pre_footer_v_blocks_page_link" DROP COLUMN "name";
  ALTER TABLE "_pre_footer_v_blocks_external_link" DROP COLUMN "name";
  DROP TYPE "public"."enum_side_navigation_blocks_collection_link_page";
  DROP TYPE "public"."enum__side_navigation_v_blocks_collection_link_page";
  DROP TYPE "public"."enum_menu_site_collection_blocks_collection_link_page";
  DROP TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page";
  DROP TYPE "public"."enum_footer_site_collection_blocks_collection_link_page";
  DROP TYPE "public"."enum__footer_site_collection_v_blocks_collection_link_page";
  DROP TYPE "public"."enum_pre_footer_site_collection_blocks_collection_link_page";
  DROP TYPE "public"."enum_pre_footer_slim_collection_link_page";
  DROP TYPE "public"."enum__pre_footer_site_collection_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__pre_footer_slim_collection_link_v_page";
  DROP TYPE "public"."enum_menu_blocks_collection_link_page";
  DROP TYPE "public"."enum__menu_v_blocks_collection_link_page";
  DROP TYPE "public"."enum_footer_blocks_collection_link_page";
  DROP TYPE "public"."enum__footer_v_blocks_collection_link_page";
  DROP TYPE "public"."enum_pre_footer_blocks_collection_link_page";
  DROP TYPE "public"."enum__pre_footer_v_blocks_collection_link_page";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_side_navigation_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
  CREATE TYPE "public"."enum__side_navigation_v_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
  CREATE TYPE "public"."enum_menu_site_collection_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_footer_site_collection_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__footer_site_collection_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_pre_footer_site_collection_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_pre_footer_slim_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__pre_footer_site_collection_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__pre_footer_slim_collection_link_v_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_menu_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__menu_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_footer_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__footer_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_pre_footer_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__pre_footer_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TABLE "side_navigation_blocks_page_link_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum_side_navigation_blocks_collection_link_page",
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_page_link_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum__side_navigation_v_blocks_collection_link_page",
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_site_collection_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "enum_menu_site_collection_blocks_collection_link_page",
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_site_collection_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_site_collection_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "enum__menu_site_collection_v_blocks_collection_link_page",
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_site_collection_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_site_collection_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum_footer_site_collection_blocks_collection_link_page",
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_site_collection_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_site_collection_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum__footer_site_collection_v_blocks_collection_link_page",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_site_collection_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum_pre_footer_site_collection_blocks_collection_link_page",
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_slim_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_slim_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum_pre_footer_slim_collection_link_page",
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_slim_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum__pre_footer_site_collection_v_blocks_collection_link_page",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_slim_collection_link_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum__pre_footer_slim_collection_link_v_page",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_slim_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "enum_menu_blocks_collection_link_page",
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "enum__menu_v_blocks_collection_link_page",
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum_footer_blocks_collection_link_page",
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum__footer_v_blocks_collection_link_page",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum_pre_footer_blocks_collection_link_page",
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_slim_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_slim_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page" "enum__pre_footer_v_blocks_collection_link_page",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_slim_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_slim_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "side_navigation_blocks_link" CASCADE;
  DROP TABLE "side_navigation_blocks_collection_type_link" CASCADE;
  DROP TABLE "side_navigation_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_collection_type_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_external_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_collection_type_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_external_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_collection_type_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_collection_type_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_collection_type_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_collection_type_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_collection_type_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "menu_blocks_link" CASCADE;
  DROP TABLE "menu_blocks_external_link" CASCADE;
  DROP TABLE "menu_blocks_collection_type_link" CASCADE;
  DROP TABLE "menu_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_menu_v_blocks_link" CASCADE;
  DROP TABLE "_menu_v_blocks_external_link" CASCADE;
  DROP TABLE "_menu_v_blocks_collection_type_link" CASCADE;
  DROP TABLE "_menu_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "footer_blocks_link" CASCADE;
  DROP TABLE "footer_blocks_collection_type_link" CASCADE;
  DROP TABLE "footer_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_footer_v_blocks_link" CASCADE;
  DROP TABLE "_footer_v_blocks_collection_type_link" CASCADE;
  DROP TABLE "_footer_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "pre_footer_blocks_link" CASCADE;
  DROP TABLE "pre_footer_blocks_collection_type_link" CASCADE;
  DROP TABLE "pre_footer_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_collection_type_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_collection_entry_link" CASCADE;
  ALTER TABLE "side_navigation_blocks_external_link" ADD COLUMN "order" numeric;
  ALTER TABLE "side_navigation_blocks_page_link" ADD COLUMN "order" numeric;
  ALTER TABLE "_side_navigation_v_blocks_external_link" ADD COLUMN "order" numeric;
  ALTER TABLE "_side_navigation_v_blocks_page_link" ADD COLUMN "order" numeric;
  ALTER TABLE "footer_site_collection_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "footer_site_collection_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_footer_site_collection_v_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_footer_site_collection_v_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "pre_footer_site_collection_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "pre_footer_site_collection_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "footer_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "footer_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_footer_v_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_footer_v_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "pre_footer_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "pre_footer_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_pre_footer_v_blocks_external_link" ADD COLUMN "name" varchar;
  ALTER TABLE "_pre_footer_v_blocks_page_link" ADD COLUMN "name" varchar;
  ALTER TABLE "side_navigation_blocks_page_link_2" ADD CONSTRAINT "side_navigation_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_page_link_2" ADD CONSTRAINT "side_navigation_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_collection_link" ADD CONSTRAINT "side_navigation_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_page_link_2" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_page_link_2" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_collection_link" ADD CONSTRAINT "_side_navigation_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_collection_link" ADD CONSTRAINT "menu_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "menu_site_collection_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_collection_link" ADD CONSTRAINT "footer_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "footer_site_collection_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_collection_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_slim_collection_link" ADD CONSTRAINT "pre_footer_slim_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_external_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_slim_collection_link_v" ADD CONSTRAINT "_pre_footer_slim_collection_link_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_external_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_link" ADD CONSTRAINT "menu_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_custom_collection_link" ADD CONSTRAINT "menu_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_collection_link" ADD CONSTRAINT "_menu_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_collection_link" ADD CONSTRAINT "footer_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_custom_collection_link" ADD CONSTRAINT "footer_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_collection_link" ADD CONSTRAINT "_footer_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_collection_link" ADD CONSTRAINT "pre_footer_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_slim_external_link" ADD CONSTRAINT "pre_footer_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_collection_link" ADD CONSTRAINT "_pre_footer_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_v_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_v_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_slim_external_link" ADD CONSTRAINT "_pre_footer_v_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "side_navigation_blocks_page_link_2_order_idx" ON "side_navigation_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_page_link_2_parent_id_idx" ON "side_navigation_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_page_link_2_path_idx" ON "side_navigation_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_page_link_2_page_idx" ON "side_navigation_blocks_page_link_2" USING btree ("page_id");
  CREATE INDEX "side_navigation_blocks_collection_link_order_idx" ON "side_navigation_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_collection_link_parent_id_idx" ON "side_navigation_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_collection_link_path_idx" ON "side_navigation_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_order_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_parent_id_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_path_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_page_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("page_id");
  CREATE INDEX "_side_navigation_v_blocks_collection_link_order_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_collection_link_parent_id_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_collection_link_path_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_collection_link_order_idx" ON "menu_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_collection_link_parent_id_idx" ON "menu_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_collection_link_path_idx" ON "menu_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_order_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_parent_id_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_path_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_link_order_idx" ON "_menu_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_link_parent_id_idx" ON "_menu_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_link_path_idx" ON "_menu_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_order_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_parent_id_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_path_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_collection_link_order_idx" ON "footer_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_collection_link_parent_id_idx" ON "footer_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_collection_link_path_idx" ON "footer_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_order_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_parent_id_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_path_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_link_order_idx" ON "_footer_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_link_parent_id_idx" ON "_footer_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_link_path_idx" ON "_footer_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link_order_idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link_parent_id_idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link_path_idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_link_order_idx" ON "pre_footer_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_link_parent_id_idx" ON "pre_footer_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_link_path_idx" ON "pre_footer_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_order_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_parent_id_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_path_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_slim_page_link_order_idx" ON "pre_footer_site_collection_blocks_slim_page_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_slim_page_link_parent_id_idx" ON "pre_footer_site_collection_blocks_slim_page_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_slim_page_link_path_idx" ON "pre_footer_site_collection_blocks_slim_page_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_slim_page_link_page_idx" ON "pre_footer_site_collection_blocks_slim_page_link" USING btree ("page_id");
  CREATE INDEX "pre_footer_slim_collection_link_order_idx" ON "pre_footer_slim_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_slim_collection_link_parent_id_idx" ON "pre_footer_slim_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_slim_collection_link_path_idx" ON "pre_footer_slim_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_slim_external_link_order_idx" ON "pre_footer_site_collection_blocks_slim_external_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_slim_external_link_parent_id_idx" ON "pre_footer_site_collection_blocks_slim_external_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_slim_external_link_path_idx" ON "pre_footer_site_collection_blocks_slim_external_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_link_order_idx" ON "_pre_footer_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_link_path_idx" ON "_pre_footer_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_link_order_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_link_path_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_slim_page_link_order_idx" ON "_pre_footer_site_collection_v_blocks_slim_page_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_slim_page_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_slim_page_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_slim_page_link_path_idx" ON "_pre_footer_site_collection_v_blocks_slim_page_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_slim_page_link_page_idx" ON "_pre_footer_site_collection_v_blocks_slim_page_link" USING btree ("page_id");
  CREATE INDEX "_pre_footer_slim_collection_link_v_order_idx" ON "_pre_footer_slim_collection_link_v" USING btree ("_order");
  CREATE INDEX "_pre_footer_slim_collection_link_v_parent_id_idx" ON "_pre_footer_slim_collection_link_v" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_slim_collection_link_v_path_idx" ON "_pre_footer_slim_collection_link_v" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_slim_external_link_order_idx" ON "_pre_footer_site_collection_v_blocks_slim_external_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_slim_external_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_slim_external_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_slim_external_link_path_idx" ON "_pre_footer_site_collection_v_blocks_slim_external_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_collection_link_order_idx" ON "menu_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_collection_link_parent_id_idx" ON "menu_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_collection_link_path_idx" ON "menu_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_custom_collection_link_order_idx" ON "menu_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_custom_collection_link_parent_id_idx" ON "menu_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_custom_collection_link_path_idx" ON "menu_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_collection_link_order_idx" ON "_menu_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_collection_link_parent_id_idx" ON "_menu_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_collection_link_path_idx" ON "_menu_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_order_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_parent_id_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_path_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_collection_link_order_idx" ON "footer_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_collection_link_parent_id_idx" ON "footer_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_collection_link_path_idx" ON "footer_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_custom_collection_link_order_idx" ON "footer_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_custom_collection_link_parent_id_idx" ON "footer_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_custom_collection_link_path_idx" ON "footer_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_collection_link_order_idx" ON "_footer_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_collection_link_parent_id_idx" ON "_footer_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_collection_link_path_idx" ON "_footer_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_order_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_parent_id_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_path_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_collection_link_order_idx" ON "pre_footer_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_collection_link_parent_id_idx" ON "pre_footer_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_collection_link_path_idx" ON "pre_footer_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_order_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_parent_id_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_path_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_slim_page_link_order_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_slim_page_link_parent_id_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_slim_page_link_path_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_slim_page_link_page_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("page_id");
  CREATE INDEX "pre_footer_blocks_slim_external_link_order_idx" ON "pre_footer_blocks_slim_external_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_slim_external_link_parent_id_idx" ON "pre_footer_blocks_slim_external_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_slim_external_link_path_idx" ON "pre_footer_blocks_slim_external_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_collection_link_order_idx" ON "_pre_footer_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_collection_link_parent_id_idx" ON "_pre_footer_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_collection_link_path_idx" ON "_pre_footer_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_order_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_parent_id_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_path_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_order_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_parent_id_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_path_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_page_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("page_id");
  CREATE INDEX "_pre_footer_v_blocks_slim_external_link_order_idx" ON "_pre_footer_v_blocks_slim_external_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_slim_external_link_parent_id_idx" ON "_pre_footer_v_blocks_slim_external_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_slim_external_link_path_idx" ON "_pre_footer_v_blocks_slim_external_link" USING btree ("_path");
  ALTER TABLE "footer_site_collection_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "footer_site_collection_blocks_page_link" DROP COLUMN "label";
  ALTER TABLE "_footer_site_collection_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_footer_site_collection_v_blocks_page_link" DROP COLUMN "label";
  ALTER TABLE "pre_footer_site_collection_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "pre_footer_site_collection_blocks_page_link" DROP COLUMN "label";
  ALTER TABLE "_pre_footer_site_collection_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_pre_footer_site_collection_v_blocks_page_link" DROP COLUMN "label";
  ALTER TABLE "footer_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "footer_blocks_page_link" DROP COLUMN "label";
  ALTER TABLE "_footer_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_footer_v_blocks_page_link" DROP COLUMN "label";
  ALTER TABLE "pre_footer_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "pre_footer_blocks_page_link" DROP COLUMN "label";
  ALTER TABLE "_pre_footer_v_blocks_external_link" DROP COLUMN "label";
  ALTER TABLE "_pre_footer_v_blocks_page_link" DROP COLUMN "label";`)
}
