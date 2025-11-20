import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_site_collection_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_footer_site_collection_identifier_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_site_collection_identity_domain_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_site_collection_primary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_site_collection_secondary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_site_collection_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__footer_site_collection_v_version_identifier_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_site_collection_v_version_identity_domain_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_site_collection_v_version_primary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_site_collection_v_version_secondary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_footer_identifier_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_identity_domain_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_primary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_secondary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum__footer_v_version_identifier_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_v_version_identity_domain_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_v_version_primary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_v_version_secondary_link_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "footer_site_collection_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"image_id" integer
  );

  CREATE TABLE "footer_site_collection_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
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

  CREATE TABLE "footer_site_collection_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "footer_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"domain" varchar,
  	"content" jsonb,
  	"identifier_color" "enum_footer_site_collection_identifier_color" DEFAULT 'gray',
  	"identity_domain_color" "enum_footer_site_collection_identity_domain_color" DEFAULT 'gray',
  	"primary_link_color" "enum_footer_site_collection_primary_link_color" DEFAULT 'gray',
  	"secondary_link_color" "enum_footer_site_collection_secondary_link_color" DEFAULT 'gray',
  	"review_ready" boolean DEFAULT false,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_footer_site_collection_status" DEFAULT 'draft'
  );

  CREATE TABLE "_footer_site_collection_v_version_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );

  CREATE TABLE "_footer_site_collection_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
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

  CREATE TABLE "_footer_site_collection_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_footer_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_domain" varchar,
  	"version_content" jsonb,
  	"version_identifier_color" "enum__footer_site_collection_v_version_identifier_color" DEFAULT 'gray',
  	"version_identity_domain_color" "enum__footer_site_collection_v_version_identity_domain_color" DEFAULT 'gray',
  	"version_primary_link_color" "enum__footer_site_collection_v_version_primary_link_color" DEFAULT 'gray',
  	"version_secondary_link_color" "enum__footer_site_collection_v_version_secondary_link_color" DEFAULT 'gray',
  	"version_review_ready" boolean DEFAULT false,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__footer_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE "footer_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"image_id" integer
  );

  CREATE TABLE "footer_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
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

  CREATE TABLE "footer_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"domain" varchar,
  	"content" jsonb,
  	"identifier_color" "enum_footer_identifier_color" DEFAULT 'gray',
  	"identity_domain_color" "enum_footer_identity_domain_color" DEFAULT 'gray',
  	"primary_link_color" "enum_footer_primary_link_color" DEFAULT 'gray',
  	"secondary_link_color" "enum_footer_secondary_link_color" DEFAULT 'gray',
  	"review_ready" boolean DEFAULT false,
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_footer_v_version_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );

  CREATE TABLE "_footer_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
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

  CREATE TABLE "_footer_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_domain" varchar,
  	"version_content" jsonb,
  	"version_identifier_color" "enum__footer_v_version_identifier_color" DEFAULT 'gray',
  	"version_identity_domain_color" "enum__footer_v_version_identity_domain_color" DEFAULT 'gray',
  	"version_primary_link_color" "enum__footer_v_version_primary_link_color" DEFAULT 'gray',
  	"version_secondary_link_color" "enum__footer_v_version_secondary_link_color" DEFAULT 'gray',
  	"version_review_ready" boolean DEFAULT false,
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "footer_site_collection_id" integer;
  ALTER TABLE "footer_site_collection_logos" ADD CONSTRAINT "footer_site_collection_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_site_collection_logos" ADD CONSTRAINT "footer_site_collection_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_page_link" ADD CONSTRAINT "footer_site_collection_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_page_link" ADD CONSTRAINT "footer_site_collection_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_collection_link" ADD CONSTRAINT "footer_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_external_link" ADD CONSTRAINT "footer_site_collection_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection" ADD CONSTRAINT "footer_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_version_logos" ADD CONSTRAINT "_footer_site_collection_v_version_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_version_logos" ADD CONSTRAINT "_footer_site_collection_v_version_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_page_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_page_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_external_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v" ADD CONSTRAINT "_footer_site_collection_v_parent_id_footer_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v" ADD CONSTRAINT "_footer_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_logos" ADD CONSTRAINT "footer_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_logos" ADD CONSTRAINT "footer_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_page_link" ADD CONSTRAINT "footer_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_blocks_page_link" ADD CONSTRAINT "footer_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_collection_link" ADD CONSTRAINT "footer_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_external_link" ADD CONSTRAINT "footer_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_logos" ADD CONSTRAINT "_footer_v_version_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_version_logos" ADD CONSTRAINT "_footer_v_version_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_page_link" ADD CONSTRAINT "_footer_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_page_link" ADD CONSTRAINT "_footer_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_collection_link" ADD CONSTRAINT "_footer_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_external_link" ADD CONSTRAINT "_footer_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_site_collection_logos_order_idx" ON "footer_site_collection_logos" USING btree ("_order");
  CREATE INDEX "footer_site_collection_logos_parent_id_idx" ON "footer_site_collection_logos" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_logos_image_idx" ON "footer_site_collection_logos" USING btree ("image_id");
  CREATE INDEX "footer_site_collection_blocks_page_link_order_idx" ON "footer_site_collection_blocks_page_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_page_link_parent_id_idx" ON "footer_site_collection_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_page_link_path_idx" ON "footer_site_collection_blocks_page_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_page_link_page_idx" ON "footer_site_collection_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "footer_site_collection_blocks_collection_link_order_idx" ON "footer_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_collection_link_parent_id_idx" ON "footer_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_collection_link_path_idx" ON "footer_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_external_link_order_idx" ON "footer_site_collection_blocks_external_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_external_link_parent_id_idx" ON "footer_site_collection_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_external_link_path_idx" ON "footer_site_collection_blocks_external_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_site_idx" ON "footer_site_collection" USING btree ("site_id");
  CREATE INDEX "footer_site_collection_updated_at_idx" ON "footer_site_collection" USING btree ("updated_at");
  CREATE INDEX "footer_site_collection_created_at_idx" ON "footer_site_collection" USING btree ("created_at");
  CREATE INDEX "footer_site_collection__status_idx" ON "footer_site_collection" USING btree ("_status");
  CREATE INDEX "_footer_site_collection_v_version_logos_order_idx" ON "_footer_site_collection_v_version_logos" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_version_logos_parent_id_idx" ON "_footer_site_collection_v_version_logos" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_version_logos_image_idx" ON "_footer_site_collection_v_version_logos" USING btree ("image_id");
  CREATE INDEX "_footer_site_collection_v_blocks_page_link_order_idx" ON "_footer_site_collection_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_page_link_parent_id_idx" ON "_footer_site_collection_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_page_link_path_idx" ON "_footer_site_collection_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_page_link_page_idx" ON "_footer_site_collection_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_link_order_idx" ON "_footer_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_link_parent_id_idx" ON "_footer_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_collection_link_path_idx" ON "_footer_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_external_link_order_idx" ON "_footer_site_collection_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_external_link_parent_id_idx" ON "_footer_site_collection_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_external_link_path_idx" ON "_footer_site_collection_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_parent_idx" ON "_footer_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_footer_site_collection_v_version_version_site_idx" ON "_footer_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_footer_site_collection_v_version_version_updated_at_idx" ON "_footer_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_footer_site_collection_v_version_version_created_at_idx" ON "_footer_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_footer_site_collection_v_version_version__status_idx" ON "_footer_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_footer_site_collection_v_created_at_idx" ON "_footer_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_footer_site_collection_v_updated_at_idx" ON "_footer_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_footer_site_collection_v_latest_idx" ON "_footer_site_collection_v" USING btree ("latest");
  CREATE INDEX "_footer_site_collection_v_autosave_idx" ON "_footer_site_collection_v" USING btree ("autosave");
  CREATE INDEX "footer_logos_order_idx" ON "footer_logos" USING btree ("_order");
  CREATE INDEX "footer_logos_parent_id_idx" ON "footer_logos" USING btree ("_parent_id");
  CREATE INDEX "footer_logos_image_idx" ON "footer_logos" USING btree ("image_id");
  CREATE INDEX "footer_blocks_page_link_order_idx" ON "footer_blocks_page_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_page_link_parent_id_idx" ON "footer_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_page_link_path_idx" ON "footer_blocks_page_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_page_link_page_idx" ON "footer_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "footer_blocks_collection_link_order_idx" ON "footer_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_collection_link_parent_id_idx" ON "footer_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_collection_link_path_idx" ON "footer_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_external_link_order_idx" ON "footer_blocks_external_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_external_link_parent_id_idx" ON "footer_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_external_link_path_idx" ON "footer_blocks_external_link" USING btree ("_path");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE INDEX "_footer_v_version_logos_order_idx" ON "_footer_v_version_logos" USING btree ("_order");
  CREATE INDEX "_footer_v_version_logos_parent_id_idx" ON "_footer_v_version_logos" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_logos_image_idx" ON "_footer_v_version_logos" USING btree ("image_id");
  CREATE INDEX "_footer_v_blocks_page_link_order_idx" ON "_footer_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_page_link_parent_id_idx" ON "_footer_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_page_link_path_idx" ON "_footer_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_page_link_page_idx" ON "_footer_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_footer_v_blocks_collection_link_order_idx" ON "_footer_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_collection_link_parent_id_idx" ON "_footer_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_collection_link_path_idx" ON "_footer_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_external_link_order_idx" ON "_footer_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_external_link_parent_id_idx" ON "_footer_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_external_link_path_idx" ON "_footer_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_site_collection_fk" FOREIGN KEY ("footer_site_collection_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_footer_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_site_collection_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_site_collection_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_site_collection_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_site_collection_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_site_collection_v_version_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_site_collection_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_site_collection_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_site_collection_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_site_collection_logos" CASCADE;
  DROP TABLE "footer_site_collection_blocks_page_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_external_link" CASCADE;
  DROP TABLE "footer_site_collection" CASCADE;
  DROP TABLE "_footer_site_collection_v_version_logos" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_page_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_external_link" CASCADE;
  DROP TABLE "_footer_site_collection_v" CASCADE;
  DROP TABLE "footer_logos" CASCADE;
  DROP TABLE "footer_blocks_page_link" CASCADE;
  DROP TABLE "footer_blocks_collection_link" CASCADE;
  DROP TABLE "footer_blocks_external_link" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "_footer_v_version_logos" CASCADE;
  DROP TABLE "_footer_v_blocks_page_link" CASCADE;
  DROP TABLE "_footer_v_blocks_collection_link" CASCADE;
  DROP TABLE "_footer_v_blocks_external_link" CASCADE;
  DROP TABLE "_footer_v" CASCADE;

  DROP INDEX IF EXISTS "payload_locked_documents_rels_footer_site_collection_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "footer_site_collection_id";
  DROP TYPE "public"."enum_footer_site_collection_blocks_collection_link_page";
  DROP TYPE "public"."enum_footer_site_collection_identifier_color";
  DROP TYPE "public"."enum_footer_site_collection_identity_domain_color";
  DROP TYPE "public"."enum_footer_site_collection_primary_link_color";
  DROP TYPE "public"."enum_footer_site_collection_secondary_link_color";
  DROP TYPE "public"."enum_footer_site_collection_status";
  DROP TYPE "public"."enum__footer_site_collection_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__footer_site_collection_v_version_identifier_color";
  DROP TYPE "public"."enum__footer_site_collection_v_version_identity_domain_color";
  DROP TYPE "public"."enum__footer_site_collection_v_version_primary_link_color";
  DROP TYPE "public"."enum__footer_site_collection_v_version_secondary_link_color";
  DROP TYPE "public"."enum__footer_site_collection_v_version_status";
  DROP TYPE "public"."enum_footer_blocks_collection_link_page";
  DROP TYPE "public"."enum_footer_identifier_color";
  DROP TYPE "public"."enum_footer_identity_domain_color";
  DROP TYPE "public"."enum_footer_primary_link_color";
  DROP TYPE "public"."enum_footer_secondary_link_color";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__footer_v_version_identifier_color";
  DROP TYPE "public"."enum__footer_v_version_identity_domain_color";
  DROP TYPE "public"."enum__footer_v_version_primary_link_color";
  DROP TYPE "public"."enum__footer_v_version_secondary_link_color";
  DROP TYPE "public"."enum__footer_v_version_status";`)
}
