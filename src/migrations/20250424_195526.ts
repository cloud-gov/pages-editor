import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_format" AS ENUM('inperson', 'virtual');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_format" AS ENUM('inperson', 'virtual');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"site_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"location" varchar,
  	"format" "enum_events_format" DEFAULT 'inperson',
  	"registration_url" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_site_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_format" "enum__events_v_version_format" DEFAULT 'inperson',
  	"version_registration_url" varchar,
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE IF NOT EXISTS "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"site_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE IF NOT EXISTS "about_us_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"content" jsonb,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "about_us" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  -- ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_pages_fk";

  ALTER TABLE "users_sites" DROP CONSTRAINT "users_sites_site_id_sites_id_fk";

  -- ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";

  DROP INDEX IF EXISTS "redirects_rels_pages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "about_us_site_collection_id" integer;
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "news" ADD CONSTRAINT "news_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "about_us_site_collection" ADD CONSTRAINT "about_us_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "events_site_idx" ON "events" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_site_idx" ON "_events_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "news_site_idx" ON "news" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_news_v_version_version_site_idx" ON "_news_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "about_us_site_collection_site_idx" ON "about_us_site_collection" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "about_us_site_collection_updated_at_idx" ON "about_us_site_collection" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "about_us_site_collection_created_at_idx" ON "about_us_site_collection" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "users_sites" ADD CONSTRAINT "users_sites_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_us_site_collection_fk" FOREIGN KEY ("about_us_site_collection_id") REFERENCES "public"."about_us_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_about_us_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("about_us_site_collection_id");
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "content_html";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_content_html";
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pages_id";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"site_id" integer,
  	"content" jsonb,
  	"content_html" varchar,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_content_html" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_us" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "about_us_site_collection" CASCADE;
  DROP TABLE "about_us" CASCADE;
  ALTER TABLE "users_sites" DROP CONSTRAINT "users_sites_site_id_sites_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_about_us_site_collection_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_events_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_news_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_about_us_site_collection_id_idx";
  ALTER TABLE "posts" ADD COLUMN "content_html" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content_html" varchar;
  ALTER TABLE "redirects_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "pages_site_idx" ON "pages" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_site_idx" ON "_pages_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "users_sites" ADD CONSTRAINT "users_sites_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "news_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "about_us_site_collection_id";
  DROP TYPE "public"."enum_events_format";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_format";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";`)
}
