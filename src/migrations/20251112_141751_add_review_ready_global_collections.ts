import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_site_collection' AND column_name='review_ready') THEN
        ALTER TABLE "menu_site_collection" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_menu_site_collection_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_menu_site_collection_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_config_site_collection' AND column_name='review_ready') THEN
        ALTER TABLE "site_config_site_collection" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_site_config_site_collection_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='home_page_site_collection' AND column_name='review_ready') THEN
        ALTER TABLE "home_page_site_collection" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_home_page_site_collection_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_home_page_site_collection_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pre_footer_site_collection' AND column_name='review_ready') THEN
        ALTER TABLE "pre_footer_site_collection" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_pre_footer_site_collection_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_pre_footer_site_collection_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='side_navigation_site_collection' AND column_name='review_ready') THEN
        ALTER TABLE "side_navigation_site_collection" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_side_navigation_site_collection_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_side_navigation_site_collection_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_config' AND column_name='review_ready') THEN
        ALTER TABLE "site_config" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_site_config_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_site_config_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu' AND column_name='review_ready') THEN
        ALTER TABLE "menu" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_menu_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_menu_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='home_page' AND column_name='review_ready') THEN
        ALTER TABLE "home_page" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_home_page_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_home_page_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pre_footer' AND column_name='review_ready') THEN
        ALTER TABLE "pre_footer" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_pre_footer_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_pre_footer_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='side_navigation' AND column_name='review_ready') THEN
        ALTER TABLE "side_navigation" ADD COLUMN "review_ready" boolean DEFAULT false;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_side_navigation_v' AND column_name='version_review_ready') THEN
        ALTER TABLE "_side_navigation_v" ADD COLUMN "version_review_ready" boolean DEFAULT false;
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_site_collection' AND column_name='review_ready') THEN
      ALTER TABLE "menu_site_collection" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_menu_site_collection_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_menu_site_collection_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_config_site_collection' AND column_name='review_ready') THEN
      ALTER TABLE "site_config_site_collection" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_site_config_site_collection_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='home_page_site_collection' AND column_name='review_ready') THEN
      ALTER TABLE "home_page_site_collection" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_home_page_site_collection_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_home_page_site_collection_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pre_footer_site_collection' AND column_name='review_ready') THEN
      ALTER TABLE "pre_footer_site_collection" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_pre_footer_site_collection_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_pre_footer_site_collection_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='side_navigation_site_collection' AND column_name='review_ready') THEN
      ALTER TABLE "side_navigation_site_collection" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_side_navigation_site_collection_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_side_navigation_site_collection_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_config' AND column_name='review_ready') THEN
      ALTER TABLE "site_config" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_site_config_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_site_config_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu' AND column_name='review_ready') THEN
      ALTER TABLE "menu" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_menu_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_menu_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='home_page' AND column_name='review_ready') THEN
      ALTER TABLE "home_page" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_home_page_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_home_page_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pre_footer' AND column_name='review_ready') THEN
      ALTER TABLE "pre_footer" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_pre_footer_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_pre_footer_v" DROP COLUMN "version_review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='side_navigation' AND column_name='review_ready') THEN
      ALTER TABLE "side_navigation" DROP COLUMN "review_ready";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_side_navigation_v' AND column_name='version_review_ready') THEN
      ALTER TABLE "_side_navigation_v" DROP COLUMN "version_review_ready";
    END IF;
  END $$;`)
}
