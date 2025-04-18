import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sites" ADD COLUMN "initial_manager_email" varchar DEFAULT 'updatethis@agency.gov' NOT NULL;
  ALTER TABLE "sites" ADD COLUMN "pages_org" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sites" DROP COLUMN IF EXISTS "initial_manager_email";
  ALTER TABLE "sites" DROP COLUMN IF EXISTS "pages_org";`)
}
