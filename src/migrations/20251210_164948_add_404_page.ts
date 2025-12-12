import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_kv" CASCADE;
  DROP INDEX "_custom_collection_pages_v_version_version_collection_co_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_updated_a_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_created_a_idx";
  DROP INDEX "_home_page_site_collection_v_blocks_card_grid_cards_imag_idx";
  DROP INDEX "payload_locked_documents_rels_site_config_site_collectio_idx";
  DROP INDEX "payload_locked_documents_rels_home_page_site_collection__idx";
  DROP INDEX "payload_locked_documents_rels_pre_footer_site_collection_idx";
  CREATE INDEX "_custom_collection_pages_v_version_version_collection_config_idx" ON "_custom_collection_pages_v" USING btree ("version_collection_config_id");
  CREATE INDEX "_site_config_site_collection_v_version_version_updated_at_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_config_site_collection_v_version_version_created_at_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_cards_image_idx" ON "_home_page_site_collection_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "payload_locked_documents_rels_site_config_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("site_config_site_collection_id");
  CREATE INDEX "payload_locked_documents_rels_home_page_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("home_page_site_collection_id");
  CREATE INDEX "payload_locked_documents_rels_pre_footer_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("pre_footer_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  DROP INDEX "_custom_collection_pages_v_version_version_collection_config_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_updated_at_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_created_at_idx";
  DROP INDEX "_home_page_site_collection_v_blocks_card_grid_cards_image_idx";
  DROP INDEX "payload_locked_documents_rels_site_config_site_collection_id_idx";
  DROP INDEX "payload_locked_documents_rels_home_page_site_collection_id_idx";
  DROP INDEX "payload_locked_documents_rels_pre_footer_site_collection_id_idx";
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "_custom_collection_pages_v_version_version_collection_co_idx" ON "_custom_collection_pages_v" USING btree ("version_collection_config_id");
  CREATE INDEX "_site_config_site_collection_v_version_version_updated_a_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_config_site_collection_v_version_version_created_a_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_home_page_site_collection_v_blocks_card_grid_cards_imag_idx" ON "_home_page_site_collection_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "payload_locked_documents_rels_site_config_site_collectio_idx" ON "payload_locked_documents_rels" USING btree ("site_config_site_collection_id");
  CREATE INDEX "payload_locked_documents_rels_home_page_site_collection__idx" ON "payload_locked_documents_rels" USING btree ("home_page_site_collection_id");
  CREATE INDEX "payload_locked_documents_rels_pre_footer_site_collection_idx" ON "payload_locked_documents_rels" USING btree ("pre_footer_site_collection_id");`)
}
