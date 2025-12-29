import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "events" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_events_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "news" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_news_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "reports" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_reports_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "resources" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_resources_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "leadership" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_leadership_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "custom_collections" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_custom_collections_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "custom_collection_pages" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_custom_collection_pages_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "pages" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "policies" ALTER COLUMN "slug_lock" SET DEFAULT false;
  ALTER TABLE "_policies_v" ALTER COLUMN "version_slug_lock" SET DEFAULT false;
  ALTER TABLE "categories" ALTER COLUMN "slug_lock" SET DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "events" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_events_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "news" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_news_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "reports" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_reports_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "resources" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_resources_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "leadership" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_leadership_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "custom_collections" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_custom_collections_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "custom_collection_pages" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_custom_collection_pages_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "pages" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "policies" ALTER COLUMN "slug_lock" SET DEFAULT true;
  ALTER TABLE "_policies_v" ALTER COLUMN "version_slug_lock" SET DEFAULT true;
  ALTER TABLE "categories" ALTER COLUMN "slug_lock" SET DEFAULT true;`)
}
