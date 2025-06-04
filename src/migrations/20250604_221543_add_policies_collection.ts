import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_policies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__policies_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "policies" (
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
  	"_status" "enum_policies_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_policies_v" (
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
  	"version__status" "enum__policies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "policies_id" integer;
  DO $$ BEGIN
   ALTER TABLE "policies" ADD CONSTRAINT "policies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "policies" ADD CONSTRAINT "policies_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_parent_id_policies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."policies"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "policies_slug_idx" ON "policies" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "policies_image_idx" ON "policies" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "policies_site_idx" ON "policies" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "policies_updated_at_idx" ON "policies" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "policies_created_at_idx" ON "policies" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "policies__status_idx" ON "policies" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_policies_v_parent_idx" ON "_policies_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_policies_v_version_version_slug_idx" ON "_policies_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_policies_v_version_version_image_idx" ON "_policies_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_policies_v_version_version_site_idx" ON "_policies_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_policies_v_version_version_updated_at_idx" ON "_policies_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_policies_v_version_version_created_at_idx" ON "_policies_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_policies_v_version_version__status_idx" ON "_policies_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_policies_v_created_at_idx" ON "_policies_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_policies_v_updated_at_idx" ON "_policies_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_policies_v_latest_idx" ON "_policies_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_policies_v_autosave_idx" ON "_policies_v" USING btree ("autosave");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_policies_id_idx" ON "payload_locked_documents_rels" USING btree ("policies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "policies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_policies_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "policies" CASCADE;
  DROP TABLE "_policies_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_policies_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_policies_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "policies_id";
  DROP TYPE "public"."enum_policies_status";
  DROP TYPE "public"."enum__policies_v_version_status";`)
}
