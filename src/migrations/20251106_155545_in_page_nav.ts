import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ 
   BEGIN
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "posts" ADD COLUMN "show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_posts_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_posts_v" ADD COLUMN "version_show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "events" ADD COLUMN "show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_events_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_events_v" ADD COLUMN "version_show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "news" ADD COLUMN "show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_news_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_news_v" ADD COLUMN "version_show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "reports" ADD COLUMN "show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_reports_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_reports_v" ADD COLUMN "version_show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "resources" ADD COLUMN "show_in_page_nav" boolean DEFAULT true;
     END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_resources_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_resources_v" ADD COLUMN "version_show_in_page_nav" boolean DEFAULT true;
     END IF;
   END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ 
   BEGIN
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "posts" DROP COLUMN "show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_posts_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_posts_v" DROP COLUMN "version_show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "events" DROP COLUMN "show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_events_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_events_v" DROP COLUMN "version_show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "news" DROP COLUMN "show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_news_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_news_v" DROP COLUMN "version_show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "reports" DROP COLUMN "show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_reports_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_reports_v" DROP COLUMN "version_show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='show_in_page_nav') THEN
       ALTER TABLE "resources" DROP COLUMN "show_in_page_nav";
     END IF;
     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_resources_v' AND column_name='version_show_in_page_nav') THEN
       ALTER TABLE "_resources_v" DROP COLUMN "version_show_in_page_nav";
     END IF;
   END $$;`)
}
