import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_menu_site_collection_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  CREATE TYPE "public"."enum_menu_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  CREATE TYPE "public"."enum__menu_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_menu_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  CREATE TYPE "public"."enum_menu_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__menu_v_blocks_collection_link_page" AS ENUM('events', 'leadership', 'news', 'posts', 'reports');
  CREATE TYPE "public"."enum__menu_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "menu_site_collection_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "menu_site_collection_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum_menu_site_collection_blocks_collection_link_page",
  	"block_name" varchar
  );

  CREATE TABLE "menu_site_collection_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "menu_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_menu_site_collection_status" DEFAULT 'draft'
  );

  CREATE TABLE "_menu_site_collection_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_menu_site_collection_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum__menu_site_collection_v_blocks_collection_link_page",
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_menu_site_collection_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_menu_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__menu_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE "_menu_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_menu_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum__menu_v_blocks_collection_link_page",
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_menu_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_menu_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__menu_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "collection_landing_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_blocks_dropdown_sub_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "collection_landing_pages" CASCADE;
  DROP TABLE "menu_blocks_dropdown_sub_items" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_collection_landing_pages_fk";

  ALTER TABLE "menu_blocks_collection_link" DROP CONSTRAINT IF EXISTS "menu_blocks_collection_link_page_id_collection_landing_pages_id_fk";

  DROP INDEX "payload_locked_documents_rels_collection_landing_pages_id_idx";
  DROP INDEX "menu_blocks_collection_link_page_idx";
  ALTER TABLE "menu_blocks_page_link" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "menu_blocks_page_link" ALTER COLUMN "page_id" DROP NOT NULL;
  ALTER TABLE "menu_blocks_collection_link" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "menu_site_collection_id" integer;
  ALTER TABLE "menu_blocks_collection_link" ADD COLUMN "page" "enum_menu_blocks_collection_link_page";
  ALTER TABLE "menu" ADD COLUMN "_status" "enum_menu_status" DEFAULT 'draft';
  ALTER TABLE "menu_site_collection_blocks_page_link" ADD CONSTRAINT "menu_site_collection_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_page_link" ADD CONSTRAINT "menu_site_collection_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_collection_link" ADD CONSTRAINT "menu_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_dropdown" ADD CONSTRAINT "menu_site_collection_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_site_collection" ADD CONSTRAINT "menu_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_page_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_page_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_dropdown" ADD CONSTRAINT "_menu_site_collection_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v" ADD CONSTRAINT "_menu_site_collection_v_parent_id_menu_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v" ADD CONSTRAINT "_menu_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_page_link" ADD CONSTRAINT "_menu_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_page_link" ADD CONSTRAINT "_menu_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_collection_link" ADD CONSTRAINT "_menu_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_dropdown" ADD CONSTRAINT "_menu_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "menu_site_collection_blocks_page_link_order_idx" ON "menu_site_collection_blocks_page_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_page_link_parent_id_idx" ON "menu_site_collection_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_page_link_path_idx" ON "menu_site_collection_blocks_page_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_page_link_page_idx" ON "menu_site_collection_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "menu_site_collection_blocks_collection_link_order_idx" ON "menu_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_collection_link_parent_id_idx" ON "menu_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_collection_link_path_idx" ON "menu_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_dropdown_order_idx" ON "menu_site_collection_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_dropdown_parent_id_idx" ON "menu_site_collection_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_dropdown_path_idx" ON "menu_site_collection_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "menu_site_collection_site_idx" ON "menu_site_collection" USING btree ("site_id");
  CREATE INDEX "menu_site_collection_updated_at_idx" ON "menu_site_collection" USING btree ("updated_at");
  CREATE INDEX "menu_site_collection_created_at_idx" ON "menu_site_collection" USING btree ("created_at");
  CREATE INDEX "menu_site_collection__status_idx" ON "menu_site_collection" USING btree ("_status");
  CREATE INDEX "_menu_site_collection_v_blocks_page_link_order_idx" ON "_menu_site_collection_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_page_link_parent_id_idx" ON "_menu_site_collection_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_page_link_path_idx" ON "_menu_site_collection_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_page_link_page_idx" ON "_menu_site_collection_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_link_order_idx" ON "_menu_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_link_parent_id_idx" ON "_menu_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_collection_link_path_idx" ON "_menu_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_dropdown_order_idx" ON "_menu_site_collection_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_dropdown_parent_id_idx" ON "_menu_site_collection_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_dropdown_path_idx" ON "_menu_site_collection_v_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_parent_idx" ON "_menu_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_menu_site_collection_v_version_version_site_idx" ON "_menu_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_menu_site_collection_v_version_version_updated_at_idx" ON "_menu_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_menu_site_collection_v_version_version_created_at_idx" ON "_menu_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_menu_site_collection_v_version_version__status_idx" ON "_menu_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_menu_site_collection_v_created_at_idx" ON "_menu_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_menu_site_collection_v_updated_at_idx" ON "_menu_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_menu_site_collection_v_latest_idx" ON "_menu_site_collection_v" USING btree ("latest");
  CREATE INDEX "_menu_site_collection_v_autosave_idx" ON "_menu_site_collection_v" USING btree ("autosave");
  CREATE INDEX "_menu_v_blocks_page_link_order_idx" ON "_menu_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_page_link_parent_id_idx" ON "_menu_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_page_link_path_idx" ON "_menu_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_page_link_page_idx" ON "_menu_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_menu_v_blocks_collection_link_order_idx" ON "_menu_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_collection_link_parent_id_idx" ON "_menu_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_collection_link_path_idx" ON "_menu_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_dropdown_order_idx" ON "_menu_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_dropdown_parent_id_idx" ON "_menu_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_dropdown_path_idx" ON "_menu_v_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "_menu_v_version_version__status_idx" ON "_menu_v" USING btree ("version__status");
  CREATE INDEX "_menu_v_created_at_idx" ON "_menu_v" USING btree ("created_at");
  CREATE INDEX "_menu_v_updated_at_idx" ON "_menu_v" USING btree ("updated_at");
  CREATE INDEX "_menu_v_latest_idx" ON "_menu_v" USING btree ("latest");
  CREATE INDEX "_menu_v_autosave_idx" ON "_menu_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_site_collection_fk" FOREIGN KEY ("menu_site_collection_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_menu_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_site_collection_id");
  CREATE INDEX "menu__status_idx" ON "menu" USING btree ("_status");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "collection_landing_pages_id";
  ALTER TABLE "menu_blocks_collection_link" DROP COLUMN "page_id";
  ALTER TABLE "menu_blocks_dropdown" DROP COLUMN "label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "collection_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "menu_blocks_dropdown_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"page_id" integer NOT NULL
  );

  ALTER TABLE "menu_site_collection_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_site_collection_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_site_collection_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_site_collection_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_site_collection_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_site_collection_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "menu_site_collection_blocks_page_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "menu_site_collection_blocks_dropdown" CASCADE;
  DROP TABLE "menu_site_collection" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_page_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_dropdown" CASCADE;
  DROP TABLE "_menu_site_collection_v" CASCADE;
  DROP TABLE "_menu_v_blocks_page_link" CASCADE;
  DROP TABLE "_menu_v_blocks_collection_link" CASCADE;
  DROP TABLE "_menu_v_blocks_dropdown" CASCADE;
  DROP TABLE "_menu_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_menu_site_collection_fk";

  DROP INDEX "payload_locked_documents_rels_menu_site_collection_id_idx";
  DROP INDEX "menu__status_idx";
  ALTER TABLE "menu_blocks_page_link" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "menu_blocks_page_link" ALTER COLUMN "page_id" SET NOT NULL;
  ALTER TABLE "menu_blocks_collection_link" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "collection_landing_pages_id" integer;
  ALTER TABLE "menu_blocks_collection_link" ADD COLUMN "page_id" integer NOT NULL;
  ALTER TABLE "menu_blocks_dropdown" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "menu_blocks_dropdown_sub_items" ADD CONSTRAINT "menu_blocks_dropdown_sub_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_blocks_dropdown_sub_items" ADD CONSTRAINT "menu_blocks_dropdown_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_blocks_dropdown"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "collection_landing_pages_slug_idx" ON "collection_landing_pages" USING btree ("slug");
  CREATE INDEX "collection_landing_pages_updated_at_idx" ON "collection_landing_pages" USING btree ("updated_at");
  CREATE INDEX "collection_landing_pages_created_at_idx" ON "collection_landing_pages" USING btree ("created_at");
  CREATE INDEX "menu_blocks_dropdown_sub_items_order_idx" ON "menu_blocks_dropdown_sub_items" USING btree ("_order");
  CREATE INDEX "menu_blocks_dropdown_sub_items_parent_id_idx" ON "menu_blocks_dropdown_sub_items" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_dropdown_sub_items_page_idx" ON "menu_blocks_dropdown_sub_items" USING btree ("page_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collection_landing_pages_fk" FOREIGN KEY ("collection_landing_pages_id") REFERENCES "public"."collection_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_collection_link" ADD CONSTRAINT "menu_blocks_collection_link_page_id_collection_landing_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."collection_landing_pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_collection_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("collection_landing_pages_id");
  CREATE INDEX "menu_blocks_collection_link_page_idx" ON "menu_blocks_collection_link" USING btree ("page_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "menu_site_collection_id";
  ALTER TABLE "menu_blocks_collection_link" DROP COLUMN "page";
  ALTER TABLE "menu" DROP COLUMN "_status";
  DROP TYPE "public"."enum_menu_site_collection_blocks_collection_link_page";
  DROP TYPE "public"."enum_menu_site_collection_status";
  DROP TYPE "public"."enum__menu_site_collection_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__menu_site_collection_v_version_status";
  DROP TYPE "public"."enum_menu_blocks_collection_link_page";
  DROP TYPE "public"."enum_menu_status";
  DROP TYPE "public"."enum__menu_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__menu_v_version_status";`)
}
