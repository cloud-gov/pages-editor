import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu_site_collection_blocks_dropdown" ADD COLUMN "label" varchar;
  ALTER TABLE "_menu_site_collection_v_blocks_dropdown" ADD COLUMN "label" varchar;
  ALTER TABLE "menu_blocks_dropdown" ADD COLUMN "label" varchar;
  ALTER TABLE "_menu_v_blocks_dropdown" ADD COLUMN "label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu_site_collection_blocks_dropdown" DROP COLUMN "label";
  ALTER TABLE "_menu_site_collection_v_blocks_dropdown" DROP COLUMN "label";
  ALTER TABLE "menu_blocks_dropdown" DROP COLUMN "label";
  ALTER TABLE "_menu_v_blocks_dropdown" DROP COLUMN "label";`)
}
