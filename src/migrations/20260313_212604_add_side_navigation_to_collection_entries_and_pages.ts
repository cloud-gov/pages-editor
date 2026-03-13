import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_entries" ADD COLUMN "side_navigation_id" integer;
  ALTER TABLE "_collection_entries_v" ADD COLUMN "version_side_navigation_id" integer;
  ALTER TABLE "pages" ADD COLUMN "side_navigation_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_side_navigation_id" integer;
  ALTER TABLE "collection_entries" ADD CONSTRAINT "collection_entries_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v" ADD CONSTRAINT "_collection_entries_v_version_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("version_side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_side_navigation_id_side_navigation_id_fk" FOREIGN KEY ("version_side_navigation_id") REFERENCES "public"."side_navigation"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "collection_entries_side_navigation_idx" ON "collection_entries" USING btree ("side_navigation_id");
  CREATE INDEX "_collection_entries_v_version_version_side_navigation_idx" ON "_collection_entries_v" USING btree ("version_side_navigation_id");
  CREATE INDEX "pages_side_navigation_idx" ON "pages" USING btree ("side_navigation_id");
  CREATE INDEX "_pages_v_version_version_side_navigation_idx" ON "_pages_v" USING btree ("version_side_navigation_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_entries" DROP CONSTRAINT "collection_entries_side_navigation_id_side_navigation_id_fk";
  
  ALTER TABLE "_collection_entries_v" DROP CONSTRAINT "_collection_entries_v_version_side_navigation_id_side_navigation_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_side_navigation_id_side_navigation_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_side_navigation_id_side_navigation_id_fk";
  
  DROP INDEX "collection_entries_side_navigation_idx";
  DROP INDEX "_collection_entries_v_version_version_side_navigation_idx";
  DROP INDEX "pages_side_navigation_idx";
  DROP INDEX "_pages_v_version_version_side_navigation_idx";
  ALTER TABLE "collection_entries" DROP COLUMN "side_navigation_id";
  ALTER TABLE "_collection_entries_v" DROP COLUMN "version_side_navigation_id";
  ALTER TABLE "pages" DROP COLUMN "side_navigation_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_side_navigation_id";`)
}
