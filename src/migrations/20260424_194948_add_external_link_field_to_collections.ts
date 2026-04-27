import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_entries" ADD COLUMN "external_link_label" varchar;
  ALTER TABLE "collection_entries" ADD COLUMN "external_link_url" varchar;
  ALTER TABLE "_collection_entries_v" ADD COLUMN "version_external_link_label" varchar;
  ALTER TABLE "_collection_entries_v" ADD COLUMN "version_external_link_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_entries" DROP COLUMN "external_link_label";
  ALTER TABLE "collection_entries" DROP COLUMN "external_link_url";
  ALTER TABLE "_collection_entries_v" DROP COLUMN "version_external_link_label";
  ALTER TABLE "_collection_entries_v" DROP COLUMN "version_external_link_url";`)
}
