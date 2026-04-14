import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_collection_types_layout_type" AS ENUM('list', 'grid');
  CREATE TYPE "public"."enum__collection_types_v_version_layout_type" AS ENUM('list', 'grid');
  ALTER TABLE "collection_types" ADD COLUMN "layout_type" "enum_collection_types_layout_type" DEFAULT 'list';
  ALTER TABLE "_collection_types_v" ADD COLUMN "version_layout_type" "enum__collection_types_v_version_layout_type" DEFAULT 'list';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_types" DROP COLUMN "layout_type";
  ALTER TABLE "_collection_types_v" DROP COLUMN "version_layout_type";
  DROP TYPE "public"."enum_collection_types_layout_type";
  DROP TYPE "public"."enum__collection_types_v_version_layout_type";`)
}
