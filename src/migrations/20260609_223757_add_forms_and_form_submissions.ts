import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_forms_fields_field_type" AS ENUM('text', 'email', 'textarea', 'number', 'phone', 'select', 'radio', 'checkbox', 'date');
  CREATE TYPE "public"."enum_site_forms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_forms_v_version_fields_field_type" AS ENUM('text', 'email', 'textarea', 'number', 'phone', 'select', 'radio', 'checkbox', 'date');
  CREATE TYPE "public"."enum__site_forms_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_form_submissions_status" AS ENUM('pending', 'reviewed', 'spam', 'archived');
  CREATE TABLE "collection_entries_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "_collection_entries_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "home_page_site_collection_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "_home_page_site_collection_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "site_forms_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );

  CREATE TABLE "site_forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_type" "enum_site_forms_fields_field_type",
  	"name" varchar,
  	"label" varchar,
  	"help_text" varchar,
  	"placeholder" varchar,
  	"required" boolean DEFAULT false
  );

  CREATE TABLE "site_forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"settings_submit_button_text" varchar DEFAULT 'Submit',
  	"settings_success_message" varchar DEFAULT 'Thank you for your submission!',
  	"settings_notification_email" varchar,
  	"review_ready" boolean DEFAULT false,
  	"updated_by_id" integer,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_forms_status" DEFAULT 'draft'
  );

  CREATE TABLE "_site_forms_v_version_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_site_forms_v_version_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"field_type" "enum__site_forms_v_version_fields_field_type",
  	"name" varchar,
  	"label" varchar,
  	"help_text" varchar,
  	"placeholder" varchar,
  	"required" boolean DEFAULT false,
  	"_uuid" varchar
  );

  CREATE TABLE "_site_forms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_settings_submit_button_text" varchar DEFAULT 'Submit',
  	"version_settings_success_message" varchar DEFAULT 'Thank you for your submission!',
  	"version_settings_notification_email" varchar,
  	"version_review_ready" boolean DEFAULT false,
  	"version_updated_by_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_forms_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE "site_form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"data" jsonb NOT NULL,
  	"status" "enum_site_form_submissions_status" DEFAULT 'pending',
  	"metadata_submitted_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"site_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "home_page_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "_home_page_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"form_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_form_submissions_id" integer;
  ALTER TABLE "collection_entries_blocks_form_block" ADD CONSTRAINT "collection_entries_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_entries_blocks_form_block" ADD CONSTRAINT "collection_entries_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_form_block" ADD CONSTRAINT "_collection_entries_v_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_collection_entries_v_blocks_form_block" ADD CONSTRAINT "_collection_entries_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_collection_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_form_block" ADD CONSTRAINT "home_page_site_collection_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_site_collection_blocks_form_block" ADD CONSTRAINT "home_page_site_collection_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_form_block" ADD CONSTRAINT "_home_page_site_collection_v_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_site_collection_v_blocks_form_block" ADD CONSTRAINT "_home_page_site_collection_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_forms_fields_options" ADD CONSTRAINT "site_forms_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_forms_fields" ADD CONSTRAINT "site_forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_forms" ADD CONSTRAINT "site_forms_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_forms" ADD CONSTRAINT "site_forms_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_forms_v_version_fields_options" ADD CONSTRAINT "_site_forms_v_version_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_forms_v_version_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_forms_v_version_fields" ADD CONSTRAINT "_site_forms_v_version_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_forms_v" ADD CONSTRAINT "_site_forms_v_parent_id_site_forms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_forms_v" ADD CONSTRAINT "_site_forms_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_forms_v" ADD CONSTRAINT "_site_forms_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_form_submissions" ADD CONSTRAINT "site_form_submissions_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_form_submissions" ADD CONSTRAINT "site_form_submissions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_form_block" ADD CONSTRAINT "home_page_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_blocks_form_block" ADD CONSTRAINT "home_page_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_form_block" ADD CONSTRAINT "_home_page_v_blocks_form_block_form_id_site_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."site_forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_blocks_form_block" ADD CONSTRAINT "_home_page_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "collection_entries_blocks_form_block_order_idx" ON "collection_entries_blocks_form_block" USING btree ("_order");
  CREATE INDEX "collection_entries_blocks_form_block_parent_id_idx" ON "collection_entries_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "collection_entries_blocks_form_block_path_idx" ON "collection_entries_blocks_form_block" USING btree ("_path");
  CREATE INDEX "collection_entries_blocks_form_block_form_idx" ON "collection_entries_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_collection_entries_v_blocks_form_block_order_idx" ON "_collection_entries_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_collection_entries_v_blocks_form_block_parent_id_idx" ON "_collection_entries_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_collection_entries_v_blocks_form_block_path_idx" ON "_collection_entries_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_collection_entries_v_blocks_form_block_form_idx" ON "_collection_entries_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "home_page_site_collection_blocks_form_block_order_idx" ON "home_page_site_collection_blocks_form_block" USING btree ("_order");
  CREATE INDEX "home_page_site_collection_blocks_form_block_parent_id_idx" ON "home_page_site_collection_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_site_collection_blocks_form_block_path_idx" ON "home_page_site_collection_blocks_form_block" USING btree ("_path");
  CREATE INDEX "home_page_site_collection_blocks_form_block_form_idx" ON "home_page_site_collection_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_form_block_order_idx" ON "_home_page_site_collection_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_home_page_site_collection_v_blocks_form_block_parent_id_idx" ON "_home_page_site_collection_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_site_collection_v_blocks_form_block_path_idx" ON "_home_page_site_collection_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_home_page_site_collection_v_blocks_form_block_form_idx" ON "_home_page_site_collection_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "site_forms_fields_options_order_idx" ON "site_forms_fields_options" USING btree ("_order");
  CREATE INDEX "site_forms_fields_options_parent_id_idx" ON "site_forms_fields_options" USING btree ("_parent_id");
  CREATE INDEX "site_forms_fields_order_idx" ON "site_forms_fields" USING btree ("_order");
  CREATE INDEX "site_forms_fields_parent_id_idx" ON "site_forms_fields" USING btree ("_parent_id");
  CREATE INDEX "site_forms_updated_by_idx" ON "site_forms" USING btree ("updated_by_id");
  CREATE INDEX "site_forms_site_idx" ON "site_forms" USING btree ("site_id");
  CREATE INDEX "site_forms_updated_at_idx" ON "site_forms" USING btree ("updated_at");
  CREATE INDEX "site_forms_created_at_idx" ON "site_forms" USING btree ("created_at");
  CREATE INDEX "site_forms__status_idx" ON "site_forms" USING btree ("_status");
  CREATE INDEX "_site_forms_v_version_fields_options_order_idx" ON "_site_forms_v_version_fields_options" USING btree ("_order");
  CREATE INDEX "_site_forms_v_version_fields_options_parent_id_idx" ON "_site_forms_v_version_fields_options" USING btree ("_parent_id");
  CREATE INDEX "_site_forms_v_version_fields_order_idx" ON "_site_forms_v_version_fields" USING btree ("_order");
  CREATE INDEX "_site_forms_v_version_fields_parent_id_idx" ON "_site_forms_v_version_fields" USING btree ("_parent_id");
  CREATE INDEX "_site_forms_v_parent_idx" ON "_site_forms_v" USING btree ("parent_id");
  CREATE INDEX "_site_forms_v_version_version_updated_by_idx" ON "_site_forms_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_site_forms_v_version_version_site_idx" ON "_site_forms_v" USING btree ("version_site_id");
  CREATE INDEX "_site_forms_v_version_version_updated_at_idx" ON "_site_forms_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_forms_v_version_version_created_at_idx" ON "_site_forms_v" USING btree ("version_created_at");
  CREATE INDEX "_site_forms_v_version_version__status_idx" ON "_site_forms_v" USING btree ("version__status");
  CREATE INDEX "_site_forms_v_created_at_idx" ON "_site_forms_v" USING btree ("created_at");
  CREATE INDEX "_site_forms_v_updated_at_idx" ON "_site_forms_v" USING btree ("updated_at");
  CREATE INDEX "_site_forms_v_latest_idx" ON "_site_forms_v" USING btree ("latest");
  CREATE INDEX "_site_forms_v_autosave_idx" ON "_site_forms_v" USING btree ("autosave");
  CREATE INDEX "site_form_submissions_form_idx" ON "site_form_submissions" USING btree ("form_id");
  CREATE INDEX "site_form_submissions_site_idx" ON "site_form_submissions" USING btree ("site_id");
  CREATE INDEX "site_form_submissions_updated_at_idx" ON "site_form_submissions" USING btree ("updated_at");
  CREATE INDEX "site_form_submissions_created_at_idx" ON "site_form_submissions" USING btree ("created_at");
  CREATE INDEX "home_page_blocks_form_block_order_idx" ON "home_page_blocks_form_block" USING btree ("_order");
  CREATE INDEX "home_page_blocks_form_block_parent_id_idx" ON "home_page_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "home_page_blocks_form_block_path_idx" ON "home_page_blocks_form_block" USING btree ("_path");
  CREATE INDEX "home_page_blocks_form_block_form_idx" ON "home_page_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_home_page_v_blocks_form_block_order_idx" ON "_home_page_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_home_page_v_blocks_form_block_parent_id_idx" ON "_home_page_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_blocks_form_block_path_idx" ON "_home_page_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_home_page_v_blocks_form_block_form_idx" ON "_home_page_v_blocks_form_block" USING btree ("form_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_forms_fk" FOREIGN KEY ("site_forms_id") REFERENCES "public"."site_forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_form_submissions_fk" FOREIGN KEY ("site_form_submissions_id") REFERENCES "public"."site_form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_site_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("site_forms_id");
  CREATE INDEX "payload_locked_documents_rels_site_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("site_form_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_entries_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_collection_entries_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_site_collection_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_site_collection_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_forms_fields_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_forms_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_forms_v_version_fields_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_forms_v_version_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_forms_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "collection_entries_blocks_form_block" CASCADE;
  DROP TABLE "_collection_entries_v_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "home_page_site_collection_blocks_form_block" CASCADE;
  DROP TABLE "_home_page_site_collection_v_blocks_form_block" CASCADE;
  DROP TABLE "site_forms_fields_options" CASCADE;
  DROP TABLE "site_forms_fields" CASCADE;
  DROP TABLE "site_forms" CASCADE;
  DROP TABLE "_site_forms_v_version_fields_options" CASCADE;
  DROP TABLE "_site_forms_v_version_fields" CASCADE;
  DROP TABLE "_site_forms_v" CASCADE;
  DROP TABLE "site_form_submissions" CASCADE;
  DROP TABLE "home_page_blocks_form_block" CASCADE;
  DROP TABLE "_home_page_v_blocks_form_block" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_site_forms_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_site_form_submissions_fk";

  DROP INDEX "payload_locked_documents_rels_site_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_site_form_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_form_submissions_id";
  DROP TYPE "public"."enum_site_forms_fields_field_type";
  DROP TYPE "public"."enum_site_forms_status";
  DROP TYPE "public"."enum__site_forms_v_version_fields_field_type";
  DROP TYPE "public"."enum__site_forms_v_version_status";
  DROP TYPE "public"."enum_site_form_submissions_status";`)
}
