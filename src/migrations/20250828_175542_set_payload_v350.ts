import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "_site_config_site_collection_v_version_version_updated_a_idx";
  DROP INDEX IF EXISTS "_site_config_site_collection_v_version_version_created_a_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_site_config_site_collectio_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_collection_landing_pages_i_idx";
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_updated_at_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_site_config_site_collection_v_version_version_created_at_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_site_config_site_collection_id_idx" ON "payload_locked_documents_rels" USING btree ("site_config_site_collection_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_collection_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("collection_landing_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_site_config_site_collection_v_version_version_updated_at_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_created_at_idx";
  DROP INDEX "payload_locked_documents_rels_site_config_site_collection_id_idx";
  DROP INDEX "payload_locked_documents_rels_collection_landing_pages_id_idx";
  CREATE INDEX "_site_config_site_collection_v_version_version_updated_a_idx" ON "_site_config_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_config_site_collection_v_version_version_created_a_idx" ON "_site_config_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "payload_locked_documents_rels_site_config_site_collectio_idx" ON "payload_locked_documents_rels" USING btree ("site_config_site_collection_id");
  CREATE INDEX "payload_locked_documents_rels_collection_landing_pages_i_idx" ON "payload_locked_documents_rels" USING btree ("collection_landing_pages_id");`)
}
