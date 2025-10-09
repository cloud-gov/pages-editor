import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "events_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "_events_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "events_rels" DROP CONSTRAINT "events_rels_media_fk";
  
  ALTER TABLE "_events_v_rels" DROP CONSTRAINT "_events_v_rels_media_fk";
  
  DROP INDEX "events_rels_media_id_idx";
  DROP INDEX "_events_v_rels_media_id_idx";
  ALTER TABLE "events" ADD COLUMN "point_of_contact" varchar;
  ALTER TABLE "events" ADD COLUMN "point_of_contact_email" varchar;
  ALTER TABLE "events" ADD COLUMN "point_of_contact_phone" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_point_of_contact" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_point_of_contact_email" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_point_of_contact_phone" varchar;
  ALTER TABLE "events_attachments" ADD CONSTRAINT "events_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_attachments" ADD CONSTRAINT "events_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_attachments" ADD CONSTRAINT "_events_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_attachments" ADD CONSTRAINT "_events_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_attachments_order_idx" ON "events_attachments" USING btree ("_order");
  CREATE INDEX "events_attachments_parent_id_idx" ON "events_attachments" USING btree ("_parent_id");
  CREATE INDEX "events_attachments_file_idx" ON "events_attachments" USING btree ("file_id");
  CREATE INDEX "_events_v_version_attachments_order_idx" ON "_events_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_events_v_version_attachments_parent_id_idx" ON "_events_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_attachments_file_idx" ON "_events_v_version_attachments" USING btree ("file_id");
  ALTER TABLE "events_rels" DROP COLUMN "media_id";
  ALTER TABLE "_events_v_rels" DROP COLUMN "media_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_attachments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_attachments" CASCADE;
  DROP TABLE "_events_v_version_attachments" CASCADE;
  ALTER TABLE "events_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_events_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");
  ALTER TABLE "events" DROP COLUMN "point_of_contact";
  ALTER TABLE "events" DROP COLUMN "point_of_contact_email";
  ALTER TABLE "events" DROP COLUMN "point_of_contact_phone";
  ALTER TABLE "_events_v" DROP COLUMN "version_point_of_contact";
  ALTER TABLE "_events_v" DROP COLUMN "version_point_of_contact_email";
  ALTER TABLE "_events_v" DROP COLUMN "version_point_of_contact_phone";`)
}
