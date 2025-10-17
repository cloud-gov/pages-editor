import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "reports_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );

  CREATE TABLE IF NOT EXISTS "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"report_date" timestamp(3) with time zone,
  	"site_id" integer,
  	"content" jsonb,
  	"review_ready" boolean,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reports_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "reports_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );

  CREATE TABLE IF NOT EXISTS "_reports_v_version_report_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_reports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_report_date" timestamp(3) with time zone,
  	"version_site_id" integer,
  	"version_content" jsonb,
  	"version_review_ready" boolean,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reports_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE IF NOT EXISTS "_reports_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );

  ALTER TABLE "categories" ADD COLUMN "slug" varchar;
  ALTER TABLE "categories" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "categories" ADD COLUMN "site_id" integer;
  
  -- Update existing categories to have a default site_id if they don't have one
  -- First, get the first available site_id or create a default
  UPDATE "categories" SET "site_id" = (SELECT "id" FROM "sites" LIMIT 1) WHERE "site_id" IS NULL;
  
  -- Now make the column NOT NULL
  ALTER TABLE "categories" ALTER COLUMN "site_id" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  DO $$ BEGIN
   ALTER TABLE "reports_report_files" ADD CONSTRAINT "reports_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "reports_report_files" ADD CONSTRAINT "reports_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "reports" ADD CONSTRAINT "reports_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "reports" ADD CONSTRAINT "reports_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_reports_v_version_report_files" ADD CONSTRAINT "_reports_v_version_report_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_reports_v_version_report_files" ADD CONSTRAINT "_reports_v_version_report_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "reports_report_files_order_idx" ON "reports_report_files" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "reports_report_files_parent_id_idx" ON "reports_report_files" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "reports_report_files_file_idx" ON "reports_report_files" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "reports_image_idx" ON "reports" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "reports_slug_idx" ON "reports" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "reports_site_idx" ON "reports" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "reports__status_idx" ON "reports" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "reports_rels_order_idx" ON "reports_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "reports_rels_parent_idx" ON "reports_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "reports_rels_path_idx" ON "reports_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "reports_rels_categories_id_idx" ON "reports_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_report_files_order_idx" ON "_reports_v_version_report_files" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_report_files_parent_id_idx" ON "_reports_v_version_report_files" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_report_files_file_idx" ON "_reports_v_version_report_files" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "_reports_v_parent_idx" ON "_reports_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_version_image_idx" ON "_reports_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_version_slug_idx" ON "_reports_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_version_site_idx" ON "_reports_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_version_updated_at_idx" ON "_reports_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_version_created_at_idx" ON "_reports_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_reports_v_version_version__status_idx" ON "_reports_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_reports_v_created_at_idx" ON "_reports_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_reports_v_updated_at_idx" ON "_reports_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_reports_v_latest_idx" ON "_reports_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_reports_v_autosave_idx" ON "_reports_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_reports_v_rels_order_idx" ON "_reports_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_reports_v_rels_parent_idx" ON "_reports_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_reports_v_rels_path_idx" ON "_reports_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_reports_v_rels_categories_id_idx" ON "_reports_v_rels" USING btree ("categories_id");
  DO $$ BEGIN
   ALTER TABLE "categories" ADD CONSTRAINT "categories_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "categories_site_idx" ON "categories" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reports_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_version_report_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_reports_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports_report_files" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_rels" CASCADE;
  DROP TABLE "_reports_v_version_report_files" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "_reports_v_rels" CASCADE;
  ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_site_id_sites_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_reports_fk";

  DROP INDEX IF EXISTS "categories_slug_idx";
  DROP INDEX IF EXISTS "categories_site_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_reports_id_idx";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "slug_lock";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "site_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "reports_id";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_status";`)
}
