import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sites" ALTER COLUMN "initial_manager_email" SET DEFAULT 'placeholder@agency.gov';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sites" ALTER COLUMN "initial_manager_email" SET DEFAULT 'updatethis@agency.gov';`)
}
