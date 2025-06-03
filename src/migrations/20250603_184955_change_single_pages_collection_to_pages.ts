import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_singlepages_status" RENAME TO "enum_pages_status";
  ALTER TYPE "public"."enum__singlepages_v_version_status" RENAME TO "enum__pages_v_version_status";
  ALTER TABLE "singlepages" RENAME TO "pages";
  ALTER TABLE "_singlepages_v" RENAME TO "_pages_v";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "singlepages_id" TO "pages_id";
  ALTER TABLE "pages" DROP CONSTRAINT "singlepages_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "singlepages_site_id_sites_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_singlepages_v_parent_id_singlepages_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_singlepages_v_version_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_singlepages_v_version_site_id_sites_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_singlepages_fk";
  
  DROP INDEX IF EXISTS "singlepages_slug_idx";
  DROP INDEX IF EXISTS "singlepages_image_idx";
  DROP INDEX IF EXISTS "singlepages_site_idx";
  DROP INDEX IF EXISTS "singlepages_updated_at_idx";
  DROP INDEX IF EXISTS "singlepages_created_at_idx";
  DROP INDEX IF EXISTS "singlepages__status_idx";
  DROP INDEX IF EXISTS "_singlepages_v_parent_idx";
  DROP INDEX IF EXISTS "_singlepages_v_version_version_slug_idx";
  DROP INDEX IF EXISTS "_singlepages_v_version_version_image_idx";
  DROP INDEX IF EXISTS "_singlepages_v_version_version_site_idx";
  DROP INDEX IF EXISTS "_singlepages_v_version_version_updated_at_idx";
  DROP INDEX IF EXISTS "_singlepages_v_version_version_created_at_idx";
  DROP INDEX IF EXISTS "_singlepages_v_version_version__status_idx";
  DROP INDEX IF EXISTS "_singlepages_v_created_at_idx";
  DROP INDEX IF EXISTS "_singlepages_v_updated_at_idx";
  DROP INDEX IF EXISTS "_singlepages_v_latest_idx";
  DROP INDEX IF EXISTS "_singlepages_v_autosave_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_singlepages_id_idx";
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_image_idx" ON "pages" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_site_idx" ON "pages" USING btree ("site_id");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_image_idx" ON "_pages_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_site_idx" ON "_pages_v" USING btree ("version_site_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_status" RENAME TO "enum_singlepages_status";
  ALTER TYPE "public"."enum__pages_v_version_status" RENAME TO "enum__singlepages_v_version_status";
  ALTER TABLE "pages" RENAME TO "singlepages";
  ALTER TABLE "_pages_v" RENAME TO "_singlepages_v";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "pages_id" TO "singlepages_id";
  ALTER TABLE "singlepages" DROP CONSTRAINT "pages_image_id_media_id_fk";
  
  ALTER TABLE "singlepages" DROP CONSTRAINT "pages_site_id_sites_id_fk";
  
  ALTER TABLE "_singlepages_v" DROP CONSTRAINT "_pages_v_parent_id_pages_id_fk";
  
  ALTER TABLE "_singlepages_v" DROP CONSTRAINT "_pages_v_version_image_id_media_id_fk";
  
  ALTER TABLE "_singlepages_v" DROP CONSTRAINT "_pages_v_version_site_id_sites_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX IF EXISTS "pages_slug_idx";
  DROP INDEX IF EXISTS "pages_image_idx";
  DROP INDEX IF EXISTS "pages_site_idx";
  DROP INDEX IF EXISTS "pages_updated_at_idx";
  DROP INDEX IF EXISTS "pages_created_at_idx";
  DROP INDEX IF EXISTS "pages__status_idx";
  DROP INDEX IF EXISTS "_pages_v_parent_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_slug_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_image_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_site_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_updated_at_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_created_at_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version__status_idx";
  DROP INDEX IF EXISTS "_pages_v_created_at_idx";
  DROP INDEX IF EXISTS "_pages_v_updated_at_idx";
  DROP INDEX IF EXISTS "_pages_v_latest_idx";
  DROP INDEX IF EXISTS "_pages_v_autosave_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_pages_id_idx";
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
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_singlepages_fk" FOREIGN KEY ("singlepages_id") REFERENCES "public"."singlepages"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_singlepages_id_idx" ON "payload_locked_documents_rels" USING btree ("singlepages_id");`)
}
