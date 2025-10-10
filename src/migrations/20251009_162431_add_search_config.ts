import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config_site_collection" ADD COLUMN "search_access_key" varchar;
  ALTER TABLE "site_config_site_collection" ADD COLUMN "search_affiliate" varchar;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_search_access_key" varchar;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_search_affiliate" varchar;
  ALTER TABLE "site_config" ADD COLUMN "search_access_key" varchar;
  ALTER TABLE "site_config" ADD COLUMN "search_affiliate" varchar;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_search_access_key" varchar;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_search_affiliate" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config_site_collection" DROP COLUMN "search_access_key";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "search_affiliate";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_search_access_key";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_search_affiliate";
  ALTER TABLE "site_config" DROP COLUMN "search_access_key";
  ALTER TABLE "site_config" DROP COLUMN "search_affiliate";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_search_access_key";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_search_affiliate";`)
}
