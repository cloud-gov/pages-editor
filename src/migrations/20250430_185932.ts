import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "review_ready" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "version_review_ready" boolean;
  ALTER TABLE "events" ADD COLUMN "review_ready" boolean;
  ALTER TABLE "_events_v" ADD COLUMN "version_review_ready" boolean;
  ALTER TABLE "news" ADD COLUMN "review_ready" boolean;
  ALTER TABLE "_news_v" ADD COLUMN "version_review_ready" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN IF EXISTS "review_ready";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_review_ready";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "review_ready";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_review_ready";
  ALTER TABLE "news" DROP COLUMN IF EXISTS "review_ready";
  ALTER TABLE "_news_v" DROP COLUMN IF EXISTS "version_review_ready";`)
}
