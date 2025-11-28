import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_alerts_alignment" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__alerts_v_version_alignment" AS ENUM('left', 'center');
  ALTER TABLE "footer_site_collection" ALTER COLUMN "identifier_color" DROP DEFAULT;
  ALTER TABLE "footer_site_collection" ALTER COLUMN "identity_domain_color" DROP DEFAULT;
  ALTER TABLE "footer_site_collection" ALTER COLUMN "primary_link_color" DROP DEFAULT;
  ALTER TABLE "footer_site_collection" ALTER COLUMN "secondary_link_color" DROP DEFAULT;
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_identifier_color" DROP DEFAULT;
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_identity_domain_color" DROP DEFAULT;
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_primary_link_color" DROP DEFAULT;
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_secondary_link_color" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "identifier_color" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "identity_domain_color" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "primary_link_color" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "secondary_link_color" DROP DEFAULT;
  ALTER TABLE "_footer_v" ALTER COLUMN "version_identifier_color" DROP DEFAULT;
  ALTER TABLE "_footer_v" ALTER COLUMN "version_identity_domain_color" DROP DEFAULT;
  ALTER TABLE "_footer_v" ALTER COLUMN "version_primary_link_color" DROP DEFAULT;
  ALTER TABLE "_footer_v" ALTER COLUMN "version_secondary_link_color" DROP DEFAULT;
  ALTER TABLE "alerts" ADD COLUMN "alignment" "enum_alerts_alignment";
  ALTER TABLE "alerts" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "_alerts_v" ADD COLUMN "version_alignment" "enum__alerts_v_version_alignment";
  ALTER TABLE "_alerts_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
  ALTER TABLE "alerts" DROP COLUMN "publish_date";
  ALTER TABLE "_alerts_v" DROP COLUMN "version_publish_date";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_site_collection" ALTER COLUMN "identifier_color" SET DEFAULT 'gray';
  ALTER TABLE "footer_site_collection" ALTER COLUMN "identity_domain_color" SET DEFAULT 'gray';
  ALTER TABLE "footer_site_collection" ALTER COLUMN "primary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "footer_site_collection" ALTER COLUMN "secondary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_identifier_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_identity_domain_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_primary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_site_collection_v" ALTER COLUMN "version_secondary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "footer" ALTER COLUMN "identifier_color" SET DEFAULT 'gray';
  ALTER TABLE "footer" ALTER COLUMN "identity_domain_color" SET DEFAULT 'gray';
  ALTER TABLE "footer" ALTER COLUMN "primary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "footer" ALTER COLUMN "secondary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_v" ALTER COLUMN "version_identifier_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_v" ALTER COLUMN "version_identity_domain_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_v" ALTER COLUMN "version_primary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "_footer_v" ALTER COLUMN "version_secondary_link_color" SET DEFAULT 'gray';
  ALTER TABLE "alerts" ADD COLUMN "publish_date" timestamp(3) with time zone;
  ALTER TABLE "_alerts_v" ADD COLUMN "version_publish_date" timestamp(3) with time zone;
  ALTER TABLE "alerts" DROP COLUMN "alignment";
  ALTER TABLE "alerts" DROP COLUMN "published_at";
  ALTER TABLE "_alerts_v" DROP COLUMN "version_alignment";
  ALTER TABLE "_alerts_v" DROP COLUMN "version_published_at";
  DROP TYPE "public"."enum_alerts_alignment";
  DROP TYPE "public"."enum__alerts_v_version_alignment";`)
}
