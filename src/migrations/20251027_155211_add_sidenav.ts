import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- Only create enums that don't already exist
  DO $$ BEGIN
   CREATE TYPE "public"."enum_page_menus_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
  CREATE TYPE "public"."sidenav_collection" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
  CREATE TYPE "public"."enum_side_navigation_site_collection_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
  CREATE TYPE "public"."enum__side_navigation_site_collection_v_version_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
  CREATE TYPE "public"."enum_side_navigation_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
  CREATE TYPE "public"."enum__side_navigation_v_version_status" AS ENUM('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  -- Create tables only if they don't exist
  CREATE TABLE IF NOT EXISTS "page_menus_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"page_id" integer NOT NULL,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "page_menus_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "page_menus_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"page" "enum_page_menus_blocks_collection_link_page" NOT NULL,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "page_menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar DEFAULT 'Page Navigation',
  	"enabled" boolean DEFAULT true,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  -- Add sideNavigation field to pages table
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "side_navigation" integer;
  
  -- Add columns to payload_locked_documents_rels if they don't exist
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_menus_id" integer;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END $$;
  
  -- Add foreign key constraints if they don't exist
  DO $$ BEGIN
    ALTER TABLE "page_menus_blocks_page_link" ADD CONSTRAINT "page_menus_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    ALTER TABLE "page_menus_blocks_page_link" ADD CONSTRAINT "page_menus_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    ALTER TABLE "page_menus_blocks_external_link" ADD CONSTRAINT "page_menus_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    ALTER TABLE "page_menus_blocks_collection_link" ADD CONSTRAINT "page_menus_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    ALTER TABLE "page_menus" ADD CONSTRAINT "page_menus_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_side_navigation_page_menus_id_fk" FOREIGN KEY ("side_navigation") REFERENCES "public"."page_menus"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_menus_fk" FOREIGN KEY ("page_menus_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  -- Create indexes if they don't exist
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_order_idx" ON "page_menus_blocks_page_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_parent_id_idx" ON "page_menus_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_path_idx" ON "page_menus_blocks_page_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_page_idx" ON "page_menus_blocks_page_link" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_external_link_order_idx" ON "page_menus_blocks_external_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_external_link_parent_id_idx" ON "page_menus_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_external_link_path_idx" ON "page_menus_blocks_external_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_collection_link_order_idx" ON "page_menus_blocks_collection_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_collection_link_parent_id_idx" ON "page_menus_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_collection_link_path_idx" ON "page_menus_blocks_collection_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "page_menus_site_idx" ON "page_menus" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "page_menus_updated_at_idx" ON "page_menus" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "page_menus_created_at_idx" ON "page_menus" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages_side_navigation_idx" ON "pages" USING btree ("side_navigation");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_page_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("page_menus_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Drop constraints first
  ALTER TABLE "page_menus_blocks_page_link" DROP CONSTRAINT IF EXISTS "page_menus_blocks_page_link_page_id_pages_id_fk";
  ALTER TABLE "page_menus_blocks_page_link" DROP CONSTRAINT IF EXISTS "page_menus_blocks_page_link_parent_id_fk";
  ALTER TABLE "page_menus_blocks_external_link" DROP CONSTRAINT IF EXISTS "page_menus_blocks_external_link_parent_id_fk";
  ALTER TABLE "page_menus_blocks_collection_link" DROP CONSTRAINT IF EXISTS "page_menus_blocks_collection_link_parent_id_fk";
  ALTER TABLE "page_menus" DROP CONSTRAINT IF EXISTS "page_menus_site_id_sites_id_fk";
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_side_navigation_page_menus_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_page_menus_fk";
  
  -- Drop indexes
  DROP INDEX IF EXISTS "page_menus_blocks_page_link_order_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_page_link_parent_id_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_page_link_path_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_page_link_page_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_external_link_order_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_external_link_parent_id_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_external_link_path_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_collection_link_order_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_collection_link_parent_id_idx";
  DROP INDEX IF EXISTS "page_menus_blocks_collection_link_path_idx";
  DROP INDEX IF EXISTS "page_menus_site_idx";
  DROP INDEX IF EXISTS "page_menus_updated_at_idx";
  DROP INDEX IF EXISTS "page_menus_created_at_idx";
  DROP INDEX IF EXISTS "pages_side_navigation_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_page_menus_id_idx";
  
  -- Drop tables
  DROP TABLE IF EXISTS "page_menus_blocks_page_link" CASCADE;
  DROP TABLE IF EXISTS "page_menus_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "page_menus_blocks_collection_link" CASCADE;
  DROP TABLE IF EXISTS "page_menus" CASCADE;
  
  -- Drop columns
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "side_navigation";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "page_menus_id";
  
  -- Drop enums (only the ones we created, not ones used by other tables)
  DROP TYPE IF EXISTS "public"."enum_page_menus_blocks_collection_link_page";
  -- Note: We don't drop sidenav_collection and related enums because they may be used by other tables
  -- from previous migrations (like the side_navigation global tables)`)
}