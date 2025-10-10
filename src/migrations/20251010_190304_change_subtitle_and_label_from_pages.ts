import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "subtitle";
  ALTER TABLE "pages" DROP COLUMN "label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_subtitle";
  ALTER TABLE "_pages_v" DROP COLUMN "version_label";
  ALTER TABLE "policies" DROP COLUMN "label";
  ALTER TABLE "_policies_v" DROP COLUMN "version_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_subtitle" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_label" varchar;
  ALTER TABLE "policies" ADD COLUMN "label" varchar;
  ALTER TABLE "_policies_v" ADD COLUMN "version_label" varchar;`)
}
