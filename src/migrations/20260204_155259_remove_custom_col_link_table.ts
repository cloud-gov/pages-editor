import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "menu_site_collection_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_site_collection_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_site_collection_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_site_collection_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_site_collection_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "menu_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_menu_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_footer_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pre_footer_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pre_footer_v_blocks_custom_collection_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"custom_collection_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "custom_col_link" CASCADE;
  DROP TABLE "_custom_col_link_v" CASCADE;
  ALTER TABLE "menu_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "menu_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "menu_site_collection_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_site_collection_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "footer_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "footer_site_collection_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_site_collection_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_site_collection_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_site_collection_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_site_collection_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_blocks_custom_collection_link" ADD CONSTRAINT "menu_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_blocks_custom_collection_link" ADD CONSTRAINT "menu_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_v_blocks_custom_collection_link" ADD CONSTRAINT "_menu_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_custom_collection_link" ADD CONSTRAINT "footer_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_blocks_custom_collection_link" ADD CONSTRAINT "footer_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_footer_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pre_footer_blocks_custom_collection_link" ADD CONSTRAINT "pre_footer_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pre_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_v_blocks_custom_collection_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pre_footer_v_blocks_custom_collection_link" ADD CONSTRAINT "_pre_footer_v_blocks_custom_collection_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pre_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_order_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_parent_id_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_path_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "menu_site_collection_blocks_custom_collection_link_custo_idx" ON "menu_site_collection_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_order_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_parent_id_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_path_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_site_collection_v_blocks_custom_collection_link_cu_idx" ON "_menu_site_collection_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_order_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_parent_id_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_path_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "footer_site_collection_blocks_custom_collection_link_cus_idx" ON "footer_site_collection_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link_order_idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link_parent_id_idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link_path_idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_site_collection_v_blocks_custom_collection_link__idx" ON "_footer_site_collection_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_order_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_parent_id_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_path_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_site_collection_blocks_custom_collection_link_idx" ON "pre_footer_site_collection_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_link_order_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_link_parent_id_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_link_path_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_site_collection_v_blocks_custom_collection_l_idx" ON "_pre_footer_site_collection_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "menu_blocks_custom_collection_link_order_idx" ON "menu_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "menu_blocks_custom_collection_link_parent_id_idx" ON "menu_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "menu_blocks_custom_collection_link_path_idx" ON "menu_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "menu_blocks_custom_collection_link_custom_collection_idx" ON "menu_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_order_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_parent_id_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_path_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_menu_v_blocks_custom_collection_link_custom_collection_idx" ON "_menu_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "footer_blocks_custom_collection_link_order_idx" ON "footer_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "footer_blocks_custom_collection_link_parent_id_idx" ON "footer_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_custom_collection_link_path_idx" ON "footer_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "footer_blocks_custom_collection_link_custom_collection_idx" ON "footer_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_order_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_parent_id_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_path_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_footer_v_blocks_custom_collection_link_custom_collectio_idx" ON "_footer_v_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_order_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_parent_id_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_path_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "pre_footer_blocks_custom_collection_link_custom_collecti_idx" ON "pre_footer_blocks_custom_collection_link" USING btree ("custom_collection_id");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_order_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("_order");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_parent_id_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("_parent_id");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_path_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("_path");
  CREATE INDEX "_pre_footer_v_blocks_custom_collection_link_custom_colle_idx" ON "_pre_footer_v_blocks_custom_collection_link" USING btree ("custom_collection_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "custom_col_link" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_custom_col_link_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"custom_collection_id" integer,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "menu_site_collection_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_menu_site_collection_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "footer_site_collection_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_footer_site_collection_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "pre_footer_site_collection_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_pre_footer_site_collection_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "menu_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_menu_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "footer_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_footer_v_blocks_custom_collection_link" CASCADE;
  DROP TABLE "pre_footer_blocks_custom_collection_link" CASCADE;
  DROP TABLE "_pre_footer_v_blocks_custom_collection_link" CASCADE;
  ALTER TABLE "custom_col_link" ADD CONSTRAINT "custom_col_link_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_col_link" ADD CONSTRAINT "custom_col_link_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_site_collection"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v" ADD CONSTRAINT "_custom_col_link_v_custom_collection_id_custom_collections_id_fk" FOREIGN KEY ("custom_collection_id") REFERENCES "public"."custom_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_col_link_v" ADD CONSTRAINT "_custom_col_link_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_site_collection_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "custom_col_link_order_idx" ON "custom_col_link" USING btree ("_order");
  CREATE INDEX "custom_col_link_parent_id_idx" ON "custom_col_link" USING btree ("_parent_id");
  CREATE INDEX "custom_col_link_path_idx" ON "custom_col_link" USING btree ("_path");
  CREATE INDEX "custom_col_link_custom_collection_idx" ON "custom_col_link" USING btree ("custom_collection_id");
  CREATE INDEX "_custom_col_link_v_order_idx" ON "_custom_col_link_v" USING btree ("_order");
  CREATE INDEX "_custom_col_link_v_parent_id_idx" ON "_custom_col_link_v" USING btree ("_parent_id");
  CREATE INDEX "_custom_col_link_v_path_idx" ON "_custom_col_link_v" USING btree ("_path");
  CREATE INDEX "_custom_col_link_v_custom_collection_idx" ON "_custom_col_link_v" USING btree ("custom_collection_id");`)
}
