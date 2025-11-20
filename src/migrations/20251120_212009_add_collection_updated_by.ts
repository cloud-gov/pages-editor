import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "news" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_news_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "reports" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_reports_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "resources" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_resources_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_updated_by_idx" ON "posts" USING btree ("updated_by_id");
  CREATE INDEX "_posts_v_version_version_updated_by_idx" ON "_posts_v" USING btree ("version_updated_by_id");
  CREATE INDEX "news_updated_by_idx" ON "news" USING btree ("updated_by_id");
  CREATE INDEX "_news_v_version_version_updated_by_idx" ON "_news_v" USING btree ("version_updated_by_id");
  CREATE INDEX "reports_updated_by_idx" ON "reports" USING btree ("updated_by_id");
  CREATE INDEX "_reports_v_version_version_updated_by_idx" ON "_reports_v" USING btree ("version_updated_by_id");
  CREATE INDEX "resources_updated_by_idx" ON "resources" USING btree ("updated_by_id");
  CREATE INDEX "_resources_v_version_version_updated_by_idx" ON "_resources_v" USING btree ("version_updated_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP CONSTRAINT "posts_updated_by_id_users_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "news" DROP CONSTRAINT "news_updated_by_id_users_id_fk";
  
  ALTER TABLE "_news_v" DROP CONSTRAINT "_news_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "reports" DROP CONSTRAINT "reports_updated_by_id_users_id_fk";
  
  ALTER TABLE "_reports_v" DROP CONSTRAINT "_reports_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "resources" DROP CONSTRAINT "resources_updated_by_id_users_id_fk";
  
  ALTER TABLE "_resources_v" DROP CONSTRAINT "_resources_v_version_updated_by_id_users_id_fk";
  
  DROP INDEX "posts_updated_by_idx";
  DROP INDEX "_posts_v_version_version_updated_by_idx";
  DROP INDEX "news_updated_by_idx";
  DROP INDEX "_news_v_version_version_updated_by_idx";
  DROP INDEX "reports_updated_by_idx";
  DROP INDEX "_reports_v_version_version_updated_by_idx";
  DROP INDEX "resources_updated_by_idx";
  DROP INDEX "_resources_v_version_version_updated_by_idx";
  ALTER TABLE "posts" DROP COLUMN "updated_by_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "news" DROP COLUMN "updated_by_id";
  ALTER TABLE "_news_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "reports" DROP COLUMN "updated_by_id";
  ALTER TABLE "_reports_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "resources" DROP COLUMN "updated_by_id";
  ALTER TABLE "_resources_v" DROP COLUMN "version_updated_by_id";`)
}
