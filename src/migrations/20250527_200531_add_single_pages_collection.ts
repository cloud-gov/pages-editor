import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_singlepages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__singlepages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_config_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_config_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_config_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_config_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "singlepages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"subtitle" varchar,
  	"label" varchar,
  	"image_id" integer,
  	"content" jsonb,
  	"site_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_singlepages_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_singlepages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_subtitle" varchar,
  	"version_label" varchar,
  	"version_image_id" integer,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__singlepages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

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

  DROP TABLE "about_us_site_collection" CASCADE;
  DROP TABLE "about_us" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_about_us_site_collection_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_about_us_site_collection_id_idx";
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "agency_name" DROP NOT NULL;
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "site_id" DROP NOT NULL;
  ALTER TABLE "site_config" ALTER COLUMN "agency_name" DROP NOT NULL;
  ALTER TABLE "site_config_site_collection" ADD COLUMN "_status" "enum_site_config_site_collection_status" DEFAULT 'draft';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "singlepages_id" integer;
  ALTER TABLE "site_config" ADD COLUMN "_status" "enum_site_config_status" DEFAULT 'draft';
  DO $$ BEGIN
   ALTER TABLE "singlepages" ADD CONSTRAINT "singlepages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "singlepages" ADD CONSTRAINT "singlepages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_singlepages_v" ADD CONSTRAINT "_singlepages_v_parent_id_singlepages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."singlepages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_singlepages_v" ADD CONSTRAINT "_singlepages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_singlepages_v" ADD CONSTRAINT "_singlepages_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

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

  CREATE INDEX IF NOT EXISTS "singlepages_slug_idx" ON "singlepages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "singlepages_image_idx" ON "singlepages" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "singlepages_site_idx" ON "singlepages" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "singlepages_updated_at_idx" ON "singlepages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "singlepages_created_at_idx" ON "singlepages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "singlepages__status_idx" ON "singlepages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_parent_idx" ON "_singlepages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_version_version_slug_idx" ON "_singlepages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_version_version_image_idx" ON "_singlepages_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_version_version_site_idx" ON "_singlepages_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_version_version_updated_at_idx" ON "_singlepages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_version_version_created_at_idx" ON "_singlepages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_version_version__status_idx" ON "_singlepages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_created_at_idx" ON "_singlepages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_updated_at_idx" ON "_singlepages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_latest_idx" ON "_singlepages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_singlepages_v_autosave_idx" ON "_singlepages_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_parent_idx" ON "_site_config_site_collection_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_site_idx" ON "_site_config_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_updated_at_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_created_at_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version__status_idx" ON "_site_config_site_collection_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_created_at_idx" ON "_site_config_site_collection_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_updated_at_idx" ON "_site_config_site_collection_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_latest_idx" ON "_site_config_site_collection_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_autosave_idx" ON "_site_config_site_collection_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_site_config_v_version_version__status_idx" ON "_site_config_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_site_config_v_created_at_idx" ON "_site_config_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_site_config_v_updated_at_idx" ON "_site_config_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_site_config_v_latest_idx" ON "_site_config_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_site_config_v_autosave_idx" ON "_site_config_v" USING btree ("autosave");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_singlepages_fk" FOREIGN KEY ("singlepages_id") REFERENCES "public"."singlepages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "site_config_site_collection__status_idx" ON "site_config_site_collection" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_singlepages_id_idx" ON "payload_locked_documents_rels" USING btree ("singlepages_id");
  CREATE INDEX IF NOT EXISTS "site_config__status_idx" ON "site_config" USING btree ("_status");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "about_us_site_collection_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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

  ALTER TABLE "singlepages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_singlepages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_config_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_config_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "singlepages" CASCADE;
  DROP TABLE "_singlepages_v" CASCADE;
  DROP TABLE "_site_config_site_collection_v" CASCADE;
  DROP TABLE "_site_config_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_singlepages_fk";

  DROP INDEX IF EXISTS "site_config_site_collection__status_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_singlepages_id_idx";
  DROP INDEX IF EXISTS "site_config__status_idx";
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "agency_name" SET NOT NULL;
  ALTER TABLE "site_config_site_collection" ALTER COLUMN "site_id" SET NOT NULL;
  ALTER TABLE "site_config" ALTER COLUMN "agency_name" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "about_us_site_collection_id" integer;
  DO $$ BEGIN
   ALTER TABLE "about_us_site_collection" ADD CONSTRAINT "about_us_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "about_us_site_collection_site_idx" ON "about_us_site_collection" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "about_us_site_collection_updated_at_idx" ON "about_us_site_collection" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "about_us_site_collection_created_at_idx" ON "about_us_site_collection" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_us_site_collection_fk" FOREIGN KEY ("about_us_site_collection_id") REFERENCES "public"."about_us_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_about_us_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("about_us_site_collection_id");
  ALTER TABLE "site_config_site_collection" DROP COLUMN IF EXISTS "_status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "singlepages_id";
  ALTER TABLE "site_config" DROP COLUMN IF EXISTS "_status";
  DROP TYPE "public"."enum_singlepages_status";
  DROP TYPE "public"."enum__singlepages_v_version_status";
  DROP TYPE "public"."enum_site_config_site_collection_status";
  DROP TYPE "public"."enum__site_config_site_collection_v_version_status";
  DROP TYPE "public"."enum_site_config_status";
  DROP TYPE "public"."enum__site_config_v_version_status";`)
}
