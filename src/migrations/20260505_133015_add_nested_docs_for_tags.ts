import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tags_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  ALTER TABLE "tags" ADD COLUMN "parent_id" integer;
  ALTER TABLE "tags_breadcrumbs" ADD CONSTRAINT "tags_breadcrumbs_doc_id_tags_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_breadcrumbs" ADD CONSTRAINT "tags_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tags_breadcrumbs_order_idx" ON "tags_breadcrumbs" USING btree ("_order");
  CREATE INDEX "tags_breadcrumbs_parent_id_idx" ON "tags_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "tags_breadcrumbs_doc_idx" ON "tags_breadcrumbs" USING btree ("doc_id");
  ALTER TABLE "tags" ADD CONSTRAINT "tags_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tags_parent_idx" ON "tags" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tags_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tags_breadcrumbs" CASCADE;
  ALTER TABLE "tags" DROP CONSTRAINT "tags_parent_id_tags_id_fk";
  
  DROP INDEX "tags_parent_idx";
  ALTER TABLE "tags" DROP COLUMN "parent_id";`)
}
