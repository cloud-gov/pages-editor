import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_search_analytics_page_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__search_analytics_page_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_search_analytics_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__search_analytics_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "search_analytics_page_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"search_search_access_key" varchar,
  	"search_search_affiliate" varchar,
  	"analytics_dap_agency_code" varchar,
  	"analytics_dap_sub_agency_code" varchar,
  	"review_ready" boolean DEFAULT false,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_search_analytics_page_site_collection_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_search_analytics_page_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_search_search_access_key" varchar,
  	"version_search_search_affiliate" varchar,
  	"version_analytics_dap_agency_code" varchar,
  	"version_analytics_dap_sub_agency_code" varchar,
  	"version_review_ready" boolean DEFAULT false,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__search_analytics_page_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "search_analytics_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"search_search_access_key" varchar,
  	"search_search_affiliate" varchar,
  	"analytics_dap_agency_code" varchar,
  	"analytics_dap_sub_agency_code" varchar,
  	"review_ready" boolean DEFAULT false,
  	"_status" "enum_search_analytics_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_search_analytics_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_search_search_access_key" varchar,
  	"version_search_search_affiliate" varchar,
  	"version_analytics_dap_agency_code" varchar,
  	"version_analytics_dap_sub_agency_code" varchar,
  	"version_review_ready" boolean DEFAULT false,
  	"version__status" "enum__search_analytics_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_analytics_page_site_collection_id" integer;
  ALTER TABLE "search_analytics_page_site_collection" ADD CONSTRAINT "search_analytics_page_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_analytics_page_site_collection_v" ADD CONSTRAINT "_search_analytics_page_site_collection_v_parent_id_search_analytics_page_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search_analytics_page_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_analytics_page_site_collection_v" ADD CONSTRAINT "_search_analytics_page_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "search_analytics_page_site_collection_site_idx" ON "search_analytics_page_site_collection" USING btree ("site_id");
  CREATE INDEX "search_analytics_page_site_collection_updated_at_idx" ON "search_analytics_page_site_collection" USING btree ("updated_at");
  CREATE INDEX "search_analytics_page_site_collection_created_at_idx" ON "search_analytics_page_site_collection" USING btree ("created_at");
  CREATE INDEX "search_analytics_page_site_collection__status_idx" ON "search_analytics_page_site_collection" USING btree ("_status");
  CREATE INDEX "_search_analytics_page_site_collection_v_parent_idx" ON "_search_analytics_page_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_search_analytics_page_site_collection_v_version_version_idx" ON "_search_analytics_page_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_search_analytics_page_site_collection_v_version_versi_1_idx" ON "_search_analytics_page_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_search_analytics_page_site_collection_v_version_versi_2_idx" ON "_search_analytics_page_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_search_analytics_page_site_collection_v_version_versi_3_idx" ON "_search_analytics_page_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_search_analytics_page_site_collection_v_created_at_idx" ON "_search_analytics_page_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_search_analytics_page_site_collection_v_updated_at_idx" ON "_search_analytics_page_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_search_analytics_page_site_collection_v_latest_idx" ON "_search_analytics_page_site_collection_v" USING btree ("latest");
  CREATE INDEX "_search_analytics_page_site_collection_v_autosave_idx" ON "_search_analytics_page_site_collection_v" USING btree ("autosave");
  CREATE INDEX "search_analytics_page__status_idx" ON "search_analytics_page" USING btree ("_status");
  CREATE INDEX "_search_analytics_page_v_version_version__status_idx" ON "_search_analytics_page_v" USING btree ("version__status");
  CREATE INDEX "_search_analytics_page_v_created_at_idx" ON "_search_analytics_page_v" USING btree ("created_at");
  CREATE INDEX "_search_analytics_page_v_updated_at_idx" ON "_search_analytics_page_v" USING btree ("updated_at");
  CREATE INDEX "_search_analytics_page_v_latest_idx" ON "_search_analytics_page_v" USING btree ("latest");
  CREATE INDEX "_search_analytics_page_v_autosave_idx" ON "_search_analytics_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_analytics_page_site__fk" FOREIGN KEY ("search_analytics_page_site_collection_id") REFERENCES "public"."search_analytics_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_search_analytics_page_site_idx" ON "payload_locked_documents_rels" USING btree ("search_analytics_page_site_collection_id");
  ALTER TABLE "site_config_site_collection" DROP COLUMN "search_access_key";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "search_affiliate";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "dap_agency_code";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "dap_sub_agency_code";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_search_access_key";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_search_affiliate";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_dap_agency_code";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_dap_sub_agency_code";
  ALTER TABLE "site_config" DROP COLUMN "search_access_key";
  ALTER TABLE "site_config" DROP COLUMN "search_affiliate";
  ALTER TABLE "site_config" DROP COLUMN "dap_agency_code";
  ALTER TABLE "site_config" DROP COLUMN "dap_sub_agency_code";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_search_access_key";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_search_affiliate";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_dap_agency_code";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_dap_sub_agency_code";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_search_analytics_page_site__fk";

    DROP INDEX IF EXISTS "payload_locked_documents_rels_search_analytics_page_site_idx";

    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "search_analytics_page_site_collection_id";

    ALTER TABLE IF EXISTS "search_analytics_page_site_collection" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "_search_analytics_page_site_collection_v" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "search_analytics_page" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "_search_analytics_page_v" DISABLE ROW LEVEL SECURITY;

    DROP TABLE IF EXISTS "_search_analytics_page_site_collection_v";
    DROP TABLE IF EXISTS "search_analytics_page_site_collection";
    DROP TABLE IF EXISTS "_search_analytics_page_v";
    DROP TABLE IF EXISTS "search_analytics_page";

    ALTER TABLE "site_config_site_collection"
      ADD COLUMN IF NOT EXISTS "search_access_key" varchar;
    ALTER TABLE "site_config_site_collection"
      ADD COLUMN IF NOT EXISTS "search_affiliate" varchar;
    ALTER TABLE "site_config_site_collection"
      ADD COLUMN IF NOT EXISTS "dap_agency_code" varchar;
    ALTER TABLE "site_config_site_collection"
      ADD COLUMN IF NOT EXISTS "dap_sub_agency_code" varchar;

    ALTER TABLE "_site_config_site_collection_v"
      ADD COLUMN IF NOT EXISTS "version_search_access_key" varchar;
    ALTER TABLE "_site_config_site_collection_v"
      ADD COLUMN IF NOT EXISTS "version_search_affiliate" varchar;
    ALTER TABLE "_site_config_site_collection_v"
      ADD COLUMN IF NOT EXISTS "version_dap_agency_code" varchar;
    ALTER TABLE "_site_config_site_collection_v"
      ADD COLUMN IF NOT EXISTS "version_dap_sub_agency_code" varchar;

    ALTER TABLE "site_config"
      ADD COLUMN IF NOT EXISTS "search_access_key" varchar;
    ALTER TABLE "site_config"
      ADD COLUMN IF NOT EXISTS "search_affiliate" varchar;
    ALTER TABLE "site_config"
      ADD COLUMN IF NOT EXISTS "dap_agency_code" varchar;
    ALTER TABLE "site_config"
      ADD COLUMN IF NOT EXISTS "dap_sub_agency_code" varchar;

    ALTER TABLE "_site_config_v"
      ADD COLUMN IF NOT EXISTS "version_search_access_key" varchar;
    ALTER TABLE "_site_config_v"
      ADD COLUMN IF NOT EXISTS "version_search_affiliate" varchar;
    ALTER TABLE "_site_config_v"
      ADD COLUMN IF NOT EXISTS "version_dap_agency_code" varchar;
    ALTER TABLE "_site_config_v"
      ADD COLUMN IF NOT EXISTS "version_dap_sub_agency_code" varchar;

    DROP TYPE IF EXISTS "public"."enum_search_analytics_page_site_collection_status";
    DROP TYPE IF EXISTS "public"."enum__search_analytics_page_site_collection_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_search_analytics_page_status";
    DROP TYPE IF EXISTS "public"."enum__search_analytics_page_v_version_status";
  `)
}
