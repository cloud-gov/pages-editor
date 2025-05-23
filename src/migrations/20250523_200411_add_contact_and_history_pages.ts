import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_config_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_config_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_about_us_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_us_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_history_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__history_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_config_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_config_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_about_us_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_us_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_history_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__history_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "_site_config_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_font" varchar,
  	"version_agency_name" varchar DEFAULT 'Agency Name',
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_config_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_about_us_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__about_us_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "contact_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"content" jsonb,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_contact_site_collection_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_contact_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__contact_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "history_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"content" jsonb,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_history_site_collection_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_history_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__history_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_site_config_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_font" varchar,
  	"version_agency_name" varchar DEFAULT 'Agency Name',
  	"version__status" "enum__site_config_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_about_us_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version__status" "enum__about_us_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"content" jsonb,
  	"_status" "enum_contact_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "_contact_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version__status" "enum__contact_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "history" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"content" jsonb,
  	"_status" "enum_history_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "_history_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version__status" "enum__history_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "agency_name" DROP NOT NULL;
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "site_id" DROP NOT NULL;
  ALTER TABLE "about_us_site_collection" ALTER COLUMN "site_id" DROP NOT NULL;
  ALTER TABLE "site_config" ALTER COLUMN "agency_name" DROP NOT NULL;
  ALTER TABLE "site_config_site_collection" ADD COLUMN "_status" "enum_site_config_site_collection_status" DEFAULT 'draft';
  ALTER TABLE "about_us_site_collection" ADD COLUMN "_status" "enum_about_us_site_collection_status" DEFAULT 'draft';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_site_collection_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "history_site_collection_id" integer;
  ALTER TABLE "site_config" ADD COLUMN "_status" "enum_site_config_status" DEFAULT 'draft';
  ALTER TABLE "about_us" ADD COLUMN "_status" "enum_about_us_status" DEFAULT 'draft';
  DO $$ BEGIN
   ALTER TABLE "_site_config_site_collection_v" ADD CONSTRAINT "_site_config_site_collection_v_parent_id_site_config_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_config_site_collection"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_site_config_site_collection_v" ADD CONSTRAINT "_site_config_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_about_us_site_collection_v" ADD CONSTRAINT "_about_us_site_collection_v_parent_id_about_us_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_us_site_collection"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_about_us_site_collection_v" ADD CONSTRAINT "_about_us_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "contact_site_collection" ADD CONSTRAINT "contact_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_contact_site_collection_v" ADD CONSTRAINT "_contact_site_collection_v_parent_id_contact_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_site_collection"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_contact_site_collection_v" ADD CONSTRAINT "_contact_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "history_site_collection" ADD CONSTRAINT "history_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_history_site_collection_v" ADD CONSTRAINT "_history_site_collection_v_parent_id_history_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."history_site_collection"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_history_site_collection_v" ADD CONSTRAINT "_history_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_parent_idx" ON "_site_config_site_collection_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_site_idx" ON "_site_config_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_updated_at_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_created_at_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version__status_idx" ON "_site_config_site_collection_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_created_at_idx" ON "_site_config_site_collection_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_updated_at_idx" ON "_site_config_site_collection_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_latest_idx" ON "_site_config_site_collection_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_autosave_idx" ON "_site_config_site_collection_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_parent_idx" ON "_about_us_site_collection_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_version_version_site_idx" ON "_about_us_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_version_version_updated_at_idx" ON "_about_us_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_version_version_created_at_idx" ON "_about_us_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_version_version__status_idx" ON "_about_us_site_collection_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_created_at_idx" ON "_about_us_site_collection_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_updated_at_idx" ON "_about_us_site_collection_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_latest_idx" ON "_about_us_site_collection_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_about_us_site_collection_v_autosave_idx" ON "_about_us_site_collection_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "contact_site_collection_site_idx" ON "contact_site_collection" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "contact_site_collection_updated_at_idx" ON "contact_site_collection" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contact_site_collection_created_at_idx" ON "contact_site_collection" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "contact_site_collection__status_idx" ON "contact_site_collection" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_parent_idx" ON "_contact_site_collection_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_version_version_site_idx" ON "_contact_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_version_version_updated_at_idx" ON "_contact_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_version_version_created_at_idx" ON "_contact_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_version_version__status_idx" ON "_contact_site_collection_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_created_at_idx" ON "_contact_site_collection_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_updated_at_idx" ON "_contact_site_collection_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_latest_idx" ON "_contact_site_collection_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_contact_site_collection_v_autosave_idx" ON "_contact_site_collection_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "history_site_collection_site_idx" ON "history_site_collection" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "history_site_collection_updated_at_idx" ON "history_site_collection" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "history_site_collection_created_at_idx" ON "history_site_collection" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "history_site_collection__status_idx" ON "history_site_collection" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_parent_idx" ON "_history_site_collection_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_version_version_site_idx" ON "_history_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_version_version_updated_at_idx" ON "_history_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_version_version_created_at_idx" ON "_history_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_version_version__status_idx" ON "_history_site_collection_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_created_at_idx" ON "_history_site_collection_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_updated_at_idx" ON "_history_site_collection_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_latest_idx" ON "_history_site_collection_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_history_site_collection_v_autosave_idx" ON "_history_site_collection_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_site_config_v_version_version__status_idx" ON "_site_config_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_site_config_v_created_at_idx" ON "_site_config_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_site_config_v_updated_at_idx" ON "_site_config_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_site_config_v_latest_idx" ON "_site_config_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_site_config_v_autosave_idx" ON "_site_config_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_about_us_v_version_version__status_idx" ON "_about_us_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_about_us_v_created_at_idx" ON "_about_us_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_about_us_v_updated_at_idx" ON "_about_us_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_about_us_v_latest_idx" ON "_about_us_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_about_us_v_autosave_idx" ON "_about_us_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "contact__status_idx" ON "contact" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_contact_v_version_version__status_idx" ON "_contact_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_contact_v_created_at_idx" ON "_contact_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_contact_v_updated_at_idx" ON "_contact_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_contact_v_latest_idx" ON "_contact_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_contact_v_autosave_idx" ON "_contact_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "history__status_idx" ON "history" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_history_v_version_version__status_idx" ON "_history_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_history_v_created_at_idx" ON "_history_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_history_v_updated_at_idx" ON "_history_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_history_v_latest_idx" ON "_history_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_history_v_autosave_idx" ON "_history_v" USING btree ("autosave");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_site_collection_fk" FOREIGN KEY ("contact_site_collection_id") REFERENCES "public"."contact_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_history_site_collection_fk" FOREIGN KEY ("history_site_collection_id") REFERENCES "public"."history_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "site_config_site_collection__status_idx" ON "site_config_site_collection" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "about_us_site_collection__status_idx" ON "about_us_site_collection" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contact_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_site_collection_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_history_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("history_site_collection_id");
  CREATE INDEX IF NOT EXISTS "site_config__status_idx" ON "site_config" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "about_us__status_idx" ON "about_us" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_site_config_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_us_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "history_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_history_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_config_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_us_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_history_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_site_config_site_collection_v" CASCADE;
  DROP TABLE "_about_us_site_collection_v" CASCADE;
  DROP TABLE "contact_site_collection" CASCADE;
  DROP TABLE "_contact_site_collection_v" CASCADE;
  DROP TABLE "history_site_collection" CASCADE;
  DROP TABLE "_history_site_collection_v" CASCADE;
  DROP TABLE "_site_config_v" CASCADE;
  DROP TABLE "_about_us_v" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "_contact_v" CASCADE;
  DROP TABLE "history" CASCADE;
  DROP TABLE "_history_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_site_collection_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_history_site_collection_fk";
  
  DROP INDEX IF EXISTS "site_config_site_collection__status_idx";
  DROP INDEX IF EXISTS "about_us_site_collection__status_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_contact_site_collection_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_history_site_collection_id_idx";
  DROP INDEX IF EXISTS "site_config__status_idx";
  DROP INDEX IF EXISTS "about_us__status_idx";
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "agency_name" SET NOT NULL;
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "site_id" SET NOT NULL;
  ALTER TABLE "about_us_site_collection" ALTER COLUMN "site_id" SET NOT NULL;
  ALTER TABLE "site_config" ALTER COLUMN "agency_name" SET NOT NULL;
  ALTER TABLE "site_config_site_collection" DROP COLUMN IF EXISTS "_status";
  ALTER TABLE "about_us_site_collection" DROP COLUMN IF EXISTS "_status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "contact_site_collection_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "history_site_collection_id";
  ALTER TABLE "site_config" DROP COLUMN IF EXISTS "_status";
  ALTER TABLE "about_us" DROP COLUMN IF EXISTS "_status";
  DROP TYPE "public"."enum_site_config_site_collection_status";
  DROP TYPE "public"."enum__site_config_site_collection_v_version_status";
  DROP TYPE "public"."enum_about_us_site_collection_status";
  DROP TYPE "public"."enum__about_us_site_collection_v_version_status";
  DROP TYPE "public"."enum_contact_site_collection_status";
  DROP TYPE "public"."enum__contact_site_collection_v_version_status";
  DROP TYPE "public"."enum_history_site_collection_status";
  DROP TYPE "public"."enum__history_site_collection_v_version_status";
  DROP TYPE "public"."enum_site_config_status";
  DROP TYPE "public"."enum__site_config_v_version_status";
  DROP TYPE "public"."enum_about_us_status";
  DROP TYPE "public"."enum__about_us_v_version_status";
  DROP TYPE "public"."enum_contact_status";
  DROP TYPE "public"."enum__contact_v_version_status";
  DROP TYPE "public"."enum_history_status";
  DROP TYPE "public"."enum__history_v_version_status";`)
}
