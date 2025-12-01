import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_side_navigation_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
  CREATE TYPE "public"."enum__side_navigation_v_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
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
  
  ALTER TABLE IF EXISTS "page_menus_blocks_page_link_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "page_menus_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "page_menus_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "page_menus_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "page_menus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_page_menus_v_blocks_page_link_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_page_menus_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_page_menus_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_page_menus_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_page_menus_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "side_navigation_site_collection_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "side_navigation_site_collection_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "side_navigation_site_collection_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "custom_col_link_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "side_navigation_site_collection_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "side_navigation_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_custom_col_link_v_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_side_navigation_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "side_navigation_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_side_navigation_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  
  -- Drop foreign key constraints first so we can update the data
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_side_navigation_id_page_menus_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_side_navigation_id_page_menus_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_page_menus_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_side_navigation_site_collection_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_page_menus_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_side_navigation_site_collection_id_idx";
  
  -- Add columns to side_navigation first (before data migration)
  DO $$
  BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'side_navigation') THEN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'side_navigation' AND column_name = 'name') THEN
        ALTER TABLE "side_navigation" ADD COLUMN "name" varchar;
      END IF;
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'side_navigation' AND column_name = 'published_at') THEN
        ALTER TABLE "side_navigation" ADD COLUMN "published_at" timestamp(3) with time zone;
      END IF;
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'side_navigation' AND column_name = 'site_id') THEN
        ALTER TABLE "side_navigation" ADD COLUMN "site_id" integer;
      END IF;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_side_navigation_v') THEN
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_side_navigation_v' AND column_name = 'parent_id') THEN
        ALTER TABLE "_side_navigation_v" ADD COLUMN "parent_id" integer;
      END IF;
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_side_navigation_v' AND column_name = 'version_name') THEN
        ALTER TABLE "_side_navigation_v" ADD COLUMN "version_name" varchar;
      END IF;
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_side_navigation_v' AND column_name = 'version_published_at') THEN
        ALTER TABLE "_side_navigation_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
      END IF;
      IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_side_navigation_v' AND column_name = 'version_site_id') THEN
        ALTER TABLE "_side_navigation_v" ADD COLUMN "version_site_id" integer;
      END IF;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payload_locked_documents_rels' AND column_name = 'side_navigation_id') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "side_navigation_id" integer;
    END IF;
  END $$;
  
  -- Migrate data from page_menus to side_navigation BEFORE dropping page_menus
  -- Only run if page_menus table exists (for fresh starts, it might not)
  DO $$
  BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_menus') THEN
      -- First, update existing side_navigation records with data from page_menus (matching by site_id)
      -- Only update if side_navigation has matching site_id or if it's null
      UPDATE "side_navigation" sn
      SET 
        name = pm.name,
        title = pm.title,
        enabled = pm.enabled,
        site_id = pm.site_id,
        published_at = pm.published_at,
        created_at = COALESCE(sn.created_at, pm.created_at),
        updated_at = pm.updated_at,
        _status = pm._status::text::enum_side_navigation_status
      FROM "page_menus" pm
      WHERE (sn.site_id = pm.site_id OR sn.site_id IS NULL)
      AND pm.site_id IS NOT NULL;
      
      -- Insert any page_menus records that don't have a matching side_navigation by site_id
      INSERT INTO "side_navigation" (id, name, title, enabled, site_id, published_at, created_at, updated_at, _status)
      SELECT pm.id, pm.name, pm.title, pm.enabled, pm.site_id, pm.published_at, pm.created_at, pm.updated_at, pm._status::text::enum_side_navigation_status
      FROM "page_menus" pm
      WHERE NOT EXISTS (
        SELECT 1 FROM "side_navigation" sn 
        WHERE sn.site_id = pm.site_id AND pm.site_id IS NOT NULL
      )
      ON CONFLICT (id) DO NOTHING;
      
      -- Update pages.side_navigation_id to point to side_navigation records
      -- Match by site_id: find the side_navigation for the same site
      UPDATE "pages" p
      SET "side_navigation_id" = (
        SELECT sn.id FROM "side_navigation" sn
        WHERE sn.site_id = p.site_id
        LIMIT 1
      )
      WHERE "side_navigation_id" IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM "page_menus" pm 
        WHERE pm.id = p."side_navigation_id"
      )
      AND EXISTS (
        SELECT 1 FROM "side_navigation" sn WHERE sn.site_id = p.site_id
      );
      
      -- Set any remaining invalid references to NULL (if no matching side_navigation found)
      UPDATE "pages"
      SET "side_navigation_id" = NULL
      WHERE "side_navigation_id" IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM "page_menus" pm WHERE pm.id = "pages"."side_navigation_id"
      )
      AND NOT EXISTS (
        SELECT 1 FROM "side_navigation" sn WHERE sn.site_id = "pages".site_id
      );
      
      -- Update version table as well
      UPDATE "_pages_v" pv
      SET "version_side_navigation_id" = (
        SELECT sn.id FROM "side_navigation" sn
        INNER JOIN "pages" p ON p.id = pv.parent_id
        WHERE sn.site_id = p.site_id
        LIMIT 1
      )
      WHERE "version_side_navigation_id" IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM "page_menus" pm 
        WHERE pm.id = pv."version_side_navigation_id"
      )
      AND EXISTS (
        SELECT 1 FROM "side_navigation" sn 
        INNER JOIN "pages" p ON p.id = pv.parent_id
        WHERE sn.site_id = p.site_id
      );
      
      UPDATE "_pages_v" pv
      SET "version_side_navigation_id" = NULL
      WHERE "version_side_navigation_id" IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM "page_menus" pm WHERE pm.id = pv."version_side_navigation_id"
      )
      AND NOT EXISTS (
        SELECT 1 FROM "side_navigation" sn 
        INNER JOIN "pages" p ON p.id = pv.parent_id
        WHERE sn.site_id = p.site_id
      );
      
      -- Update payload_locked_documents_rels - copy page_menus_id to side_navigation_id
      UPDATE "payload_locked_documents_rels" rels
      SET "side_navigation_id" = rels."page_menus_id"
      WHERE "page_menus_id" IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM "side_navigation" sn WHERE sn.id = rels."page_menus_id"
      );
    END IF;
  END $$;
  
  -- Now drop the old tables
  DROP TABLE IF EXISTS "page_menus_blocks_page_link_2" CASCADE;
  DROP TABLE IF EXISTS "page_menus_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "page_menus_blocks_page_link" CASCADE;
  DROP TABLE IF EXISTS "page_menus_blocks_collection_link" CASCADE;
  DROP TABLE IF EXISTS "page_menus" CASCADE;
  DROP TABLE IF EXISTS "_page_menus_v_blocks_page_link_2" CASCADE;
  DROP TABLE IF EXISTS "_page_menus_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_page_menus_v_blocks_page_link" CASCADE;
  DROP TABLE IF EXISTS "_page_menus_v_blocks_collection_link" CASCADE;
  DROP TABLE IF EXISTS "_page_menus_v" CASCADE;
  DROP TABLE IF EXISTS "side_navigation_site_collection_blocks_page_link" CASCADE;
  DROP TABLE IF EXISTS "side_navigation_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE IF EXISTS "side_navigation_site_collection_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "custom_col_link_2" CASCADE;
  DROP TABLE IF EXISTS "side_navigation_site_collection_blocks_dropdown" CASCADE;
  DROP TABLE IF EXISTS "side_navigation_site_collection" CASCADE;
  DROP TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_page_link" CASCADE;
  DROP TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_external_link" CASCADE;
  DROP TABLE IF EXISTS "_custom_col_link_v_2" CASCADE;
  DROP TABLE IF EXISTS "_side_navigation_site_collection_v_blocks_dropdown" CASCADE;
  DROP TABLE IF EXISTS "_side_navigation_site_collection_v" CASCADE;
  DROP TABLE IF EXISTS "side_navigation_blocks_dropdown" CASCADE;
  DROP TABLE IF EXISTS "_side_navigation_v_blocks_dropdown" CASCADE;
  ALTER TABLE "side_navigation_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."enum_side_navigation_blocks_collection_link_page" USING "page"::text::"public"."enum_side_navigation_blocks_collection_link_page";
  ALTER TABLE "side_navigation" ALTER COLUMN "updated_at" SET DEFAULT now();
  ALTER TABLE "side_navigation" ALTER COLUMN "updated_at" SET NOT NULL;
  ALTER TABLE "side_navigation" ALTER COLUMN "created_at" SET DEFAULT now();
  ALTER TABLE "side_navigation" ALTER COLUMN "created_at" SET NOT NULL;
  ALTER TABLE "_side_navigation_v_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."enum__side_navigation_v_blocks_collection_link_page" USING "page"::text::"public"."enum__side_navigation_v_blocks_collection_link_page";
  ALTER TABLE "side_navigation_blocks_page_link_2" ADD CONSTRAINT "side_navigation_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_page_link_2" ADD CONSTRAINT "side_navigation_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_page_link_2" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_page_link_2" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "side_navigation_blocks_page_link_2_order_idx" ON "side_navigation_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_page_link_2_parent_id_idx" ON "side_navigation_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_page_link_2_path_idx" ON "side_navigation_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX "side_navigation_blocks_page_link_2_page_idx" ON "side_navigation_blocks_page_link_2" USING btree ("page_id");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_order_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_parent_id_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_path_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_page_link_2_page_idx" ON "_side_navigation_v_blocks_page_link_2" USING btree ("page_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("version_side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_side_navigation_fk" FOREIGN KEY ("side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation" ADD CONSTRAINT "side_navigation_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_v" ADD CONSTRAINT "_side_navigation_v_parent_id_side_navigation_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_v" ADD CONSTRAINT "_side_navigation_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_side_navigation_id_idx" ON "payload_locked_documents_rels" USING btree ("side_navigation_id");
  CREATE INDEX "side_navigation_site_idx" ON "side_navigation" USING btree ("site_id");
  CREATE INDEX "side_navigation_updated_at_idx" ON "side_navigation" USING btree ("updated_at");
  CREATE INDEX "side_navigation_created_at_idx" ON "side_navigation" USING btree ("created_at");
  CREATE INDEX "_side_navigation_v_parent_idx" ON "_side_navigation_v" USING btree ("parent_id");
  CREATE INDEX "_side_navigation_v_version_version_site_idx" ON "_side_navigation_v" USING btree ("version_site_id");
  CREATE INDEX "_side_navigation_v_version_version_updated_at_idx" ON "_side_navigation_v" USING btree ("version_updated_at");
  CREATE INDEX "_side_navigation_v_version_version_created_at_idx" ON "_side_navigation_v" USING btree ("version_created_at");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "page_menus_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "side_navigation_site_collection_id";
  ALTER TABLE "side_navigation" DROP COLUMN IF EXISTS "fallback_to_all_pages";
  ALTER TABLE "_side_navigation_v" DROP COLUMN IF EXISTS "version_fallback_to_all_pages";
  DROP TYPE IF EXISTS "public"."enum_page_menus_blocks_collection_link_page";
  DROP TYPE IF EXISTS "public"."enum_page_menus_status";
  DROP TYPE IF EXISTS "public"."enum__page_menus_v_blocks_collection_link_page";
  DROP TYPE IF EXISTS "public"."enum__page_menus_v_version_status";
  DROP TYPE IF EXISTS "public"."sidenav_collection";
  DROP TYPE IF EXISTS "public"."enum_side_navigation_site_collection_status";
  DROP TYPE IF EXISTS "public"."enum__side_navigation_site_collection_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_page_menus_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
  CREATE TYPE "public"."enum_page_menus_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__page_menus_v_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
  CREATE TYPE "public"."enum__page_menus_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."sidenav_collection" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
  CREATE TYPE "public"."enum_side_navigation_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__side_navigation_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "page_menus_blocks_page_link_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_menus_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_menus_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_menus_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum_page_menus_blocks_collection_link_page",
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "page_menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar DEFAULT 'Page Navigation',
  	"enabled" boolean DEFAULT true,
  	"review_ready" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_page_menus_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_page_menus_v_blocks_page_link_2" (
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
  
  CREATE TABLE "_page_menus_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_page_menus_v_blocks_page_link" (
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
  
  CREATE TABLE "_page_menus_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum__page_menus_v_blocks_collection_link_page",
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_page_menus_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_title" varchar DEFAULT 'Page Navigation',
  	"version_enabled" boolean DEFAULT true,
  	"version_review_ready" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__page_menus_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "side_navigation_site_collection_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "custom_col_link_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "side_navigation_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar DEFAULT 'Page Navigation',
  	"fallback_to_all_pages" boolean DEFAULT false,
  	"review_ready" boolean DEFAULT false,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_side_navigation_site_collection_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_custom_col_link_v_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_enabled" boolean DEFAULT true,
  	"version_title" varchar DEFAULT 'Page Navigation',
  	"version_fallback_to_all_pages" boolean DEFAULT false,
  	"version_review_ready" boolean DEFAULT false,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__side_navigation_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "side_navigation_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "_side_navigation_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE IF EXISTS "side_navigation_blocks_page_link_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "_side_navigation_v_blocks_page_link_2" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "side_navigation_blocks_page_link_2" CASCADE;
  DROP TABLE IF EXISTS "_side_navigation_v_blocks_page_link_2" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_side_navigation_id_side_navigation_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_side_navigation_id_side_navigation_id_fk";
  
  ALTER TABLE "side_navigation" DROP CONSTRAINT IF EXISTS "side_navigation_site_id_sites_id_fk";
  
  ALTER TABLE "_side_navigation_v" DROP CONSTRAINT IF EXISTS "_side_navigation_v_parent_id_side_navigation_id_fk";
  
  ALTER TABLE "_side_navigation_v" DROP CONSTRAINT IF EXISTS "_side_navigation_v_version_site_id_sites_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_side_navigation_fk";
  
  DROP INDEX IF EXISTS "side_navigation_site_idx";
  DROP INDEX IF EXISTS "side_navigation_updated_at_idx";
  DROP INDEX IF EXISTS "side_navigation_created_at_idx";
  DROP INDEX IF EXISTS "_side_navigation_v_parent_idx";
  DROP INDEX IF EXISTS "_side_navigation_v_version_version_site_idx";
  DROP INDEX IF EXISTS "_side_navigation_v_version_version_updated_at_idx";
  DROP INDEX IF EXISTS "_side_navigation_v_version_version_created_at_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_side_navigation_id_idx";
  ALTER TABLE "side_navigation_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."sidenav_collection" USING "page"::text::"public"."sidenav_collection";
  ALTER TABLE "side_navigation" ALTER COLUMN "updated_at" DROP DEFAULT;
  ALTER TABLE "side_navigation" ALTER COLUMN "updated_at" DROP NOT NULL;
  ALTER TABLE "side_navigation" ALTER COLUMN "created_at" DROP DEFAULT;
  ALTER TABLE "side_navigation" ALTER COLUMN "created_at" DROP NOT NULL;
  ALTER TABLE "_side_navigation_v_blocks_collection_link" ALTER COLUMN "page" SET DATA TYPE "public"."sidenav_collection" USING "page"::text::"public"."sidenav_collection";
  ALTER TABLE "side_navigation" ADD COLUMN "fallback_to_all_pages" boolean DEFAULT false;
  ALTER TABLE "_side_navigation_v" ADD COLUMN "version_fallback_to_all_pages" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_menus_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "side_navigation_site_collection_id" integer;
  ALTER TABLE "page_menus_blocks_page_link_2" ADD CONSTRAINT "page_menus_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_menus_blocks_page_link_2" ADD CONSTRAINT "page_menus_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_menus_blocks_external_link" ADD CONSTRAINT "page_menus_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_menus_blocks_page_link" ADD CONSTRAINT "page_menus_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_menus_blocks_page_link" ADD CONSTRAINT "page_menus_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_menus_blocks_collection_link" ADD CONSTRAINT "page_menus_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_menus" ADD CONSTRAINT "page_menus_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_menus_v_blocks_page_link_2" ADD CONSTRAINT "_page_menus_v_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_menus_v_blocks_page_link_2" ADD CONSTRAINT "_page_menus_v_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_menus_v_blocks_external_link" ADD CONSTRAINT "_page_menus_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_menus_v_blocks_page_link" ADD CONSTRAINT "_page_menus_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_menus_v_blocks_page_link" ADD CONSTRAINT "_page_menus_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_menus_v_blocks_collection_link" ADD CONSTRAINT "_page_menus_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_page_menus_v" ADD CONSTRAINT "_page_menus_v_parent_id_page_menus_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_page_menus_v" ADD CONSTRAINT "_page_menus_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_page_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_page_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_collection_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_external_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_col_link_2" ADD CONSTRAINT "custom_col_link_2_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_col_link_2" ADD CONSTRAINT "custom_col_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection_blocks_dropdown" ADD CONSTRAINT "side_navigation_site_collection_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "side_navigation_site_collection" ADD CONSTRAINT "side_navigation_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_external_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v_2" ADD CONSTRAINT "_custom_col_link_v_2_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v_2" ADD CONSTRAINT "_custom_col_link_v_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_dropdown" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v" ADD CONSTRAINT "_side_navigation_site_collection_v_parent_id_side_navigation_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_side_navigation_site_collection_v" ADD CONSTRAINT "_side_navigation_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "side_navigation_blocks_dropdown" ADD CONSTRAINT "side_navigation_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_side_navigation_v_blocks_dropdown" ADD CONSTRAINT "_side_navigation_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_menus_blocks_page_link_2_order_idx" ON "page_menus_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX "page_menus_blocks_page_link_2_parent_id_idx" ON "page_menus_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX "page_menus_blocks_page_link_2_path_idx" ON "page_menus_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX "page_menus_blocks_page_link_2_page_idx" ON "page_menus_blocks_page_link_2" USING btree ("page_id");
  CREATE INDEX "page_menus_blocks_external_link_order_idx" ON "page_menus_blocks_external_link" USING btree ("_order");
  CREATE INDEX "page_menus_blocks_external_link_parent_id_idx" ON "page_menus_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "page_menus_blocks_external_link_path_idx" ON "page_menus_blocks_external_link" USING btree ("_path");
  CREATE INDEX "page_menus_blocks_page_link_order_idx" ON "page_menus_blocks_page_link" USING btree ("_order");
  CREATE INDEX "page_menus_blocks_page_link_parent_id_idx" ON "page_menus_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "page_menus_blocks_page_link_path_idx" ON "page_menus_blocks_page_link" USING btree ("_path");
  CREATE INDEX "page_menus_blocks_page_link_page_idx" ON "page_menus_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "page_menus_blocks_collection_link_order_idx" ON "page_menus_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "page_menus_blocks_collection_link_parent_id_idx" ON "page_menus_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "page_menus_blocks_collection_link_path_idx" ON "page_menus_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "page_menus_site_idx" ON "page_menus" USING btree ("site_id");
  CREATE INDEX "page_menus_updated_at_idx" ON "page_menus" USING btree ("updated_at");
  CREATE INDEX "page_menus_created_at_idx" ON "page_menus" USING btree ("created_at");
  CREATE INDEX "page_menus__status_idx" ON "page_menus" USING btree ("_status");
  CREATE INDEX "_page_menus_v_blocks_page_link_2_order_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX "_page_menus_v_blocks_page_link_2_parent_id_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX "_page_menus_v_blocks_page_link_2_path_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX "_page_menus_v_blocks_page_link_2_page_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("page_id");
  CREATE INDEX "_page_menus_v_blocks_external_link_order_idx" ON "_page_menus_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_page_menus_v_blocks_external_link_parent_id_idx" ON "_page_menus_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_page_menus_v_blocks_external_link_path_idx" ON "_page_menus_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_page_menus_v_blocks_page_link_order_idx" ON "_page_menus_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_page_menus_v_blocks_page_link_parent_id_idx" ON "_page_menus_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_page_menus_v_blocks_page_link_path_idx" ON "_page_menus_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_page_menus_v_blocks_page_link_page_idx" ON "_page_menus_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_page_menus_v_blocks_collection_link_order_idx" ON "_page_menus_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_page_menus_v_blocks_collection_link_parent_id_idx" ON "_page_menus_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_page_menus_v_blocks_collection_link_path_idx" ON "_page_menus_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_page_menus_v_parent_idx" ON "_page_menus_v" USING btree ("parent_id");
  CREATE INDEX "_page_menus_v_version_version_site_idx" ON "_page_menus_v" USING btree ("version_site_id");
  CREATE INDEX "_page_menus_v_version_version_updated_at_idx" ON "_page_menus_v" USING btree ("version_updated_at");
  CREATE INDEX "_page_menus_v_version_version_created_at_idx" ON "_page_menus_v" USING btree ("version_created_at");
  CREATE INDEX "_page_menus_v_version_version__status_idx" ON "_page_menus_v" USING btree ("version__status");
  CREATE INDEX "_page_menus_v_created_at_idx" ON "_page_menus_v" USING btree ("created_at");
  CREATE INDEX "_page_menus_v_updated_at_idx" ON "_page_menus_v" USING btree ("updated_at");
  CREATE INDEX "_page_menus_v_latest_idx" ON "_page_menus_v" USING btree ("latest");
  CREATE INDEX "_page_menus_v_autosave_idx" ON "_page_menus_v" USING btree ("autosave");
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_order_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_parent_id_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_path_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_path");
  CREATE INDEX "side_navigation_site_collection_blocks_page_link_page_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "side_navigation_site_collection_blocks_collection_link_order_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_collection_link_parent_id_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_collection_link_path_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "side_navigation_site_collection_blocks_external_link_order_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_external_link_parent_id_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_external_link_path_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_path");
  CREATE INDEX "custom_col_link_2_order_idx" ON "custom_col_link_2" USING btree ("_order");
  CREATE INDEX "custom_col_link_2_parent_id_idx" ON "custom_col_link_2" USING btree ("_parent_id");
  CREATE INDEX "custom_col_link_2_path_idx" ON "custom_col_link_2" USING btree ("_path");
  CREATE INDEX "custom_col_link_2_custom_collection_idx" ON "custom_col_link_2" USING btree ("custom_collection_id");
  CREATE INDEX "side_navigation_site_collection_blocks_dropdown_order_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "side_navigation_site_collection_blocks_dropdown_parent_id_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_site_collection_blocks_dropdown_path_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "side_navigation_site_collection_site_idx" ON "side_navigation_site_collection" USING btree ("site_id");
  CREATE INDEX "side_navigation_site_collection_updated_at_idx" ON "side_navigation_site_collection" USING btree ("updated_at");
  CREATE INDEX "side_navigation_site_collection_created_at_idx" ON "side_navigation_site_collection" USING btree ("created_at");
  CREATE INDEX "side_navigation_site_collection__status_idx" ON "side_navigation_site_collection" USING btree ("_status");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_order_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_path_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_page_link_page_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_collection_link_order_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_collection_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_collection_link_path_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_external_link_order_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_external_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_external_link_path_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX "_custom_col_link_v_2_order_idx" ON "_custom_col_link_v_2" USING btree ("_order");
  CREATE INDEX "_custom_col_link_v_2_parent_id_idx" ON "_custom_col_link_v_2" USING btree ("_parent_id");
  CREATE INDEX "_custom_col_link_v_2_path_idx" ON "_custom_col_link_v_2" USING btree ("_path");
  CREATE INDEX "_custom_col_link_v_2_custom_collection_idx" ON "_custom_col_link_v_2" USING btree ("custom_collection_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_dropdown_order_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_dropdown_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_blocks_dropdown_path_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "_side_navigation_site_collection_v_parent_idx" ON "_side_navigation_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_side_navigation_site_collection_v_version_version_site_idx" ON "_side_navigation_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_side_navigation_site_collection_v_version_version_updated_at_idx" ON "_side_navigation_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_side_navigation_site_collection_v_version_version_created_at_idx" ON "_side_navigation_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_side_navigation_site_collection_v_version_version__status_idx" ON "_side_navigation_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_side_navigation_site_collection_v_created_at_idx" ON "_side_navigation_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_side_navigation_site_collection_v_updated_at_idx" ON "_side_navigation_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_side_navigation_site_collection_v_latest_idx" ON "_side_navigation_site_collection_v" USING btree ("latest");
  CREATE INDEX "_side_navigation_site_collection_v_autosave_idx" ON "_side_navigation_site_collection_v" USING btree ("autosave");
  CREATE INDEX "side_navigation_blocks_dropdown_order_idx" ON "side_navigation_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "side_navigation_blocks_dropdown_parent_id_idx" ON "side_navigation_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "side_navigation_blocks_dropdown_path_idx" ON "side_navigation_blocks_dropdown" USING btree ("_path");
  CREATE INDEX "_side_navigation_v_blocks_dropdown_order_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX "_side_navigation_v_blocks_dropdown_parent_id_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX "_side_navigation_v_blocks_dropdown_path_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_path");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_side_navigation_id_page_menus_id_fk" FOREIGN KEY ("side_navigation_id") REFERENCES "public"."page_menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_side_navigation_id_page_menus_id_fk" FOREIGN KEY ("version_side_navigation_id") REFERENCES "public"."page_menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_menus_fk" FOREIGN KEY ("page_menus_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_side_navigation_site_collection_fk" FOREIGN KEY ("side_navigation_site_collection_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("page_menus_id");
  CREATE INDEX "payload_locked_documents_rels_side_navigation_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("side_navigation_site_collection_id");
  ALTER TABLE "side_navigation" DROP COLUMN IF EXISTS "name";
  ALTER TABLE "side_navigation" DROP COLUMN IF EXISTS "published_at";
  ALTER TABLE "side_navigation" DROP COLUMN IF EXISTS "site_id";
  ALTER TABLE "_side_navigation_v" DROP COLUMN IF EXISTS "parent_id";
  ALTER TABLE "_side_navigation_v" DROP COLUMN IF EXISTS "version_name";
  ALTER TABLE "_side_navigation_v" DROP COLUMN IF EXISTS "version_published_at";
  ALTER TABLE "_side_navigation_v" DROP COLUMN IF EXISTS "version_site_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "side_navigation_id";
  DROP TYPE IF EXISTS "public"."enum_side_navigation_blocks_collection_link_page";
  DROP TYPE IF EXISTS "public"."enum__side_navigation_v_blocks_collection_link_page";`)
}
