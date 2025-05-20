import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_media_status" AS ENUM('draft', 'published');
  EXCEPTION
      WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "media" ADD COLUMN "site_id" integer NOT NULL;
  ALTER TABLE "media" ADD COLUMN "_status" "enum_media_status" DEFAULT 'draft';
  ALTER TABLE "media" ADD COLUMN "review_ready" boolean DEFAULT true;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '_uploads';
  DO $$ BEGIN
   ALTER TABLE "media" ADD CONSTRAINT "media_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "media_site_idx" ON "media" USING btree ("site_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP CONSTRAINT "media_site_id_sites_id_fk";

  DROP INDEX IF EXISTS "media_site_idx";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "site_id";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "_status";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "review_ready";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";
  DROP TYPE "public"."enum_media_status";`)
}
