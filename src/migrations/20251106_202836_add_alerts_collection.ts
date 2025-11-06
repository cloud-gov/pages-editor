import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_alerts_type" AS ENUM('info', 'warning', 'success', 'error', 'emergency');
  CREATE TYPE "public"."enum_alerts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__alerts_v_version_type" AS ENUM('info', 'warning', 'success', 'error', 'emergency');
  CREATE TYPE "public"."enum__alerts_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "alerts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"type" "enum_alerts_type" DEFAULT 'info',
  	"is_active" boolean DEFAULT false,
  	"publish_date" timestamp(3) with time zone,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_alerts_status" DEFAULT 'draft'
  );

  CREATE TABLE "_alerts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_type" "enum__alerts_v_version_type" DEFAULT 'info',
  	"version_is_active" boolean DEFAULT false,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__alerts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "alerts_id" integer;
  ALTER TABLE "alerts" ADD CONSTRAINT "alerts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_alerts_v" ADD CONSTRAINT "_alerts_v_parent_id_alerts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."alerts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_alerts_v" ADD CONSTRAINT "_alerts_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "alerts_site_idx" ON "alerts" USING btree ("site_id");
  CREATE INDEX "alerts_updated_at_idx" ON "alerts" USING btree ("updated_at");
  CREATE INDEX "alerts_created_at_idx" ON "alerts" USING btree ("created_at");
  CREATE INDEX "alerts__status_idx" ON "alerts" USING btree ("_status");
  CREATE INDEX "_alerts_v_parent_idx" ON "_alerts_v" USING btree ("parent_id");
  CREATE INDEX "_alerts_v_version_version_site_idx" ON "_alerts_v" USING btree ("version_site_id");
  CREATE INDEX "_alerts_v_version_version_updated_at_idx" ON "_alerts_v" USING btree ("version_updated_at");
  CREATE INDEX "_alerts_v_version_version_created_at_idx" ON "_alerts_v" USING btree ("version_created_at");
  CREATE INDEX "_alerts_v_version_version__status_idx" ON "_alerts_v" USING btree ("version__status");
  CREATE INDEX "_alerts_v_created_at_idx" ON "_alerts_v" USING btree ("created_at");
  CREATE INDEX "_alerts_v_updated_at_idx" ON "_alerts_v" USING btree ("updated_at");
  CREATE INDEX "_alerts_v_latest_idx" ON "_alerts_v" USING btree ("latest");
  CREATE INDEX "_alerts_v_autosave_idx" ON "_alerts_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alerts_fk" FOREIGN KEY ("alerts_id") REFERENCES "public"."alerts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_alerts_id_idx" ON "payload_locked_documents_rels" USING btree ("alerts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "alerts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_alerts_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "alerts" CASCADE;
  DROP TABLE "_alerts_v" CASCADE;

  DROP INDEX IF EXISTS "payload_locked_documents_rels_alerts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "alerts_id";
  DROP TYPE "public"."enum_alerts_type";
  DROP TYPE "public"."enum_alerts_status";
  DROP TYPE "public"."enum__alerts_v_version_type";
  DROP TYPE "public"."enum__alerts_v_version_status";`)
}
