import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_page_menus_blocks_collection_link_page') THEN
       CREATE TYPE "public"."enum_page_menus_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_page_menus_status') THEN
       CREATE TYPE "public"."enum_page_menus_status" AS ENUM('draft', 'published');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__page_menus_v_blocks_collection_link_page') THEN
       CREATE TYPE "public"."enum__page_menus_v_blocks_collection_link_page" AS ENUM('posts', 'events', 'news', 'reports', 'resources', 'leadership');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__page_menus_v_version_status') THEN
       CREATE TYPE "public"."enum__page_menus_v_version_status" AS ENUM('draft', 'published');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sidenav_collection') THEN
       CREATE TYPE "public"."sidenav_collection" AS ENUM('events', 'leadership', 'news', 'posts', 'reports', 'resources');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_side_navigation_site_collection_status') THEN
       CREATE TYPE "public"."enum_side_navigation_site_collection_status" AS ENUM('draft', 'published');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__side_navigation_site_collection_v_version_status') THEN
       CREATE TYPE "public"."enum__side_navigation_site_collection_v_version_status" AS ENUM('draft', 'published');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_side_navigation_status') THEN
       CREATE TYPE "public"."enum_side_navigation_status" AS ENUM('draft', 'published');
     END IF;
   END $$;
   
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__side_navigation_v_version_status') THEN
       CREATE TYPE "public"."enum__side_navigation_v_version_status" AS ENUM('draft', 'published');
     END IF;
   END $$;
   
  CREATE TABLE IF NOT EXISTS "page_menus_blocks_page_link_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "page_menus_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "page_menus_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page_id" integer,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "page_menus_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"page" "enum_page_menus_blocks_collection_link_page",
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "page_menus" (
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

  CREATE TABLE IF NOT EXISTS "_page_menus_v_blocks_page_link_2" (
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

  CREATE TABLE IF NOT EXISTS "_page_menus_v_blocks_external_link" (
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

  CREATE TABLE IF NOT EXISTS "_page_menus_v_blocks_page_link" (
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

  CREATE TABLE IF NOT EXISTS "_page_menus_v_blocks_collection_link" (
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

  CREATE TABLE IF NOT EXISTS "_page_menus_v" (
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

  CREATE TABLE IF NOT EXISTS "side_navigation_site_collection_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_site_collection_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_site_collection_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_site_collection_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar DEFAULT 'Page Navigation',
  	"fallback_to_all_pages" boolean DEFAULT false,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_side_navigation_site_collection_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_side_navigation_site_collection_v_blocks_page_link" (
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

  CREATE TABLE IF NOT EXISTS "_side_navigation_site_collection_v_blocks_collection_link" (
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

  CREATE TABLE IF NOT EXISTS "_side_navigation_site_collection_v_blocks_external_link" (
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

  CREATE TABLE IF NOT EXISTS "_side_navigation_site_collection_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_side_navigation_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_enabled" boolean DEFAULT true,
  	"version_title" varchar DEFAULT 'Page Navigation',
  	"version_fallback_to_all_pages" boolean DEFAULT false,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__side_navigation_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_blocks_page_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_blocks_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "sidenav_collection",
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_blocks_external_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "side_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar DEFAULT 'Page Navigation',
  	"fallback_to_all_pages" boolean DEFAULT false,
  	"_status" "enum_side_navigation_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "_side_navigation_v_blocks_page_link" (
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

  CREATE TABLE IF NOT EXISTS "_side_navigation_v_blocks_collection_link" (
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

  CREATE TABLE IF NOT EXISTS "_side_navigation_v_blocks_external_link" (
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

  CREATE TABLE IF NOT EXISTS "_side_navigation_v_blocks_dropdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"order" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_side_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_title" varchar DEFAULT 'Page Navigation',
  	"version_fallback_to_all_pages" boolean DEFAULT false,
  	"version__status" "enum__side_navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pages' AND column_name='side_navigation_id') THEN
      ALTER TABLE "pages" ADD COLUMN "side_navigation_id" integer;
    END IF;
  END $$;
  
  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_pages_v' AND column_name='version_side_navigation_id') THEN
      ALTER TABLE "_pages_v" ADD COLUMN "version_side_navigation_id" integer;
    END IF;
  END $$;
  
  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payload_locked_documents_rels' AND column_name='page_menus_id') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_menus_id" integer;
    END IF;
  END $$;
  
  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payload_locked_documents_rels' AND column_name='side_navigation_site_collection_id') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "side_navigation_site_collection_id" integer;
    END IF;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "page_menus_blocks_page_link_2" ADD CONSTRAINT "page_menus_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "page_menus_blocks_page_link_2" ADD CONSTRAINT "page_menus_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "page_menus_blocks_external_link" ADD CONSTRAINT "page_menus_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

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
   ALTER TABLE "_page_menus_v_blocks_page_link_2" ADD CONSTRAINT "_page_menus_v_blocks_page_link_2_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_page_menus_v_blocks_page_link_2" ADD CONSTRAINT "_page_menus_v_blocks_page_link_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_page_menus_v_blocks_external_link" ADD CONSTRAINT "_page_menus_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_page_menus_v_blocks_page_link" ADD CONSTRAINT "_page_menus_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_page_menus_v_blocks_page_link" ADD CONSTRAINT "_page_menus_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_page_menus_v_blocks_collection_link" ADD CONSTRAINT "_page_menus_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_page_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_page_menus_v" ADD CONSTRAINT "_page_menus_v_parent_id_page_menus_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."page_menus"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_page_menus_v" ADD CONSTRAINT "_page_menus_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_site_collection_blocks_page_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_site_collection_blocks_page_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_site_collection_blocks_collection_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_site_collection_blocks_external_link" ADD CONSTRAINT "side_navigation_site_collection_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_site_collection_blocks_dropdown" ADD CONSTRAINT "side_navigation_site_collection_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_site_collection" ADD CONSTRAINT "side_navigation_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_site_collection_v_blocks_collection_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_site_collection_v_blocks_external_link" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_site_collection_v_blocks_dropdown" ADD CONSTRAINT "_side_navigation_site_collection_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_site_collection_v" ADD CONSTRAINT "_side_navigation_site_collection_v_parent_id_side_navigation_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_site_collection_v" ADD CONSTRAINT "_side_navigation_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_blocks_page_link" ADD CONSTRAINT "side_navigation_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_blocks_page_link" ADD CONSTRAINT "side_navigation_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_blocks_collection_link" ADD CONSTRAINT "side_navigation_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_blocks_external_link" ADD CONSTRAINT "side_navigation_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "side_navigation_blocks_dropdown" ADD CONSTRAINT "side_navigation_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."side_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_v_blocks_page_link" ADD CONSTRAINT "_side_navigation_v_blocks_page_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_v_blocks_collection_link" ADD CONSTRAINT "_side_navigation_v_blocks_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_v_blocks_external_link" ADD CONSTRAINT "_side_navigation_v_blocks_external_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_side_navigation_v_blocks_dropdown" ADD CONSTRAINT "_side_navigation_v_blocks_dropdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_side_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_2_order_idx" ON "page_menus_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_2_parent_id_idx" ON "page_menus_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_2_path_idx" ON "page_menus_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_2_page_idx" ON "page_menus_blocks_page_link_2" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_external_link_order_idx" ON "page_menus_blocks_external_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_external_link_parent_id_idx" ON "page_menus_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_external_link_path_idx" ON "page_menus_blocks_external_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_order_idx" ON "page_menus_blocks_page_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_parent_id_idx" ON "page_menus_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_path_idx" ON "page_menus_blocks_page_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_page_link_page_idx" ON "page_menus_blocks_page_link" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_collection_link_order_idx" ON "page_menus_blocks_collection_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_collection_link_parent_id_idx" ON "page_menus_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_menus_blocks_collection_link_path_idx" ON "page_menus_blocks_collection_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "page_menus_site_idx" ON "page_menus" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "page_menus_updated_at_idx" ON "page_menus" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "page_menus_created_at_idx" ON "page_menus" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "page_menus__status_idx" ON "page_menus" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_2_order_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_2_parent_id_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_2_path_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_2_page_idx" ON "_page_menus_v_blocks_page_link_2" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_external_link_order_idx" ON "_page_menus_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_external_link_parent_id_idx" ON "_page_menus_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_external_link_path_idx" ON "_page_menus_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_order_idx" ON "_page_menus_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_parent_id_idx" ON "_page_menus_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_path_idx" ON "_page_menus_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_page_link_page_idx" ON "_page_menus_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_collection_link_order_idx" ON "_page_menus_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_collection_link_parent_id_idx" ON "_page_menus_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_blocks_collection_link_path_idx" ON "_page_menus_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_parent_idx" ON "_page_menus_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_version_version_site_idx" ON "_page_menus_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_version_version_updated_at_idx" ON "_page_menus_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_version_version_created_at_idx" ON "_page_menus_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_version_version__status_idx" ON "_page_menus_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_created_at_idx" ON "_page_menus_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_updated_at_idx" ON "_page_menus_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_latest_idx" ON "_page_menus_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_page_menus_v_autosave_idx" ON "_page_menus_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_page_link_order_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_page_link_parent_id_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_page_link_path_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_page_link_page_idx" ON "side_navigation_site_collection_blocks_page_link" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_collection_link_order_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_collection_link_parent_id_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_collection_link_path_idx" ON "side_navigation_site_collection_blocks_collection_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_external_link_order_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_external_link_parent_id_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_external_link_path_idx" ON "side_navigation_site_collection_blocks_external_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_dropdown_order_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_dropdown_parent_id_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_blocks_dropdown_path_idx" ON "side_navigation_site_collection_blocks_dropdown" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_site_idx" ON "side_navigation_site_collection" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_updated_at_idx" ON "side_navigation_site_collection" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection_created_at_idx" ON "side_navigation_site_collection" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "side_navigation_site_collection__status_idx" ON "side_navigation_site_collection" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_page_link_order_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_page_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_page_link_path_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_page_link_page_idx" ON "_side_navigation_site_collection_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_collection_link_order_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_collection_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_collection_link_path_idx" ON "_side_navigation_site_collection_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_external_link_order_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_external_link_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_external_link_path_idx" ON "_side_navigation_site_collection_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_dropdown_order_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_dropdown_parent_id_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_blocks_dropdown_path_idx" ON "_side_navigation_site_collection_v_blocks_dropdown" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_parent_idx" ON "_side_navigation_site_collection_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_version_version_site_idx" ON "_side_navigation_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_version_version_updated_at_idx" ON "_side_navigation_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_version_version_created_at_idx" ON "_side_navigation_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_version_version__status_idx" ON "_side_navigation_site_collection_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_created_at_idx" ON "_side_navigation_site_collection_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_updated_at_idx" ON "_side_navigation_site_collection_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_latest_idx" ON "_side_navigation_site_collection_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_side_navigation_site_collection_v_autosave_idx" ON "_side_navigation_site_collection_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_page_link_order_idx" ON "side_navigation_blocks_page_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_page_link_parent_id_idx" ON "side_navigation_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_page_link_path_idx" ON "side_navigation_blocks_page_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_page_link_page_idx" ON "side_navigation_blocks_page_link" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_collection_link_order_idx" ON "side_navigation_blocks_collection_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_collection_link_parent_id_idx" ON "side_navigation_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_collection_link_path_idx" ON "side_navigation_blocks_collection_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_external_link_order_idx" ON "side_navigation_blocks_external_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_external_link_parent_id_idx" ON "side_navigation_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_external_link_path_idx" ON "side_navigation_blocks_external_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_dropdown_order_idx" ON "side_navigation_blocks_dropdown" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_dropdown_parent_id_idx" ON "side_navigation_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "side_navigation_blocks_dropdown_path_idx" ON "side_navigation_blocks_dropdown" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "side_navigation__status_idx" ON "side_navigation" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_page_link_order_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_page_link_parent_id_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_page_link_path_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_page_link_page_idx" ON "_side_navigation_v_blocks_page_link" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_collection_link_order_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_collection_link_parent_id_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_collection_link_path_idx" ON "_side_navigation_v_blocks_collection_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_external_link_order_idx" ON "_side_navigation_v_blocks_external_link" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_external_link_parent_id_idx" ON "_side_navigation_v_blocks_external_link" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_external_link_path_idx" ON "_side_navigation_v_blocks_external_link" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_dropdown_order_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_dropdown_parent_id_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_blocks_dropdown_path_idx" ON "_side_navigation_v_blocks_dropdown" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_version_version__status_idx" ON "_side_navigation_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_created_at_idx" ON "_side_navigation_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_updated_at_idx" ON "_side_navigation_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_latest_idx" ON "_side_navigation_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_side_navigation_v_autosave_idx" ON "_side_navigation_v" USING btree ("autosave");
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_side_navigation_id_page_menus_id_fk" FOREIGN KEY ("side_navigation_id") REFERENCES "public"."page_menus"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_side_navigation_id_page_menus_id_fk" FOREIGN KEY ("version_side_navigation_id") REFERENCES "public"."page_menus"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_menus_fk" FOREIGN KEY ("page_menus_id") REFERENCES "public"."page_menus"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_side_navigation_site_collection_fk" FOREIGN KEY ("side_navigation_site_collection_id") REFERENCES "public"."side_navigation_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_side_navigation_idx" ON "pages" USING btree ("side_navigation_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_side_navigation_idx" ON "_pages_v" USING btree ("version_side_navigation_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_page_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("page_menus_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_side_navigation_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("side_navigation_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_menus_blocks_page_link_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_menus_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_menus_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_menus_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_menus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_menus_v_blocks_page_link_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_menus_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_menus_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_menus_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_page_menus_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "side_navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_page_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_collection_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_external_link" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v_blocks_dropdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_side_navigation_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_menus_blocks_page_link_2" CASCADE;
  DROP TABLE "page_menus_blocks_external_link" CASCADE;
  DROP TABLE "page_menus_blocks_page_link" CASCADE;
  DROP TABLE "page_menus_blocks_collection_link" CASCADE;
  DROP TABLE "page_menus" CASCADE;
  DROP TABLE "_page_menus_v_blocks_page_link_2" CASCADE;
  DROP TABLE "_page_menus_v_blocks_external_link" CASCADE;
  DROP TABLE "_page_menus_v_blocks_page_link" CASCADE;
  DROP TABLE "_page_menus_v_blocks_collection_link" CASCADE;
  DROP TABLE "_page_menus_v" CASCADE;
  DROP TABLE "side_navigation_site_collection_blocks_page_link" CASCADE;
  DROP TABLE "side_navigation_site_collection_blocks_collection_link" CASCADE;
  DROP TABLE "side_navigation_site_collection_blocks_external_link" CASCADE;
  DROP TABLE "side_navigation_site_collection_blocks_dropdown" CASCADE;
  DROP TABLE "side_navigation_site_collection" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_page_link" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_collection_link" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_external_link" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v_blocks_dropdown" CASCADE;
  DROP TABLE "_side_navigation_site_collection_v" CASCADE;
  DROP TABLE "side_navigation_blocks_page_link" CASCADE;
  DROP TABLE "side_navigation_blocks_collection_link" CASCADE;
  DROP TABLE "side_navigation_blocks_external_link" CASCADE;
  DROP TABLE "side_navigation_blocks_dropdown" CASCADE;
  DROP TABLE "side_navigation" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_page_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_collection_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_external_link" CASCADE;
  DROP TABLE "_side_navigation_v_blocks_dropdown" CASCADE;
  DROP TABLE "_side_navigation_v" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_side_navigation_id_page_menus_id_fk";

  ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_side_navigation_id_page_menus_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_page_menus_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_side_navigation_site_collection_fk";

  DROP INDEX "pages_side_navigation_idx";
  DROP INDEX "_pages_v_version_version_side_navigation_idx";
  DROP INDEX "payload_locked_documents_rels_page_menus_id_idx";
  DROP INDEX "payload_locked_documents_rels_side_navigation_site_collection_id_idx";
  ALTER TABLE "pages" DROP COLUMN "side_navigation_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_side_navigation_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_menus_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "side_navigation_site_collection_id";
  DROP TYPE "public"."enum_page_menus_blocks_collection_link_page";
  DROP TYPE "public"."enum_page_menus_status";
  DROP TYPE "public"."enum__page_menus_v_blocks_collection_link_page";
  DROP TYPE "public"."enum__page_menus_v_version_status";
  DROP TYPE "public"."sidenav_collection";
  DROP TYPE "public"."enum_side_navigation_site_collection_status";
  DROP TYPE "public"."enum__side_navigation_site_collection_v_version_status";
  DROP TYPE "public"."enum_side_navigation_status";
  DROP TYPE "public"."enum__side_navigation_v_version_status";`)
}
