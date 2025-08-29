import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leadership_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__leadership_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "leadership" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"job_title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"content" jsonb,
  	"site_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_leadership_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_leadership_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_job_title" varchar,
  	"version_description" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_content" jsonb,
  	"version_site_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__leadership_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leadership_id" integer;
  ALTER TABLE "leadership" ADD CONSTRAINT "leadership_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leadership" ADD CONSTRAINT "leadership_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leadership_v" ADD CONSTRAINT "_leadership_v_parent_id_leadership_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leadership"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leadership_v" ADD CONSTRAINT "_leadership_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leadership_v" ADD CONSTRAINT "_leadership_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "leadership_image_idx" ON "leadership" USING btree ("image_id");
  CREATE INDEX "leadership_site_idx" ON "leadership" USING btree ("site_id");
  CREATE INDEX "leadership_slug_idx" ON "leadership" USING btree ("slug");
  CREATE INDEX "leadership_updated_at_idx" ON "leadership" USING btree ("updated_at");
  CREATE INDEX "leadership_created_at_idx" ON "leadership" USING btree ("created_at");
  CREATE INDEX "leadership__status_idx" ON "leadership" USING btree ("_status");
  CREATE INDEX "_leadership_v_parent_idx" ON "_leadership_v" USING btree ("parent_id");
  CREATE INDEX "_leadership_v_version_version_image_idx" ON "_leadership_v" USING btree ("version_image_id");
  CREATE INDEX "_leadership_v_version_version_site_idx" ON "_leadership_v" USING btree ("version_site_id");
  CREATE INDEX "_leadership_v_version_version_slug_idx" ON "_leadership_v" USING btree ("version_slug");
  CREATE INDEX "_leadership_v_version_version_updated_at_idx" ON "_leadership_v" USING btree ("version_updated_at");
  CREATE INDEX "_leadership_v_version_version_created_at_idx" ON "_leadership_v" USING btree ("version_created_at");
  CREATE INDEX "_leadership_v_version_version__status_idx" ON "_leadership_v" USING btree ("version__status");
  CREATE INDEX "_leadership_v_created_at_idx" ON "_leadership_v" USING btree ("created_at");
  CREATE INDEX "_leadership_v_updated_at_idx" ON "_leadership_v" USING btree ("updated_at");
  CREATE INDEX "_leadership_v_latest_idx" ON "_leadership_v" USING btree ("latest");
  CREATE INDEX "_leadership_v_autosave_idx" ON "_leadership_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leadership_fk" FOREIGN KEY ("leadership_id") REFERENCES "public"."leadership"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_leadership_id_idx" ON "payload_locked_documents_rels" USING btree ("leadership_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Drop tables first (CASCADE will handle dependent objects)
  await db.execute(sql`
   ALTER TABLE "leadership" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_leadership_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "leadership" CASCADE;
  DROP TABLE "_leadership_v" CASCADE;`)

  // Drop the column and types (these should be safe to drop)
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "leadership_id";
  DROP TYPE IF EXISTS "public"."enum_leadership_status";
  DROP TYPE IF EXISTS "public"."enum__leadership_v_version_status";`)
}
