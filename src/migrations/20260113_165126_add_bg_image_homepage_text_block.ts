import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_site_collection_blocks_text_block" ADD COLUMN "bg_image_id" integer;
  ALTER TABLE "_home_page_site_collection_v_blocks_text_block" ADD COLUMN "bg_image_id" integer;
  ALTER TABLE "home_page_blocks_text_block" ADD COLUMN "bg_image_id" integer;
  ALTER TABLE "_home_page_v_blocks_text_block" ADD COLUMN "bg_image_id" integer;
  ALTER TABLE "home_page_site_collection_blocks_text_block" ADD CONSTRAINT "home_page_site_collection_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_text_block" ADD CONSTRAINT "_home_page_site_collection_v_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_text_block" ADD CONSTRAINT "home_page_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_text_block" ADD CONSTRAINT "_home_page_v_blocks_text_block_bg_image_id_media_id_fk" FOREIGN KEY ("bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_site_collection_blocks_text_block_bg_image_idx" ON "home_page_site_collection_blocks_text_block" USING btree ("bg_image_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_text_block_bg_image_idx" ON "_home_page_site_collection_v_blocks_text_block" USING btree ("bg_image_id");
  CREATE INDEX "home_page_blocks_text_block_bg_image_idx" ON "home_page_blocks_text_block" USING btree ("bg_image_id");
  CREATE INDEX "_home_page_v_blocks_text_block_bg_image_idx" ON "_home_page_v_blocks_text_block" USING btree ("bg_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_site_collection_blocks_text_block" DROP CONSTRAINT "home_page_site_collection_blocks_text_block_bg_image_id_media_id_fk";
  
  ALTER TABLE "_home_page_site_collection_v_blocks_text_block" DROP CONSTRAINT "_home_page_site_collection_v_blocks_text_block_bg_image_id_media_id_fk";
  
  ALTER TABLE "home_page_blocks_text_block" DROP CONSTRAINT "home_page_blocks_text_block_bg_image_id_media_id_fk";
  
  ALTER TABLE "_home_page_v_blocks_text_block" DROP CONSTRAINT "_home_page_v_blocks_text_block_bg_image_id_media_id_fk";
  
  DROP INDEX "home_page_site_collection_blocks_text_block_bg_image_idx";
  DROP INDEX "_home_page_site_collection_v_blocks_text_block_bg_image_idx";
  DROP INDEX "home_page_blocks_text_block_bg_image_idx";
  DROP INDEX "_home_page_v_blocks_text_block_bg_image_idx";
  ALTER TABLE "home_page_site_collection_blocks_text_block" DROP COLUMN "bg_image_id";
  ALTER TABLE "_home_page_site_collection_v_blocks_text_block" DROP COLUMN "bg_image_id";
  ALTER TABLE "home_page_blocks_text_block" DROP COLUMN "bg_image_id";
  ALTER TABLE "_home_page_v_blocks_text_block" DROP COLUMN "bg_image_id";`)
}
