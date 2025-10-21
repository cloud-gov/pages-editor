import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config_site_collection" ADD COLUMN "dap_agency_code" varchar;
  ALTER TABLE "site_config_site_collection" ADD COLUMN "dap_sub_agency_code" varchar;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_dap_agency_code" varchar;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_dap_sub_agency_code" varchar;
  ALTER TABLE "site_config" ADD COLUMN "dap_agency_code" varchar;
  ALTER TABLE "site_config" ADD COLUMN "dap_sub_agency_code" varchar;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_dap_agency_code" varchar;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_dap_sub_agency_code" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config_site_collection" DROP COLUMN "dap_agency_code";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "dap_sub_agency_code";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_dap_agency_code";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_dap_sub_agency_code";
  ALTER TABLE "site_config" DROP COLUMN "dap_agency_code";
  ALTER TABLE "site_config" DROP COLUMN "dap_sub_agency_code";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_dap_agency_code";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_dap_sub_agency_code";`)
}
