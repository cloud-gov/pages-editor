import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tag_types_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tag_types_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "tag_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT false,
  	"description" varchar,
  	"updated_by_id" integer,
  	"review_ready" boolean DEFAULT false,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tag_types_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_tag_types_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT false,
  	"version_description" varchar,
  	"version_updated_by_id" integer,
  	"version_review_ready" boolean DEFAULT false,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tag_types_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "tags" ADD COLUMN "tag_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tag_types_id" integer;
  ALTER TABLE "tag_types" ADD CONSTRAINT "tag_types_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tag_types" ADD CONSTRAINT "tag_types_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tag_types_v" ADD CONSTRAINT "_tag_types_v_parent_id_tag_types_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tag_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tag_types_v" ADD CONSTRAINT "_tag_types_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tag_types_v" ADD CONSTRAINT "_tag_types_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tag_types_slug_idx" ON "tag_types" USING btree ("slug");
  CREATE INDEX "tag_types_updated_by_idx" ON "tag_types" USING btree ("updated_by_id");
  CREATE INDEX "tag_types_site_idx" ON "tag_types" USING btree ("site_id");
  CREATE INDEX "tag_types_updated_at_idx" ON "tag_types" USING btree ("updated_at");
  CREATE INDEX "tag_types_created_at_idx" ON "tag_types" USING btree ("created_at");
  CREATE INDEX "tag_types__status_idx" ON "tag_types" USING btree ("_status");
  CREATE INDEX "_tag_types_v_parent_idx" ON "_tag_types_v" USING btree ("parent_id");
  CREATE INDEX "_tag_types_v_version_version_slug_idx" ON "_tag_types_v" USING btree ("version_slug");
  CREATE INDEX "_tag_types_v_version_version_updated_by_idx" ON "_tag_types_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_tag_types_v_version_version_site_idx" ON "_tag_types_v" USING btree ("version_site_id");
  CREATE INDEX "_tag_types_v_version_version_updated_at_idx" ON "_tag_types_v" USING btree ("version_updated_at");
  CREATE INDEX "_tag_types_v_version_version_created_at_idx" ON "_tag_types_v" USING btree ("version_created_at");
  CREATE INDEX "_tag_types_v_version_version__status_idx" ON "_tag_types_v" USING btree ("version__status");
  CREATE INDEX "_tag_types_v_created_at_idx" ON "_tag_types_v" USING btree ("created_at");
  CREATE INDEX "_tag_types_v_updated_at_idx" ON "_tag_types_v" USING btree ("updated_at");
  CREATE INDEX "_tag_types_v_latest_idx" ON "_tag_types_v" USING btree ("latest");
  CREATE INDEX "_tag_types_v_autosave_idx" ON "_tag_types_v" USING btree ("autosave");
  ALTER TABLE "tags" ADD CONSTRAINT "tags_tag_types_id_tag_types_id_fk" FOREIGN KEY ("tag_types_id") REFERENCES "public"."tag_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tag_types_fk" FOREIGN KEY ("tag_types_id") REFERENCES "public"."tag_types"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tags_tag_types_idx" ON "tags" USING btree ("tag_types_id");
  CREATE INDEX "payload_locked_documents_rels_tag_types_id_idx" ON "payload_locked_documents_rels" USING btree ("tag_types_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "payload_locked_documents_rels"
      DROP CONSTRAINT "payload_locked_documents_rels_tag_types_fk";

    DROP INDEX IF EXISTS "payload_locked_documents_rels_tag_types_id_idx";

    ALTER TABLE IF EXISTS "tags" DROP CONSTRAINT "tags_tag_types_id_tag_types_id_fk";
      DROP INDEX IF EXISTS "tags_tag_types_idx";
    ALTER TABLE IF EXISTS "tags" DROP COLUMN "tag_types_id";

    ALTER TABLE IF EXISTS "payload_locked_documents_rels" 
      DROP COLUMN IF EXISTS "tag_types_id";

    ALTER TABLE IF EXISTS "tag_types" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS "_tag_types_v" DISABLE ROW LEVEL SECURITY;

    DROP TABLE IF EXISTS "_tag_types_v" CASCADE;
    DROP TABLE IF EXISTS "tag_types" CASCADE;
  
    DROP TYPE IF EXISTS "public"."enum_tag_types_status";
    DROP TYPE IF EXISTS "public"."enum__tag_types_v_version_status";`)
}
