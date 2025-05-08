import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config_site_collection" ADD COLUMN "agency_name" varchar DEFAULT 'Agency Name' NOT NULL;
  ALTER TABLE "site_config" ADD COLUMN "agency_name" varchar DEFAULT 'Agency Name' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config_site_collection" DROP COLUMN IF EXISTS "agency_name";
  ALTER TABLE "site_config" DROP COLUMN IF EXISTS "agency_name";`)
}
