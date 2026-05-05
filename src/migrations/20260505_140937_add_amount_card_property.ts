import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_collection_entries_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  CREATE TYPE "public"."enum__collection_entries_v_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  CREATE TYPE "public"."enum_home_page_site_collection_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  CREATE TYPE "public"."enum__home_page_site_collection_v_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  CREATE TYPE "public"."enum_home_page_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  CREATE TYPE "public"."enum__home_page_v_blocks_card_grid_amount_cards" AS ENUM('3', '2', '1');
  ALTER TABLE "collection_entries_blocks_card_grid" ADD COLUMN "amount_cards" "enum_collection_entries_blocks_card_grid_amount_cards" DEFAULT '3';
  ALTER TABLE "_collection_entries_v_blocks_card_grid" ADD COLUMN "amount_cards" "enum__collection_entries_v_blocks_card_grid_amount_cards" DEFAULT '3';
  ALTER TABLE "pages_blocks_card_grid" ADD COLUMN "amount_cards" "enum_pages_blocks_card_grid_amount_cards" DEFAULT '3';
  ALTER TABLE "_pages_v_blocks_card_grid" ADD COLUMN "amount_cards" "enum__pages_v_blocks_card_grid_amount_cards" DEFAULT '3';
  ALTER TABLE "home_page_site_collection_blocks_card_grid" ADD COLUMN "amount_cards" "enum_home_page_site_collection_blocks_card_grid_amount_cards" DEFAULT '3';
  ALTER TABLE "_home_page_site_collection_v_blocks_card_grid" ADD COLUMN "amount_cards" "enum__home_page_site_collection_v_blocks_card_grid_amount_cards" DEFAULT '3';
  ALTER TABLE "home_page_blocks_card_grid" ADD COLUMN "amount_cards" "enum_home_page_blocks_card_grid_amount_cards" DEFAULT '3';
  ALTER TABLE "_home_page_v_blocks_card_grid" ADD COLUMN "amount_cards" "enum__home_page_v_blocks_card_grid_amount_cards" DEFAULT '3';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_entries_blocks_card_grid" DROP COLUMN "amount_cards";
  ALTER TABLE "_collection_entries_v_blocks_card_grid" DROP COLUMN "amount_cards";
  ALTER TABLE "pages_blocks_card_grid" DROP COLUMN "amount_cards";
  ALTER TABLE "_pages_v_blocks_card_grid" DROP COLUMN "amount_cards";
  ALTER TABLE "home_page_site_collection_blocks_card_grid" DROP COLUMN "amount_cards";
  ALTER TABLE "_home_page_site_collection_v_blocks_card_grid" DROP COLUMN "amount_cards";
  ALTER TABLE "home_page_blocks_card_grid" DROP COLUMN "amount_cards";
  ALTER TABLE "_home_page_v_blocks_card_grid" DROP COLUMN "amount_cards";
  DROP TYPE "public"."enum_collection_entries_blocks_card_grid_amount_cards";
  DROP TYPE "public"."enum__collection_entries_v_blocks_card_grid_amount_cards";
  DROP TYPE "public"."enum_pages_blocks_card_grid_amount_cards";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_amount_cards";
  DROP TYPE "public"."enum_home_page_site_collection_blocks_card_grid_amount_cards";
  DROP TYPE "public"."enum__home_page_site_collection_v_blocks_card_grid_amount_cards";
  DROP TYPE "public"."enum_home_page_blocks_card_grid_amount_cards";
  DROP TYPE "public"."enum__home_page_v_blocks_card_grid_amount_cards";`)
}
