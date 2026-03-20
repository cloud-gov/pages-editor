import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_auth_site_collection_pii_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_site_collection_sensitive_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_site_collection_links_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_site_collection_format_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_site_collection_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_auth_site_collection_v_version_pii_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_site_collection_v_version_sensitive_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_site_collection_v_version_links_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_site_collection_v_version_format_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_site_collection_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_auth_pii_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_sensitive_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_links_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_format_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_site_auth_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_auth_v_version_pii_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_v_version_sensitive_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_v_version_links_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_v_version_format_check" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__site_auth_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "site_auth_site_collection_third_party_reps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"third_party_representative_full_name" varchar,
  	"third_party_representative_title" varchar,
  	"third_party_representative_email" varchar,
  	"third_party_representative_phone" varchar,
  	"third_party_representative_company" varchar
  );

  CREATE TABLE "site_auth_site_collection" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"agency_owner_full_name" varchar,
  	"agency_owner_title" varchar,
  	"agency_owner_email" varchar,
  	"agency_owner_phone" varchar,
  	"agency_site_manager_full_name" varchar,
  	"agency_site_manager_title" varchar,
  	"agency_site_manager_email" varchar,
  	"agency_site_manager_phone" varchar,
  	"agency_security_officer_full_name" varchar,
  	"agency_security_officer_title" varchar,
  	"agency_security_officer_email" varchar,
  	"agency_security_officer_phone" varchar,
  	"agency_security_officer_program" varchar,
  	"website_info_site_name" varchar,
  	"website_info_accronym" varchar,
  	"website_info_agency" varchar,
  	"website_info_description" varchar,
  	"pii_check" "enum_site_auth_site_collection_pii_check",
  	"sensitive_check" "enum_site_auth_site_collection_sensitive_check",
  	"links_check" "enum_site_auth_site_collection_links_check",
  	"format_check" "enum_site_auth_site_collection_format_check",
  	"updated_by_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_auth_site_collection_status" DEFAULT 'draft'
  );

  CREATE TABLE "_site_auth_site_collection_v_version_third_party_reps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"third_party_representative_full_name" varchar,
  	"third_party_representative_title" varchar,
  	"third_party_representative_email" varchar,
  	"third_party_representative_phone" varchar,
  	"third_party_representative_company" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_site_auth_site_collection_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_agency_owner_full_name" varchar,
  	"version_agency_owner_title" varchar,
  	"version_agency_owner_email" varchar,
  	"version_agency_owner_phone" varchar,
  	"version_agency_site_manager_full_name" varchar,
  	"version_agency_site_manager_title" varchar,
  	"version_agency_site_manager_email" varchar,
  	"version_agency_site_manager_phone" varchar,
  	"version_agency_security_officer_full_name" varchar,
  	"version_agency_security_officer_title" varchar,
  	"version_agency_security_officer_email" varchar,
  	"version_agency_security_officer_phone" varchar,
  	"version_agency_security_officer_program" varchar,
  	"version_website_info_site_name" varchar,
  	"version_website_info_accronym" varchar,
  	"version_website_info_agency" varchar,
  	"version_website_info_description" varchar,
  	"version_pii_check" "enum__site_auth_site_collection_v_version_pii_check",
  	"version_sensitive_check" "enum__site_auth_site_collection_v_version_sensitive_check",
  	"version_links_check" "enum__site_auth_site_collection_v_version_links_check",
  	"version_format_check" "enum__site_auth_site_collection_v_version_format_check",
  	"version_updated_by_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_auth_site_collection_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE "site_auth_third_party_reps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"third_party_representative_full_name" varchar,
  	"third_party_representative_title" varchar,
  	"third_party_representative_email" varchar,
  	"third_party_representative_phone" varchar,
  	"third_party_representative_company" varchar
  );

  CREATE TABLE "site_auth" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"agency_owner_full_name" varchar,
  	"agency_owner_title" varchar,
  	"agency_owner_email" varchar,
  	"agency_owner_phone" varchar,
  	"agency_site_manager_full_name" varchar,
  	"agency_site_manager_title" varchar,
  	"agency_site_manager_email" varchar,
  	"agency_site_manager_phone" varchar,
  	"agency_security_officer_full_name" varchar,
  	"agency_security_officer_title" varchar,
  	"agency_security_officer_email" varchar,
  	"agency_security_officer_phone" varchar,
  	"agency_security_officer_program" varchar,
  	"website_info_site_name" varchar,
  	"website_info_accronym" varchar,
  	"website_info_agency" varchar,
  	"website_info_description" varchar,
  	"pii_check" "enum_site_auth_pii_check",
  	"sensitive_check" "enum_site_auth_sensitive_check",
  	"links_check" "enum_site_auth_links_check",
  	"format_check" "enum_site_auth_format_check",
  	"updated_by_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"_status" "enum_site_auth_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "_site_auth_v_version_third_party_reps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"third_party_representative_full_name" varchar,
  	"third_party_representative_title" varchar,
  	"third_party_representative_email" varchar,
  	"third_party_representative_phone" varchar,
  	"third_party_representative_company" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_site_auth_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_agency_owner_full_name" varchar,
  	"version_agency_owner_title" varchar,
  	"version_agency_owner_email" varchar,
  	"version_agency_owner_phone" varchar,
  	"version_agency_site_manager_full_name" varchar,
  	"version_agency_site_manager_title" varchar,
  	"version_agency_site_manager_email" varchar,
  	"version_agency_site_manager_phone" varchar,
  	"version_agency_security_officer_full_name" varchar,
  	"version_agency_security_officer_title" varchar,
  	"version_agency_security_officer_email" varchar,
  	"version_agency_security_officer_phone" varchar,
  	"version_agency_security_officer_program" varchar,
  	"version_website_info_site_name" varchar,
  	"version_website_info_accronym" varchar,
  	"version_website_info_agency" varchar,
  	"version_website_info_description" varchar,
  	"version_pii_check" "enum__site_auth_v_version_pii_check",
  	"version_sensitive_check" "enum__site_auth_v_version_sensitive_check",
  	"version_links_check" "enum__site_auth_v_version_links_check",
  	"version_format_check" "enum__site_auth_v_version_format_check",
  	"version_updated_by_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version__status" "enum__site_auth_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_auth_site_collection_id" integer;
  ALTER TABLE "site_auth_site_collection_third_party_reps" ADD CONSTRAINT "site_auth_site_collection_third_party_reps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_auth_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_auth_site_collection" ADD CONSTRAINT "site_auth_site_collection_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_auth_site_collection" ADD CONSTRAINT "site_auth_site_collection_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_auth_site_collection_v_version_third_party_reps" ADD CONSTRAINT "_site_auth_site_collection_v_version_third_party_reps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_auth_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_auth_site_collection_v" ADD CONSTRAINT "_site_auth_site_collection_v_parent_id_site_auth_site_collection_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_auth_site_collection"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_auth_site_collection_v" ADD CONSTRAINT "_site_auth_site_collection_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_auth_site_collection_v" ADD CONSTRAINT "_site_auth_site_collection_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_auth_third_party_reps" ADD CONSTRAINT "site_auth_third_party_reps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_auth"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_auth" ADD CONSTRAINT "site_auth_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_auth_v_version_third_party_reps" ADD CONSTRAINT "_site_auth_v_version_third_party_reps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_auth_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_auth_v" ADD CONSTRAINT "_site_auth_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_auth_site_collection_third_party_reps_order_idx" ON "site_auth_site_collection_third_party_reps" USING btree ("_order");
  CREATE INDEX "site_auth_site_collection_third_party_reps_parent_id_idx" ON "site_auth_site_collection_third_party_reps" USING btree ("_parent_id");
  CREATE INDEX "site_auth_site_collection_updated_by_idx" ON "site_auth_site_collection" USING btree ("updated_by_id");
  CREATE INDEX "site_auth_site_collection_site_idx" ON "site_auth_site_collection" USING btree ("site_id");
  CREATE INDEX "site_auth_site_collection_updated_at_idx" ON "site_auth_site_collection" USING btree ("updated_at");
  CREATE INDEX "site_auth_site_collection_created_at_idx" ON "site_auth_site_collection" USING btree ("created_at");
  CREATE INDEX "site_auth_site_collection__status_idx" ON "site_auth_site_collection" USING btree ("_status");
  CREATE INDEX "_site_auth_site_collection_v_version_third_party_reps_order_idx" ON "_site_auth_site_collection_v_version_third_party_reps" USING btree ("_order");
  CREATE INDEX "_site_auth_site_collection_v_version_third_party_reps_parent_id_idx" ON "_site_auth_site_collection_v_version_third_party_reps" USING btree ("_parent_id");
  CREATE INDEX "_site_auth_site_collection_v_parent_idx" ON "_site_auth_site_collection_v" USING btree ("parent_id");
  CREATE INDEX "_site_auth_site_collection_v_version_version_updated_by_idx" ON "_site_auth_site_collection_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_site_auth_site_collection_v_version_version_site_idx" ON "_site_auth_site_collection_v" USING btree ("version_site_id");
  CREATE INDEX "_site_auth_site_collection_v_version_version_updated_at_idx" ON "_site_auth_site_collection_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_auth_site_collection_v_version_version_created_at_idx" ON "_site_auth_site_collection_v" USING btree ("version_created_at");
  CREATE INDEX "_site_auth_site_collection_v_version_version__status_idx" ON "_site_auth_site_collection_v" USING btree ("version__status");
  CREATE INDEX "_site_auth_site_collection_v_created_at_idx" ON "_site_auth_site_collection_v" USING btree ("created_at");
  CREATE INDEX "_site_auth_site_collection_v_updated_at_idx" ON "_site_auth_site_collection_v" USING btree ("updated_at");
  CREATE INDEX "_site_auth_site_collection_v_latest_idx" ON "_site_auth_site_collection_v" USING btree ("latest");
  CREATE INDEX "_site_auth_site_collection_v_autosave_idx" ON "_site_auth_site_collection_v" USING btree ("autosave");
  CREATE INDEX "site_auth_third_party_reps_order_idx" ON "site_auth_third_party_reps" USING btree ("_order");
  CREATE INDEX "site_auth_third_party_reps_parent_id_idx" ON "site_auth_third_party_reps" USING btree ("_parent_id");
  CREATE INDEX "site_auth_updated_by_idx" ON "site_auth" USING btree ("updated_by_id");
  CREATE INDEX "site_auth__status_idx" ON "site_auth" USING btree ("_status");
  CREATE INDEX "_site_auth_v_version_third_party_reps_order_idx" ON "_site_auth_v_version_third_party_reps" USING btree ("_order");
  CREATE INDEX "_site_auth_v_version_third_party_reps_parent_id_idx" ON "_site_auth_v_version_third_party_reps" USING btree ("_parent_id");
  CREATE INDEX "_site_auth_v_version_version_updated_by_idx" ON "_site_auth_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_site_auth_v_version_version__status_idx" ON "_site_auth_v" USING btree ("version__status");
  CREATE INDEX "_site_auth_v_created_at_idx" ON "_site_auth_v" USING btree ("created_at");
  CREATE INDEX "_site_auth_v_updated_at_idx" ON "_site_auth_v" USING btree ("updated_at");
  CREATE INDEX "_site_auth_v_latest_idx" ON "_site_auth_v" USING btree ("latest");
  CREATE INDEX "_site_auth_v_autosave_idx" ON "_site_auth_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_auth_site_collection_fk" FOREIGN KEY ("site_auth_site_collection_id") REFERENCES "public"."site_auth_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_site_auth_site_collection__idx" ON "payload_locked_documents_rels" USING btree ("site_auth_site_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_auth_site_collection_third_party_reps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_auth_site_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_auth_site_collection_v_version_third_party_reps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_auth_site_collection_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_auth_third_party_reps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_auth" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_auth_v_version_third_party_reps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_auth_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_auth_site_collection_third_party_reps" CASCADE;
  DROP TABLE "site_auth_site_collection" CASCADE;
  DROP TABLE "_site_auth_site_collection_v_version_third_party_reps" CASCADE;
  DROP TABLE "_site_auth_site_collection_v" CASCADE;
  DROP TABLE "site_auth_third_party_reps" CASCADE;
  DROP TABLE "site_auth" CASCADE;
  DROP TABLE "_site_auth_v_version_third_party_reps" CASCADE;
  DROP TABLE "_site_auth_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_site_auth_site_collection_fk";

  DROP INDEX "payload_locked_documents_rels_site_auth_site_collection__idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_auth_site_collection_id";
  DROP TYPE "public"."enum_site_auth_site_collection_pii_check";
  DROP TYPE "public"."enum_site_auth_site_collection_sensitive_check";
  DROP TYPE "public"."enum_site_auth_site_collection_links_check";
  DROP TYPE "public"."enum_site_auth_site_collection_format_check";
  DROP TYPE "public"."enum_site_auth_site_collection_status";
  DROP TYPE "public"."enum__site_auth_site_collection_v_version_pii_check";
  DROP TYPE "public"."enum__site_auth_site_collection_v_version_sensitive_check";
  DROP TYPE "public"."enum__site_auth_site_collection_v_version_links_check";
  DROP TYPE "public"."enum__site_auth_site_collection_v_version_format_check";
  DROP TYPE "public"."enum__site_auth_site_collection_v_version_status";
  DROP TYPE "public"."enum_site_auth_pii_check";
  DROP TYPE "public"."enum_site_auth_sensitive_check";
  DROP TYPE "public"."enum_site_auth_links_check";
  DROP TYPE "public"."enum_site_auth_format_check";
  DROP TYPE "public"."enum_site_auth_status";
  DROP TYPE "public"."enum__site_auth_v_version_pii_check";
  DROP TYPE "public"."enum__site_auth_v_version_sensitive_check";
  DROP TYPE "public"."enum__site_auth_v_version_links_check";
  DROP TYPE "public"."enum__site_auth_v_version_format_check";
  DROP TYPE "public"."enum__site_auth_v_version_status";`)
}
