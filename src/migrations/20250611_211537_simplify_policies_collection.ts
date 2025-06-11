import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "policies" DROP CONSTRAINT IF EXISTS "policies_image_id_media_id_fk";

  ALTER TABLE "_policies_v" DROP CONSTRAINT IF EXISTS "_policies_v_version_image_id_media_id_fk";

  DROP INDEX IF EXISTS "policies_image_idx";
  DROP INDEX IF EXISTS "_policies_v_version_version_image_idx";
  ALTER TABLE "policies" DROP COLUMN IF EXISTS "subtitle";
  ALTER TABLE "policies" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "policies" DROP COLUMN IF EXISTS "published_at";
  ALTER TABLE "_policies_v" DROP COLUMN IF EXISTS "version_subtitle";
  ALTER TABLE "_policies_v" DROP COLUMN IF EXISTS "version_image_id";
  ALTER TABLE "_policies_v" DROP COLUMN IF EXISTS "version_published_at";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "policies" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "policies" ADD COLUMN "image_id" integer;
  ALTER TABLE "policies" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "_policies_v" ADD COLUMN "version_subtitle" varchar;
  ALTER TABLE "_policies_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "_policies_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
  DO $$ BEGIN
   ALTER TABLE "policies" ADD CONSTRAINT "policies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_policies_v" ADD CONSTRAINT "_policies_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "policies_image_idx" ON "policies" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_policies_v_version_version_image_idx" ON "_policies_v" USING btree ("version_image_id");`)
}
