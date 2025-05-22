import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" RENAME COLUMN "subtitle" TO "excerpt";
  ALTER TABLE "_reports_v" RENAME COLUMN "version_subtitle" TO "version_excerpt";
  ALTER TABLE "posts" ALTER COLUMN "review_ready" SET DEFAULT false;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_review_ready" SET DEFAULT false;
  ALTER TABLE "events" ALTER COLUMN "review_ready" SET DEFAULT false;
  ALTER TABLE "_events_v" ALTER COLUMN "version_review_ready" SET DEFAULT false;
  ALTER TABLE "news" ALTER COLUMN "review_ready" SET DEFAULT false;
  ALTER TABLE "_news_v" ALTER COLUMN "version_review_ready" SET DEFAULT false;
  ALTER TABLE "reports" ALTER COLUMN "review_ready" SET DEFAULT false;
  ALTER TABLE "_reports_v" ALTER COLUMN "version_review_ready" SET DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" RENAME COLUMN "excerpt" TO "subtitle";
  ALTER TABLE "_reports_v" RENAME COLUMN "version_excerpt" TO "version_subtitle";
  ALTER TABLE "posts" ALTER COLUMN "review_ready" DROP DEFAULT;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_review_ready" DROP DEFAULT;
  ALTER TABLE "events" ALTER COLUMN "review_ready" DROP DEFAULT;
  ALTER TABLE "_events_v" ALTER COLUMN "version_review_ready" DROP DEFAULT;
  ALTER TABLE "news" ALTER COLUMN "review_ready" DROP DEFAULT;
  ALTER TABLE "_news_v" ALTER COLUMN "version_review_ready" DROP DEFAULT;
  ALTER TABLE "reports" ALTER COLUMN "review_ready" DROP DEFAULT;
  ALTER TABLE "_reports_v" ALTER COLUMN "version_review_ready" DROP DEFAULT;`)
}
