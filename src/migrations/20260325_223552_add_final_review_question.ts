import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_auth_site_collection_final_review_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_site_collection_v_version_final_review_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_final_review_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_v_version_final_review_check" AS ENUM('yes', 'no');
  ALTER TABLE "site_auth_site_collection" ADD COLUMN "final_review_check" "enum_site_auth_site_collection_final_review_check";
  ALTER TABLE "_site_auth_site_collection_v" ADD COLUMN "version_final_review_check" "enum__site_auth_site_collection_v_version_final_review_check";
  ALTER TABLE "site_auth" ADD COLUMN "final_review_check" "enum_site_auth_final_review_check";
  ALTER TABLE "_site_auth_v" ADD COLUMN "version_final_review_check" "enum__site_auth_v_version_final_review_check";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_auth_site_collection" DROP COLUMN "final_review_check";
  ALTER TABLE "_site_auth_site_collection_v" DROP COLUMN "version_final_review_check";
  ALTER TABLE "site_auth" DROP COLUMN "final_review_check";
  ALTER TABLE "_site_auth_v" DROP COLUMN "version_final_review_check";
  DROP TYPE "public"."enum_site_auth_site_collection_final_review_check";
  DROP TYPE "public"."enum__site_auth_site_collection_v_version_final_review_check";
  DROP TYPE "public"."enum_site_auth_final_review_check";
  DROP TYPE "public"."enum__site_auth_v_version_final_review_check";`)
}
