import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resources_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_version_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_collection_entry_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_resources_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leadership" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_leadership_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "policies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_policies_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts_blocks_page_link" CASCADE;
  DROP TABLE "posts_blocks_collection_entry_link" CASCADE;
  DROP TABLE "posts_blocks_external_link" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v_blocks_page_link" CASCADE;
  DROP TABLE "_posts_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_posts_v_blocks_external_link" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "events_attachments" CASCADE;
  DROP TABLE "events_blocks_page_link" CASCADE;
  DROP TABLE "events_blocks_collection_entry_link" CASCADE;
  DROP TABLE "events_blocks_external_link" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_version_attachments" CASCADE;
  DROP TABLE "_events_v_blocks_page_link" CASCADE;
  DROP TABLE "_events_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_events_v_blocks_external_link" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "news_blocks_page_link" CASCADE;
  DROP TABLE "news_blocks_collection_entry_link" CASCADE;
  DROP TABLE "news_blocks_external_link" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v_blocks_page_link" CASCADE;
  DROP TABLE "_news_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_news_v_blocks_external_link" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "reports_report_files" CASCADE;
  DROP TABLE "reports_blocks_page_link" CASCADE;
  DROP TABLE "reports_blocks_collection_entry_link" CASCADE;
  DROP TABLE "reports_blocks_external_link" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_rels" CASCADE;
  DROP TABLE "_reports_v_version_report_files" CASCADE;
  DROP TABLE "_reports_v_blocks_page_link" CASCADE;
  DROP TABLE "_reports_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_reports_v_blocks_external_link" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "_reports_v_rels" CASCADE;
  DROP TABLE "resources_report_files" CASCADE;
  DROP TABLE "resources_blocks_page_link" CASCADE;
  DROP TABLE "resources_blocks_collection_entry_link" CASCADE;
  DROP TABLE "resources_blocks_external_link" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_rels" CASCADE;
  DROP TABLE "_resources_v_version_report_files" CASCADE;
  DROP TABLE "_resources_v_blocks_page_link" CASCADE;
  DROP TABLE "_resources_v_blocks_collection_entry_link" CASCADE;
  DROP TABLE "_resources_v_blocks_external_link" CASCADE;
  DROP TABLE "_resources_v" CASCADE;
  DROP TABLE "_resources_v_rels" CASCADE;
  DROP TABLE "leadership" CASCADE;
  DROP TABLE "_leadership_v" CASCADE;
  DROP TABLE "policies" CASCADE;
  DROP TABLE "_policies_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_news_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_reports_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_resources_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_leadership_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_policies_fk";
  
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  DROP INDEX "payload_locked_documents_rels_reports_id_idx";
  DROP INDEX "payload_locked_documents_rels_resources_id_idx";
  DROP INDEX "payload_locked_documents_rels_leadership_id_idx";
  DROP INDEX "payload_locked_documents_rels_policies_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reports_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resources_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leadership_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "policies_id";
  DROP TYPE "public"."enum_posts_example_custom_field";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_example_custom_field";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_events_format";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_format";
  DROP TYPE "public"."enum__events_v_version_event_type";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_status";
  DROP TYPE "public"."enum_resources_status";
  DROP TYPE "public"."enum__resources_v_version_status";
  DROP TYPE "public"."enum_leadership_status";
  DROP TYPE "public"."enum__leadership_v_version_status";
  DROP TYPE "public"."enum_policies_status";
  DROP TYPE "public"."enum__policies_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_example_custom_field" AS ENUM('radio', 'television', 'podcast', 'video');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_example_custom_field" AS ENUM('radio', 'television', 'podcast', 'video');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_format" AS ENUM('inperson', 'virtual');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('onetime', 'series');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_format" AS ENUM('inperson', 'virtual');
  CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('onetime', 'series');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leadership_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__leadership_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_policies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__policies_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
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
  
  CREATE TABLE "posts_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"site_id" integer,
  	"content" jsonb,
  	"review_ready" boolean DEFAULT false,
  	"updated_by_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"show_in_page_nav" boolean DEFAULT true,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"example_custom_field" "enum_posts_example_custom_field",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
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
  
  CREATE TABLE "_posts_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_review_ready" boolean DEFAULT false,
  	"version_updated_by_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_show_in_page_nav" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_example_custom_field" "enum__posts_v_version_example_custom_field",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "events_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
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
  
  CREATE TABLE "events_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"location" varchar,
  	"registration_url" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"site_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"content" jsonb,
  	"point_of_contact" varchar,
  	"point_of_contact_email" varchar,
  	"point_of_contact_phone" varchar,
  	"published_at" timestamp(3) with time zone,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"format" "enum_events_format" DEFAULT 'inperson',
  	"event_type" "enum_events_event_type" DEFAULT 'onetime',
  	"review_ready" boolean DEFAULT false,
  	"show_in_page_nav" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_events_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
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
  
  CREATE TABLE "_events_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_location" varchar,
  	"version_registration_url" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_site_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_content" jsonb,
  	"version_point_of_contact" varchar,
  	"version_point_of_contact_email" varchar,
  	"version_point_of_contact_phone" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_format" "enum__events_v_version_format" DEFAULT 'inperson',
  	"version_event_type" "enum__events_v_version_event_type" DEFAULT 'onetime',
  	"version_review_ready" boolean DEFAULT false,
  	"version_show_in_page_nav" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
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
  
  CREATE TABLE "news_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"content" jsonb,
  	"site_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"review_ready" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"updated_by_id" integer,
  	"show_in_page_nav" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
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
  
  CREATE TABLE "_news_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_review_ready" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_by_id" integer,
  	"version_show_in_page_nav" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "reports_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
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
  
  CREATE TABLE "reports_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"image_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"report_date" timestamp(3) with time zone,
  	"site_id" integer,
  	"content" jsonb,
  	"review_ready" boolean DEFAULT false,
  	"updated_by_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"show_in_page_nav" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reports_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "reports_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_reports_v_version_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
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
  
  CREATE TABLE "_reports_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_report_date" timestamp(3) with time zone,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_review_ready" boolean DEFAULT false,
  	"version_updated_by_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_show_in_page_nav" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reports_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_reports_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "resources_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
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
  
  CREATE TABLE "resources_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"image_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"resource_date" timestamp(3) with time zone,
  	"updated_by_id" integer,
  	"site_id" integer,
  	"content" jsonb,
  	"review_ready" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"show_in_page_nav" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_resources_v_version_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
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
  
  CREATE TABLE "_resources_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_resource_date" timestamp(3) with time zone,
  	"version_updated_by_id" integer,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_review_ready" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_show_in_page_nav" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_resources_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "leadership" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"job_title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"content" jsonb,
  	"site_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_leadership_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_leadership_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_job_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__leadership_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"content" jsonb,
  	"site_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_policies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_policies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__policies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leadership_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "policies_id" integer;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_page_link" ADD CONSTRAINT "posts_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_page_link" ADD CONSTRAINT "posts_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_collection_entry_link" ADD CONSTRAINT "posts_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_collection_entry_link" ADD CONSTRAINT "posts_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_external_link" ADD CONSTRAINT "posts_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_page_link" ADD CONSTRAINT "_posts_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_page_link" ADD CONSTRAINT "_posts_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_collection_entry_link" ADD CONSTRAINT "_posts_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_collection_entry_link" ADD CONSTRAINT "_posts_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_external_link" ADD CONSTRAINT "_posts_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_attachments" ADD CONSTRAINT "events_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_attachments" ADD CONSTRAINT "events_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_page_link" ADD CONSTRAINT "events_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_blocks_page_link" ADD CONSTRAINT "events_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_collection_entry_link" ADD CONSTRAINT "events_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_blocks_collection_entry_link" ADD CONSTRAINT "events_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_external_link" ADD CONSTRAINT "events_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_attachments" ADD CONSTRAINT "_events_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_attachments" ADD CONSTRAINT "_events_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_page_link" ADD CONSTRAINT "_events_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_page_link" ADD CONSTRAINT "_events_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_collection_entry_link" ADD CONSTRAINT "_events_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_collection_entry_link" ADD CONSTRAINT "_events_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_external_link" ADD CONSTRAINT "_events_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_page_link" ADD CONSTRAINT "news_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_page_link" ADD CONSTRAINT "news_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_collection_entry_link" ADD CONSTRAINT "news_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_blocks_collection_entry_link" ADD CONSTRAINT "news_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_external_link" ADD CONSTRAINT "news_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_page_link" ADD CONSTRAINT "_news_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_page_link" ADD CONSTRAINT "_news_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_collection_entry_link" ADD CONSTRAINT "_news_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_collection_entry_link" ADD CONSTRAINT "_news_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_blocks_external_link" ADD CONSTRAINT "_news_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_report_files" ADD CONSTRAINT "reports_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_report_files" ADD CONSTRAINT "reports_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_page_link" ADD CONSTRAINT "reports_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_blocks_page_link" ADD CONSTRAINT "reports_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_collection_entry_link" ADD CONSTRAINT "reports_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_blocks_collection_entry_link" ADD CONSTRAINT "reports_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_blocks_external_link" ADD CONSTRAINT "reports_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_report_files" ADD CONSTRAINT "_reports_v_version_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_version_report_files" ADD CONSTRAINT "_reports_v_version_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_page_link" ADD CONSTRAINT "_reports_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_page_link" ADD CONSTRAINT "_reports_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_collection_entry_link" ADD CONSTRAINT "_reports_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_collection_entry_link" ADD CONSTRAINT "_reports_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_blocks_external_link" ADD CONSTRAINT "_reports_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_report_files" ADD CONSTRAINT "resources_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_report_files" ADD CONSTRAINT "resources_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_page_link" ADD CONSTRAINT "resources_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_blocks_page_link" ADD CONSTRAINT "resources_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_collection_entry_link" ADD CONSTRAINT "resources_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_blocks_collection_entry_link" ADD CONSTRAINT "resources_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_blocks_external_link" ADD CONSTRAINT "resources_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_version_report_files" ADD CONSTRAINT "_resources_v_version_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_version_report_files" ADD CONSTRAINT "_resources_v_version_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_page_link" ADD CONSTRAINT "_resources_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_page_link" ADD CONSTRAINT "_resources_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_collection_entry_link" ADD CONSTRAINT "_resources_v_blocks_collection_entry_link_collection_entry_id_collection_entries_id_fk" FOREIGN KEY ("collection_entry_id") REFERENCES "public"."collection_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_collection_entry_link" ADD CONSTRAINT "_resources_v_blocks_collection_entry_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_blocks_external_link" ADD CONSTRAINT "_resources_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_rels" ADD CONSTRAINT "_resources_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leadership" ADD CONSTRAINT "leadership_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leadership" ADD CONSTRAINT "leadership_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leadership_v" ADD CONSTRAINT "_leadership_v_parent_id_leadership_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leadership"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leadership_v" ADD CONSTRAINT "_leadership_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leadership_v" ADD CONSTRAINT "_leadership_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "policies" ADD CONSTRAINT "policies_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_parent_id_policies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."policies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_page_link_order_idx" ON "posts_blocks_page_link" USING btree ("_order");
  CREATE INDEX "posts_blocks_page_link_parent_id_idx" ON "posts_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_page_link_path_idx" ON "posts_blocks_page_link" USING btree ("_path");
  CREATE INDEX "posts_blocks_page_link_page_idx" ON "posts_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "posts_blocks_collection_entry_link_order_idx" ON "posts_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "posts_blocks_collection_entry_link_parent_id_idx" ON "posts_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_collection_entry_link_path_idx" ON "posts_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "posts_blocks_collection_entry_link_collection_entry_idx" ON "posts_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "posts_blocks_external_link_order_idx" ON "posts_blocks_external_link" USING btree ("_order");
  CREATE INDEX "posts_blocks_external_link_parent_id_idx" ON "posts_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_external_link_path_idx" ON "posts_blocks_external_link" USING btree ("_path");
  CREATE INDEX "posts_image_idx" ON "posts" USING btree ("image_id");
  CREATE INDEX "posts_site_idx" ON "posts" USING btree ("site_id");
  CREATE INDEX "posts_updated_by_idx" ON "posts" USING btree ("updated_by_id");
  CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_page_link_order_idx" ON "_posts_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_page_link_parent_id_idx" ON "_posts_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_page_link_path_idx" ON "_posts_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_page_link_page_idx" ON "_posts_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_order_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_parent_id_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_path_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_collection_entry_link_collection_entry_idx" ON "_posts_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_posts_v_blocks_external_link_order_idx" ON "_posts_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_external_link_parent_id_idx" ON "_posts_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_external_link_path_idx" ON "_posts_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_image_idx" ON "_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_posts_v_version_version_site_idx" ON "_posts_v" USING btree ("version_site_id");
  CREATE INDEX "_posts_v_version_version_updated_by_idx" ON "_posts_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "events_attachments_order_idx" ON "events_attachments" USING btree ("_order");
  CREATE INDEX "events_attachments_parent_id_idx" ON "events_attachments" USING btree ("_parent_id");
  CREATE INDEX "events_attachments_file_idx" ON "events_attachments" USING btree ("file_id");
  CREATE INDEX "events_blocks_page_link_order_idx" ON "events_blocks_page_link" USING btree ("_order");
  CREATE INDEX "events_blocks_page_link_parent_id_idx" ON "events_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_page_link_path_idx" ON "events_blocks_page_link" USING btree ("_path");
  CREATE INDEX "events_blocks_page_link_page_idx" ON "events_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "events_blocks_collection_entry_link_order_idx" ON "events_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "events_blocks_collection_entry_link_parent_id_idx" ON "events_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_collection_entry_link_path_idx" ON "events_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "events_blocks_collection_entry_link_collection_entry_idx" ON "events_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "events_blocks_external_link_order_idx" ON "events_blocks_external_link" USING btree ("_order");
  CREATE INDEX "events_blocks_external_link_parent_id_idx" ON "events_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_external_link_path_idx" ON "events_blocks_external_link" USING btree ("_path");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_site_idx" ON "events" USING btree ("site_id");
  CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_tags_id_idx" ON "events_rels" USING btree ("tags_id");
  CREATE INDEX "_events_v_version_attachments_order_idx" ON "_events_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_events_v_version_attachments_parent_id_idx" ON "_events_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_attachments_file_idx" ON "_events_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_events_v_blocks_page_link_order_idx" ON "_events_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_page_link_parent_id_idx" ON "_events_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_page_link_path_idx" ON "_events_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_page_link_page_idx" ON "_events_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_events_v_blocks_collection_entry_link_order_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_collection_entry_link_parent_id_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_collection_entry_link_path_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_collection_entry_link_collection_entry_idx" ON "_events_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_events_v_blocks_external_link_order_idx" ON "_events_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_external_link_parent_id_idx" ON "_events_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_external_link_path_idx" ON "_events_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_site_idx" ON "_events_v" USING btree ("version_site_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_tags_id_idx" ON "_events_v_rels" USING btree ("tags_id");
  CREATE INDEX "news_blocks_page_link_order_idx" ON "news_blocks_page_link" USING btree ("_order");
  CREATE INDEX "news_blocks_page_link_parent_id_idx" ON "news_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_page_link_path_idx" ON "news_blocks_page_link" USING btree ("_path");
  CREATE INDEX "news_blocks_page_link_page_idx" ON "news_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "news_blocks_collection_entry_link_order_idx" ON "news_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "news_blocks_collection_entry_link_parent_id_idx" ON "news_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_collection_entry_link_path_idx" ON "news_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "news_blocks_collection_entry_link_collection_entry_idx" ON "news_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "news_blocks_external_link_order_idx" ON "news_blocks_external_link" USING btree ("_order");
  CREATE INDEX "news_blocks_external_link_parent_id_idx" ON "news_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "news_blocks_external_link_path_idx" ON "news_blocks_external_link" USING btree ("_path");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_site_idx" ON "news" USING btree ("site_id");
  CREATE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_updated_by_idx" ON "news" USING btree ("updated_by_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_tags_id_idx" ON "news_rels" USING btree ("tags_id");
  CREATE INDEX "_news_v_blocks_page_link_order_idx" ON "_news_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_page_link_parent_id_idx" ON "_news_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_page_link_path_idx" ON "_news_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_news_v_blocks_page_link_page_idx" ON "_news_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_news_v_blocks_collection_entry_link_order_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_collection_entry_link_parent_id_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_collection_entry_link_path_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_news_v_blocks_collection_entry_link_collection_entry_idx" ON "_news_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_news_v_blocks_external_link_order_idx" ON "_news_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_news_v_blocks_external_link_parent_id_idx" ON "_news_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_news_v_blocks_external_link_path_idx" ON "_news_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_site_idx" ON "_news_v" USING btree ("version_site_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_updated_by_idx" ON "_news_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_tags_id_idx" ON "_news_v_rels" USING btree ("tags_id");
  CREATE INDEX "reports_report_files_order_idx" ON "reports_report_files" USING btree ("_order");
  CREATE INDEX "reports_report_files_parent_id_idx" ON "reports_report_files" USING btree ("_parent_id");
  CREATE INDEX "reports_report_files_file_idx" ON "reports_report_files" USING btree ("file_id");
  CREATE INDEX "reports_blocks_page_link_order_idx" ON "reports_blocks_page_link" USING btree ("_order");
  CREATE INDEX "reports_blocks_page_link_parent_id_idx" ON "reports_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_page_link_path_idx" ON "reports_blocks_page_link" USING btree ("_path");
  CREATE INDEX "reports_blocks_page_link_page_idx" ON "reports_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "reports_blocks_collection_entry_link_order_idx" ON "reports_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "reports_blocks_collection_entry_link_parent_id_idx" ON "reports_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_collection_entry_link_path_idx" ON "reports_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "reports_blocks_collection_entry_link_collection_entry_idx" ON "reports_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "reports_blocks_external_link_order_idx" ON "reports_blocks_external_link" USING btree ("_order");
  CREATE INDEX "reports_blocks_external_link_parent_id_idx" ON "reports_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "reports_blocks_external_link_path_idx" ON "reports_blocks_external_link" USING btree ("_path");
  CREATE INDEX "reports_image_idx" ON "reports" USING btree ("image_id");
  CREATE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
  CREATE INDEX "reports_site_idx" ON "reports" USING btree ("site_id");
  CREATE INDEX "reports_updated_by_idx" ON "reports" USING btree ("updated_by_id");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX "reports__status_idx" ON "reports" USING btree ("_status");
  CREATE INDEX "reports_rels_order_idx" ON "reports_rels" USING btree ("order");
  CREATE INDEX "reports_rels_parent_idx" ON "reports_rels" USING btree ("parent_id");
  CREATE INDEX "reports_rels_path_idx" ON "reports_rels" USING btree ("path");
  CREATE INDEX "reports_rels_tags_id_idx" ON "reports_rels" USING btree ("tags_id");
  CREATE INDEX "_reports_v_version_report_files_order_idx" ON "_reports_v_version_report_files" USING btree ("_order");
  CREATE INDEX "_reports_v_version_report_files_parent_id_idx" ON "_reports_v_version_report_files" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_version_report_files_file_idx" ON "_reports_v_version_report_files" USING btree ("file_id");
  CREATE INDEX "_reports_v_blocks_page_link_order_idx" ON "_reports_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_page_link_parent_id_idx" ON "_reports_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_page_link_path_idx" ON "_reports_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_reports_v_blocks_page_link_page_idx" ON "_reports_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_order_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_parent_id_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_path_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_reports_v_blocks_collection_entry_link_collection_entry_idx" ON "_reports_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_reports_v_blocks_external_link_order_idx" ON "_reports_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_reports_v_blocks_external_link_parent_id_idx" ON "_reports_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_blocks_external_link_path_idx" ON "_reports_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_reports_v_parent_idx" ON "_reports_v" USING btree ("parent_id");
  CREATE INDEX "_reports_v_version_version_image_idx" ON "_reports_v" USING btree ("version_image_id");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v" USING btree ("version_slug");
  CREATE INDEX "_reports_v_version_version_site_idx" ON "_reports_v" USING btree ("version_site_id");
  CREATE INDEX "_reports_v_version_version_updated_by_idx" ON "_reports_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_reports_v_version_version_updated_at_idx" ON "_reports_v" USING btree ("version_updated_at");
  CREATE INDEX "_reports_v_version_version_created_at_idx" ON "_reports_v" USING btree ("version_created_at");
  CREATE INDEX "_reports_v_version_version__status_idx" ON "_reports_v" USING btree ("version__status");
  CREATE INDEX "_reports_v_created_at_idx" ON "_reports_v" USING btree ("created_at");
  CREATE INDEX "_reports_v_updated_at_idx" ON "_reports_v" USING btree ("updated_at");
  CREATE INDEX "_reports_v_latest_idx" ON "_reports_v" USING btree ("latest");
  CREATE INDEX "_reports_v_autosave_idx" ON "_reports_v" USING btree ("autosave");
  CREATE INDEX "_reports_v_rels_order_idx" ON "_reports_v_rels" USING btree ("order");
  CREATE INDEX "_reports_v_rels_parent_idx" ON "_reports_v_rels" USING btree ("parent_id");
  CREATE INDEX "_reports_v_rels_path_idx" ON "_reports_v_rels" USING btree ("path");
  CREATE INDEX "_reports_v_rels_tags_id_idx" ON "_reports_v_rels" USING btree ("tags_id");
  CREATE INDEX "resources_report_files_order_idx" ON "resources_report_files" USING btree ("_order");
  CREATE INDEX "resources_report_files_parent_id_idx" ON "resources_report_files" USING btree ("_parent_id");
  CREATE INDEX "resources_report_files_file_idx" ON "resources_report_files" USING btree ("file_id");
  CREATE INDEX "resources_blocks_page_link_order_idx" ON "resources_blocks_page_link" USING btree ("_order");
  CREATE INDEX "resources_blocks_page_link_parent_id_idx" ON "resources_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_page_link_path_idx" ON "resources_blocks_page_link" USING btree ("_path");
  CREATE INDEX "resources_blocks_page_link_page_idx" ON "resources_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "resources_blocks_collection_entry_link_order_idx" ON "resources_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "resources_blocks_collection_entry_link_parent_id_idx" ON "resources_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_collection_entry_link_path_idx" ON "resources_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "resources_blocks_collection_entry_link_collection_entry_idx" ON "resources_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "resources_blocks_external_link_order_idx" ON "resources_blocks_external_link" USING btree ("_order");
  CREATE INDEX "resources_blocks_external_link_parent_id_idx" ON "resources_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "resources_blocks_external_link_path_idx" ON "resources_blocks_external_link" USING btree ("_path");
  CREATE INDEX "resources_image_idx" ON "resources" USING btree ("image_id");
  CREATE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_updated_by_idx" ON "resources" USING btree ("updated_by_id");
  CREATE INDEX "resources_site_idx" ON "resources" USING btree ("site_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "resources" USING btree ("_status");
  CREATE INDEX "resources_rels_order_idx" ON "resources_rels" USING btree ("order");
  CREATE INDEX "resources_rels_parent_idx" ON "resources_rels" USING btree ("parent_id");
  CREATE INDEX "resources_rels_path_idx" ON "resources_rels" USING btree ("path");
  CREATE INDEX "resources_rels_tags_id_idx" ON "resources_rels" USING btree ("tags_id");
  CREATE INDEX "_resources_v_version_report_files_order_idx" ON "_resources_v_version_report_files" USING btree ("_order");
  CREATE INDEX "_resources_v_version_report_files_parent_id_idx" ON "_resources_v_version_report_files" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_version_report_files_file_idx" ON "_resources_v_version_report_files" USING btree ("file_id");
  CREATE INDEX "_resources_v_blocks_page_link_order_idx" ON "_resources_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_page_link_parent_id_idx" ON "_resources_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_page_link_path_idx" ON "_resources_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_resources_v_blocks_page_link_page_idx" ON "_resources_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_order_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_parent_id_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_path_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("_path");
  CREATE INDEX "_resources_v_blocks_collection_entry_link_collection_ent_idx" ON "_resources_v_blocks_collection_entry_link" USING btree ("collection_entry_id");
  CREATE INDEX "_resources_v_blocks_external_link_order_idx" ON "_resources_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_resources_v_blocks_external_link_parent_id_idx" ON "_resources_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_blocks_external_link_path_idx" ON "_resources_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_resources_v_parent_idx" ON "_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_image_idx" ON "_resources_v" USING btree ("version_image_id");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_updated_by_idx" ON "_resources_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_resources_v_version_version_site_idx" ON "_resources_v" USING btree ("version_site_id");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_latest_idx" ON "_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_autosave_idx" ON "_resources_v" USING btree ("autosave");
  CREATE INDEX "_resources_v_rels_order_idx" ON "_resources_v_rels" USING btree ("order");
  CREATE INDEX "_resources_v_rels_parent_idx" ON "_resources_v_rels" USING btree ("parent_id");
  CREATE INDEX "_resources_v_rels_path_idx" ON "_resources_v_rels" USING btree ("path");
  CREATE INDEX "_resources_v_rels_tags_id_idx" ON "_resources_v_rels" USING btree ("tags_id");
  CREATE INDEX "leadership_image_idx" ON "leadership" USING btree ("image_id");
  CREATE INDEX "leadership_site_idx" ON "leadership" USING btree ("site_id");
  CREATE INDEX "leadership_slug_idx" ON "leadership" USING btree ("slug");
  CREATE INDEX "leadership_updated_at_idx" ON "leadership" USING btree ("updated_at");
  CREATE INDEX "leadership_created_at_idx" ON "leadership" USING btree ("created_at");
  CREATE INDEX "leadership__status_idx" ON "leadership" USING btree ("_status");
  CREATE INDEX "_leadership_v_parent_idx" ON "_leadership_v" USING btree ("parent_id");
  CREATE INDEX "_leadership_v_version_version_image_idx" ON "_leadership_v" USING btree ("version_image_id");
  CREATE INDEX "_leadership_v_version_version_site_idx" ON "_leadership_v" USING btree ("version_site_id");
  CREATE INDEX "_leadership_v_version_version_slug_idx" ON "_leadership_v" USING btree ("version_slug");
  CREATE INDEX "_leadership_v_version_version_updated_at_idx" ON "_leadership_v" USING btree ("version_updated_at");
  CREATE INDEX "_leadership_v_version_version_created_at_idx" ON "_leadership_v" USING btree ("version_created_at");
  CREATE INDEX "_leadership_v_version_version__status_idx" ON "_leadership_v" USING btree ("version__status");
  CREATE INDEX "_leadership_v_created_at_idx" ON "_leadership_v" USING btree ("created_at");
  CREATE INDEX "_leadership_v_updated_at_idx" ON "_leadership_v" USING btree ("updated_at");
  CREATE INDEX "_leadership_v_latest_idx" ON "_leadership_v" USING btree ("latest");
  CREATE INDEX "_leadership_v_autosave_idx" ON "_leadership_v" USING btree ("autosave");
  CREATE INDEX "policies_slug_idx" ON "policies" USING btree ("slug");
  CREATE INDEX "policies_site_idx" ON "policies" USING btree ("site_id");
  CREATE INDEX "policies_updated_at_idx" ON "policies" USING btree ("updated_at");
  CREATE INDEX "policies_created_at_idx" ON "policies" USING btree ("created_at");
  CREATE INDEX "policies__status_idx" ON "policies" USING btree ("_status");
  CREATE INDEX "_policies_v_parent_idx" ON "_policies_v" USING btree ("parent_id");
  CREATE INDEX "_policies_v_version_version_slug_idx" ON "_policies_v" USING btree ("version_slug");
  CREATE INDEX "_policies_v_version_version_site_idx" ON "_policies_v" USING btree ("version_site_id");
  CREATE INDEX "_policies_v_version_version_updated_at_idx" ON "_policies_v" USING btree ("version_updated_at");
  CREATE INDEX "_policies_v_version_version_created_at_idx" ON "_policies_v" USING btree ("version_created_at");
  CREATE INDEX "_policies_v_version_version__status_idx" ON "_policies_v" USING btree ("version__status");
  CREATE INDEX "_policies_v_created_at_idx" ON "_policies_v" USING btree ("created_at");
  CREATE INDEX "_policies_v_updated_at_idx" ON "_policies_v" USING btree ("updated_at");
  CREATE INDEX "_policies_v_latest_idx" ON "_policies_v" USING btree ("latest");
  CREATE INDEX "_policies_v_autosave_idx" ON "_policies_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leadership_fk" FOREIGN KEY ("leadership_id") REFERENCES "public"."leadership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_leadership_id_idx" ON "payload_locked_documents_rels" USING btree ("leadership_id");
  CREATE INDEX "payload_locked_documents_rels_policies_id_idx" ON "payload_locked_documents_rels" USING btree ("policies_id");`)
}
