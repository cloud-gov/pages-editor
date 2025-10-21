import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pre_footer_site_collection_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_pre_footer_slim_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_pre_footer_site_collection_type" AS ENUM('big', 'slim');
  CREATE TYPE "public"."enum_pre_footer_site_collection_group_col" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."connect-section-location" AS ENUM('bottom', 'right');
  CREATE TYPE "public"."enum_pre_footer_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pre_footer_site_collection_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__pre_footer_slim_collection_link_v_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__pre_footer_site_collection_v_version_type" AS ENUM('big', 'slim');
  CREATE TYPE "public"."enum__pre_footer_site_collection_v_version_group_col" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pre_footer_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pre_footer_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_pre_footer_type" AS ENUM('big', 'slim');
  CREATE TYPE "public"."enum_pre_footer_group_col" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pre_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pre_footer_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__pre_footer_v_version_type" AS ENUM('big', 'slim');
  CREATE TYPE "public"."enum__pre_footer_v_version_group_col" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pre_footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pre_footer_site_collection_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
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

  CREATE TABLE "pre_footer_site_collection_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "pre_footer_site_collection_link_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group_name" varchar
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

  CREATE TABLE "pre_footer_site_collection_contact_center" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar
  );

  CREATE TABLE "pre_footer_site_collection_facebook" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_site_collection_platform_x" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_site_collection_youtube" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_site_collection_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_site_collection_rssfeed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_pre_footer_site_collection_type",
  	"group_col" "enum_pre_footer_site_collection_group_col" DEFAULT '1',
  	"connect_section_location" "connect-section-location" DEFAULT 'right',
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pre_footer_site_collection_status" DEFAULT 'draft'
  );

  CREATE TABLE "_pre_footer_site_collection_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
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

  CREATE TABLE "_pre_footer_site_collection_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_pre_footer_site_collection_v_version_link_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"group_name" varchar,
  	"_uuid" varchar
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

  CREATE TABLE "_pre_footer_site_collection_v_version_contact_center" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_site_collection_v_version_facebook" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_site_collection_v_version_platform_x" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_site_collection_v_version_youtube" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_site_collection_v_version_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_site_collection_v_version_rssfeed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__pre_footer_site_collection_v_version_type",
  	"version_group_col" "enum__pre_footer_site_collection_v_version_group_col" DEFAULT '1',
  	"version_connect_section_location" "connect-section-location" DEFAULT 'right',
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pre_footer_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE "pre_footer_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
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

  CREATE TABLE "pre_footer_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "pre_footer_link_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group_name" varchar
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

  CREATE TABLE "pre_footer_contact_center" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar
  );

  CREATE TABLE "pre_footer_facebook" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_platform_x" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_youtube" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer_rssfeed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );

  CREATE TABLE "pre_footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_pre_footer_type",
  	"group_col" "enum_pre_footer_group_col" DEFAULT '1',
  	"connect_section_location" "connect-section-location" DEFAULT 'right',
  	"_status" "enum_pre_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_pre_footer_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
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

  CREATE TABLE "_pre_footer_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_pre_footer_v_version_link_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"group_name" varchar,
  	"_uuid" varchar
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

  CREATE TABLE "_pre_footer_v_version_contact_center" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_v_version_facebook" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_v_version_platform_x" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_v_version_youtube" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_v_version_instagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_v_version_rssfeed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_pre_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_type" "enum__pre_footer_v_version_type",
  	"version_group_col" "enum__pre_footer_v_version_group_col" DEFAULT '1',
  	"version_connect_section_location" "connect-section-location" DEFAULT 'right',
  	"version__status" "enum__pre_footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pre_footer_site_collection_id" integer;
  ALTER TABLE "pre_footer_site_collection_blocks_page_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_page_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_collection_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_external_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_link_group" ADD CONSTRAINT "pre_footer_site_collection_link_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_slim_collection_link" ADD CONSTRAINT "pre_footer_slim_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_external_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_contact_center" ADD CONSTRAINT "pre_footer_site_collection_contact_center_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_facebook" ADD CONSTRAINT "pre_footer_site_collection_facebook_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_platform_x" ADD CONSTRAINT "pre_footer_site_collection_platform_x_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_youtube" ADD CONSTRAINT "pre_footer_site_collection_youtube_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_instagram" ADD CONSTRAINT "pre_footer_site_collection_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_rssfeed" ADD CONSTRAINT "pre_footer_site_collection_rssfeed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection" ADD CONSTRAINT "pre_footer_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_page_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_page_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_external_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_version_link_group" ADD CONSTRAINT "_pre_footer_site_collection_v_version_link_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_slim_collection_link_v" ADD CONSTRAINT "_pre_footer_slim_collection_link_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_external_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_version_contact_center" ADD CONSTRAINT "_pre_footer_site_collection_v_version_contact_center_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_version_facebook" ADD CONSTRAINT "_pre_footer_site_collection_v_version_facebook_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_version_platform_x" ADD CONSTRAINT "_pre_footer_site_collection_v_version_platform_x_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_version_youtube" ADD CONSTRAINT "_pre_footer_site_collection_v_version_youtube_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_version_instagram" ADD CONSTRAINT "_pre_footer_site_collection_v_version_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_version_rssfeed" ADD CONSTRAINT "_pre_footer_site_collection_v_version_rssfeed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v" ADD CONSTRAINT "_pre_footer_site_collection_v_parent_id_pre_footer_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v" ADD CONSTRAINT "_pre_footer_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_page_link" ADD CONSTRAINT "pre_footer_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_page_link" ADD CONSTRAINT "pre_footer_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_collection_link" ADD CONSTRAINT "pre_footer_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_external_link" ADD CONSTRAINT "pre_footer_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_link_group" ADD CONSTRAINT "pre_footer_link_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_slim_page_link" ADD CONSTRAINT "pre_footer_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_slim_external_link" ADD CONSTRAINT "pre_footer_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_contact_center" ADD CONSTRAINT "pre_footer_contact_center_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_facebook" ADD CONSTRAINT "pre_footer_facebook_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_platform_x" ADD CONSTRAINT "pre_footer_platform_x_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_youtube" ADD CONSTRAINT "pre_footer_youtube_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_instagram" ADD CONSTRAINT "pre_footer_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_rssfeed" ADD CONSTRAINT "pre_footer_rssfeed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_page_link" ADD CONSTRAINT "_pre_footer_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_page_link" ADD CONSTRAINT "_pre_footer_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_collection_link" ADD CONSTRAINT "_pre_footer_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_external_link" ADD CONSTRAINT "_pre_footer_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_version_link_group" ADD CONSTRAINT "_pre_footer_v_version_link_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_v_blocks_slim_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_slim_page_link" ADD CONSTRAINT "_pre_footer_v_blocks_slim_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_slim_external_link" ADD CONSTRAINT "_pre_footer_v_blocks_slim_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_version_contact_center" ADD CONSTRAINT "_pre_footer_v_version_contact_center_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_version_facebook" ADD CONSTRAINT "_pre_footer_v_version_facebook_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_version_platform_x" ADD CONSTRAINT "_pre_footer_v_version_platform_x_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_version_youtube" ADD CONSTRAINT "_pre_footer_v_version_youtube_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_version_instagram" ADD CONSTRAINT "_pre_footer_v_version_instagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_version_rssfeed" ADD CONSTRAINT "_pre_footer_v_version_rssfeed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pre_footer_site_collection_blocks_page_link_order_idx" ON "pre_footer_site_collection_blocks_page_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_page_link_parent_id_idx" ON "pre_footer_site_collection_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_page_link_path_idx" ON "pre_footer_site_collection_blocks_page_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_page_link_page_idx" ON "pre_footer_site_collection_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_link_order_idx" ON "pre_footer_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_link_parent_id_idx" ON "pre_footer_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_collection_link_path_idx" ON "pre_footer_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_external_link_order_idx" ON "pre_footer_site_collection_blocks_external_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_external_link_parent_id_idx" ON "pre_footer_site_collection_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_external_link_path_idx" ON "pre_footer_site_collection_blocks_external_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_link_group_order_idx" ON "pre_footer_site_collection_link_group" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_link_group_parent_id_idx" ON "pre_footer_site_collection_link_group" USING btree ("_parent_id");
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
  CREATE INDEX "pre_footer_site_collection_contact_center_order_idx" ON "pre_footer_site_collection_contact_center" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_contact_center_parent_id_idx" ON "pre_footer_site_collection_contact_center" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_facebook_order_idx" ON "pre_footer_site_collection_facebook" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_facebook_parent_id_idx" ON "pre_footer_site_collection_facebook" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_platform_x_order_idx" ON "pre_footer_site_collection_platform_x" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_platform_x_parent_id_idx" ON "pre_footer_site_collection_platform_x" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_youtube_order_idx" ON "pre_footer_site_collection_youtube" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_youtube_parent_id_idx" ON "pre_footer_site_collection_youtube" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_instagram_order_idx" ON "pre_footer_site_collection_instagram" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_instagram_parent_id_idx" ON "pre_footer_site_collection_instagram" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_rssfeed_order_idx" ON "pre_footer_site_collection_rssfeed" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_rssfeed_parent_id_idx" ON "pre_footer_site_collection_rssfeed" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_site_idx" ON "pre_footer_site_collection" USING btree ("site_id");
  CREATE INDEX "pre_footer_site_collection_updated_at_idx" ON "pre_footer_site_collection" USING btree ("updated_at");
  CREATE INDEX "pre_footer_site_collection_created_at_idx" ON "pre_footer_site_collection" USING btree ("created_at");
  CREATE INDEX "pre_footer_site_collection__status_idx" ON "pre_footer_site_collection" USING btree ("_status");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_page_link_order_idx" ON "_pre_footer_site_collection_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_page_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_page_link_path_idx" ON "_pre_footer_site_collection_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_page_link_page_idx" ON "_pre_footer_site_collection_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_link_order_idx" ON "_pre_footer_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_collection_link_path_idx" ON "_pre_footer_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_external_link_order_idx" ON "_pre_footer_site_collection_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_external_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_external_link_path_idx" ON "_pre_footer_site_collection_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_version_link_group_order_idx" ON "_pre_footer_site_collection_v_version_link_group" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_version_link_group_parent_id_idx" ON "_pre_footer_site_collection_v_version_link_group" USING btree ("_parent_id");
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
  CREATE INDEX "_pre_footer_site_collection_v_version_contact_center_order_idx" ON "_pre_footer_site_collection_v_version_contact_center" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_version_contact_center_parent_id_idx" ON "_pre_footer_site_collection_v_version_contact_center" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_version_facebook_order_idx" ON "_pre_footer_site_collection_v_version_facebook" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_version_facebook_parent_id_idx" ON "_pre_footer_site_collection_v_version_facebook" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_version_platform_x_order_idx" ON "_pre_footer_site_collection_v_version_platform_x" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_version_platform_x_parent_id_idx" ON "_pre_footer_site_collection_v_version_platform_x" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_version_youtube_order_idx" ON "_pre_footer_site_collection_v_version_youtube" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_version_youtube_parent_id_idx" ON "_pre_footer_site_collection_v_version_youtube" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_version_instagram_order_idx" ON "_pre_footer_site_collection_v_version_instagram" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_version_instagram_parent_id_idx" ON "_pre_footer_site_collection_v_version_instagram" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_version_rssfeed_order_idx" ON "_pre_footer_site_collection_v_version_rssfeed" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_version_rssfeed_parent_id_idx" ON "_pre_footer_site_collection_v_version_rssfeed" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_parent_idx" ON "_pre_footer_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_version_version_site_idx" ON "_pre_footer_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_pre_footer_site_collection_v_version_version_updated_at_idx" ON "_pre_footer_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_pre_footer_site_collection_v_version_version_created_at_idx" ON "_pre_footer_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_pre_footer_site_collection_v_version_version__status_idx" ON "_pre_footer_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_pre_footer_site_collection_v_created_at_idx" ON "_pre_footer_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_pre_footer_site_collection_v_updated_at_idx" ON "_pre_footer_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_pre_footer_site_collection_v_latest_idx" ON "_pre_footer_site_collection_v" USING btree ("latest");
  CREATE INDEX "_pre_footer_site_collection_v_autosave_idx" ON "_pre_footer_site_collection_v" USING btree ("autosave");
  CREATE INDEX "pre_footer_blocks_page_link_order_idx" ON "pre_footer_blocks_page_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_page_link_parent_id_idx" ON "pre_footer_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_page_link_path_idx" ON "pre_footer_blocks_page_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_page_link_page_idx" ON "pre_footer_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "pre_footer_blocks_collection_link_order_idx" ON "pre_footer_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_collection_link_parent_id_idx" ON "pre_footer_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_collection_link_path_idx" ON "pre_footer_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_external_link_order_idx" ON "pre_footer_blocks_external_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_external_link_parent_id_idx" ON "pre_footer_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_external_link_path_idx" ON "pre_footer_blocks_external_link" USING btree ("_path");
  CREATE INDEX "pre_footer_link_group_order_idx" ON "pre_footer_link_group" USING btree ("_order");
  CREATE INDEX "pre_footer_link_group_parent_id_idx" ON "pre_footer_link_group" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_slim_page_link_order_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_slim_page_link_parent_id_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_slim_page_link_path_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_slim_page_link_page_idx" ON "pre_footer_blocks_slim_page_link" USING btree ("page_id");
  CREATE INDEX "pre_footer_blocks_slim_external_link_order_idx" ON "pre_footer_blocks_slim_external_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_slim_external_link_parent_id_idx" ON "pre_footer_blocks_slim_external_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_slim_external_link_path_idx" ON "pre_footer_blocks_slim_external_link" USING btree ("_path");
  CREATE INDEX "pre_footer_contact_center_order_idx" ON "pre_footer_contact_center" USING btree ("_order");
  CREATE INDEX "pre_footer_contact_center_parent_id_idx" ON "pre_footer_contact_center" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_facebook_order_idx" ON "pre_footer_facebook" USING btree ("_order");
  CREATE INDEX "pre_footer_facebook_parent_id_idx" ON "pre_footer_facebook" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_platform_x_order_idx" ON "pre_footer_platform_x" USING btree ("_order");
  CREATE INDEX "pre_footer_platform_x_parent_id_idx" ON "pre_footer_platform_x" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_youtube_order_idx" ON "pre_footer_youtube" USING btree ("_order");
  CREATE INDEX "pre_footer_youtube_parent_id_idx" ON "pre_footer_youtube" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_instagram_order_idx" ON "pre_footer_instagram" USING btree ("_order");
  CREATE INDEX "pre_footer_instagram_parent_id_idx" ON "pre_footer_instagram" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_rssfeed_order_idx" ON "pre_footer_rssfeed" USING btree ("_order");
  CREATE INDEX "pre_footer_rssfeed_parent_id_idx" ON "pre_footer_rssfeed" USING btree ("_parent_id");
  CREATE INDEX "pre_footer__status_idx" ON "pre_footer" USING btree ("_status");
  CREATE INDEX "_pre_footer_v_blocks_page_link_order_idx" ON "_pre_footer_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_page_link_parent_id_idx" ON "_pre_footer_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_page_link_path_idx" ON "_pre_footer_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_page_link_page_idx" ON "_pre_footer_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_pre_footer_v_blocks_collection_link_order_idx" ON "_pre_footer_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_collection_link_parent_id_idx" ON "_pre_footer_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_collection_link_path_idx" ON "_pre_footer_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_external_link_order_idx" ON "_pre_footer_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_external_link_parent_id_idx" ON "_pre_footer_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_external_link_path_idx" ON "_pre_footer_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_version_link_group_order_idx" ON "_pre_footer_v_version_link_group" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_version_link_group_parent_id_idx" ON "_pre_footer_v_version_link_group" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_order_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_parent_id_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_path_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_slim_page_link_page_idx" ON "_pre_footer_v_blocks_slim_page_link" USING btree ("page_id");
  CREATE INDEX "_pre_footer_v_blocks_slim_external_link_order_idx" ON "_pre_footer_v_blocks_slim_external_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_slim_external_link_parent_id_idx" ON "_pre_footer_v_blocks_slim_external_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_slim_external_link_path_idx" ON "_pre_footer_v_blocks_slim_external_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_version_contact_center_order_idx" ON "_pre_footer_v_version_contact_center" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_version_contact_center_parent_id_idx" ON "_pre_footer_v_version_contact_center" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_version_facebook_order_idx" ON "_pre_footer_v_version_facebook" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_version_facebook_parent_id_idx" ON "_pre_footer_v_version_facebook" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_version_platform_x_order_idx" ON "_pre_footer_v_version_platform_x" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_version_platform_x_parent_id_idx" ON "_pre_footer_v_version_platform_x" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_version_youtube_order_idx" ON "_pre_footer_v_version_youtube" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_version_youtube_parent_id_idx" ON "_pre_footer_v_version_youtube" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_version_instagram_order_idx" ON "_pre_footer_v_version_instagram" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_version_instagram_parent_id_idx" ON "_pre_footer_v_version_instagram" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_version_rssfeed_order_idx" ON "_pre_footer_v_version_rssfeed" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_version_rssfeed_parent_id_idx" ON "_pre_footer_v_version_rssfeed" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_version_version__status_idx" ON "_pre_footer_v" USING btree ("version__status");
  CREATE INDEX "_pre_footer_v_created_at_idx" ON "_pre_footer_v" USING btree ("created_at");
  CREATE INDEX "_pre_footer_v_updated_at_idx" ON "_pre_footer_v" USING btree ("updated_at");
  CREATE INDEX "_pre_footer_v_latest_idx" ON "_pre_footer_v" USING btree ("latest");
  CREATE INDEX "_pre_footer_v_autosave_idx" ON "_pre_footer_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pre_footer_site_collection_fk" FOREIGN KEY ("pre_footer_site_collection_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pre_footer_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("pre_footer_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pre_footer_site_collection_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_link_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_slim_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_blocks_slim_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_contact_center" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_facebook" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_platform_x" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_youtube" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_instagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection_rssfeed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_version_link_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_slim_collection_link_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_slim_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_version_contact_center" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_version_facebook" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_version_platform_x" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_version_youtube" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_version_instagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v_version_rssfeed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_link_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_blocks_slim_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_blocks_slim_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_contact_center" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_facebook" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_platform_x" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_youtube" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_instagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer_rssfeed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pre_footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_version_link_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_blocks_slim_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_blocks_slim_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_version_contact_center" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_version_facebook" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_version_platform_x" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_version_youtube" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_version_instagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v_version_rssfeed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pre_footer_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pre_footer_site_collection_blocks_page_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_external_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_link_group" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_slim_page_link" CASCADE;
  DROP TABLE "pre_footer_slim_collection_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_slim_external_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_contact_center" CASCADE;
  DROP TABLE "pre_footer_site_collection_facebook" CASCADE;
  DROP TABLE "pre_footer_site_collection_platform_x" CASCADE;
  DROP TABLE "pre_footer_site_collection_youtube" CASCADE;
  DROP TABLE "pre_footer_site_collection_instagram" CASCADE;
  DROP TABLE "pre_footer_site_collection_rssfeed" CASCADE;
  DROP TABLE "pre_footer_site_collection" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_page_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_external_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_version_link_group" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_slim_page_link" CASCADE;
  DROP TABLE "_pre_footer_slim_collection_link_v" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_slim_external_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_version_contact_center" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_version_facebook" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_version_platform_x" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_version_youtube" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_version_instagram" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_version_rssfeed" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v" CASCADE;
  DROP TABLE "pre_footer_blocks_page_link" CASCADE;
  DROP TABLE "pre_footer_blocks_collection_link" CASCADE;
  DROP TABLE "pre_footer_blocks_external_link" CASCADE;
  DROP TABLE "pre_footer_link_group" CASCADE;
  DROP TABLE "pre_footer_blocks_slim_page_link" CASCADE;
  DROP TABLE "pre_footer_blocks_slim_external_link" CASCADE;
  DROP TABLE "pre_footer_contact_center" CASCADE;
  DROP TABLE "pre_footer_facebook" CASCADE;
  DROP TABLE "pre_footer_platform_x" CASCADE;
  DROP TABLE "pre_footer_youtube" CASCADE;
  DROP TABLE "pre_footer_instagram" CASCADE;
  DROP TABLE "pre_footer_rssfeed" CASCADE;
  DROP TABLE "pre_footer" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_page_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_collection_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_external_link" CASCADE;
  DROP TABLE "_pre_footer_v_version_link_group" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_slim_page_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_slim_external_link" CASCADE;
  DROP TABLE "_pre_footer_v_version_contact_center" CASCADE;
  DROP TABLE "_pre_footer_v_version_facebook" CASCADE;
  DROP TABLE "_pre_footer_v_version_platform_x" CASCADE;
  DROP TABLE "_pre_footer_v_version_youtube" CASCADE;
  DROP TABLE "_pre_footer_v_version_instagram" CASCADE;
  DROP TABLE "_pre_footer_v_version_rssfeed" CASCADE;
  DROP TABLE "_pre_footer_v" CASCADE;
  DROP INDEX IF EXISTS "payload_locked_documents_rels_pre_footer_site_collection_fk";

  DROP INDEX "payload_locked_documents_rels_pre_footer_site_collection_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pre_footer_site_collection_id";
  DROP TYPE "public"."enum_pre_footer_site_collection_blocks_collection_link_page";
  DROP TYPE "public"."enum_pre_footer_slim_collection_link_page";
  DROP TYPE "public"."enum_pre_footer_site_collection_type";
  DROP TYPE "public"."enum_pre_footer_site_collection_group_col";
  DROP TYPE "public"."connect-section-location";
  DROP TYPE "public"."enum_pre_footer_site_collection_status";
  DROP TYPE "public"."enum__pre_footer_site_collection_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__pre_footer_slim_collection_link_v_page";
  DROP TYPE "public"."enum__pre_footer_site_collection_v_version_type";
  DROP TYPE "public"."enum__pre_footer_site_collection_v_version_group_col";
  DROP TYPE "public"."enum__pre_footer_site_collection_v_version_status";
  DROP TYPE "public"."enum_pre_footer_blocks_collection_link_page";
  DROP TYPE "public"."enum_pre_footer_type";
  DROP TYPE "public"."enum_pre_footer_group_col";
  DROP TYPE "public"."enum_pre_footer_status";
  DROP TYPE "public"."enum__pre_footer_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__pre_footer_v_version_type";
  DROP TYPE "public"."enum__pre_footer_v_version_group_col";
  DROP TYPE "public"."enum__pre_footer_v_version_status";`)
}
