import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "alerts" ADD COLUMN "review_ready" boolean DEFAULT false;
  ALTER TABLE "_alerts_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "alerts" DROP COLUMN "review_ready";
  ALTER TABLE "_alerts_v" DROP COLUMN "version_review_ready";`)
}
