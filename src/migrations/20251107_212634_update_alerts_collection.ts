import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "alerts" ADD COLUMN "slim" boolean DEFAULT false;
  ALTER TABLE "alerts" ADD COLUMN "icon" boolean DEFAULT true;
  ALTER TABLE "_alerts_v" ADD COLUMN "version_slim" boolean DEFAULT false;
  ALTER TABLE "_alerts_v" ADD COLUMN "version_icon" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "alerts" DROP COLUMN "slim";
  ALTER TABLE "alerts" DROP COLUMN "icon";
  ALTER TABLE "_alerts_v" DROP COLUMN "version_slim";
  ALTER TABLE "_alerts_v" DROP COLUMN "version_icon";`)
}
