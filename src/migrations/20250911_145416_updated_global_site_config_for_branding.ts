import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_config_site_collection_primary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_site_config_site_collection_secondary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_site_config_site_collection_primary_font" AS ENUM('georgia', 'helvetica', 'merriweather', 'open-sans', 'public-sans', 'roboto-mono', 'source-sans-pro', 'system', 'tahoma', 'verdana');
  CREATE TYPE "public"."enum__site_config_site_collection_v_version_primary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__site_config_site_collection_v_version_secondary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__site_config_site_collection_v_version_primary_font" AS ENUM('georgia', 'helvetica', 'merriweather', 'open-sans', 'public-sans', 'roboto-mono', 'source-sans-pro', 'system', 'tahoma', 'verdana');
  CREATE TYPE "public"."enum_site_config_primary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_site_config_secondary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum_site_config_primary_font" AS ENUM('georgia', 'helvetica', 'merriweather', 'open-sans', 'public-sans', 'roboto-mono', 'source-sans-pro', 'system', 'tahoma', 'verdana');
  CREATE TYPE "public"."enum__site_config_v_version_primary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__site_config_v_version_secondary_color" AS ENUM('blue-cool', 'blue-cool-vivid', 'blue', 'blue-vivid', 'blue-warm', 'blue-warm-vivid', 'cyan', 'cyan-vivid', 'gold', 'gold-vivid', 'gray-cool', 'gray', 'gray-warm', 'green-cool', 'green-cool-vivid', 'green', 'green-vivid', 'green-warm', 'green-warm-vivid', 'indigo-cool', 'indigo-cool-vivid', 'indigo', 'indigo-vivid', 'indigo-warm', 'indigo-warm-vivid', 'magenta', 'magenta-vivid', 'mint-cool', 'mint-cool-vivid', 'mint', 'mint-vivid', 'orange', 'orange-vivid', 'orange-warm', 'orange-warm-vivid', 'red-cool', 'red-cool-vivid', 'red', 'red-vivid', 'red-warm', 'red-warm-vivid', 'violet', 'violet-vivid', 'violet-warm', 'violet-warm-vivid', 'yellow', 'yellow-vivid');
  CREATE TYPE "public"."enum__site_config_v_version_primary_font" AS ENUM('georgia', 'helvetica', 'merriweather', 'open-sans', 'public-sans', 'roboto-mono', 'source-sans-pro', 'system', 'tahoma', 'verdana');
  ALTER TABLE "site_config_site_collection" ADD COLUMN "tagline" varchar;
  ALTER TABLE "site_config_site_collection" ADD COLUMN "primary_color" "enum_site_config_site_collection_primary_color" DEFAULT 'blue-warm-vivid';
  ALTER TABLE "site_config_site_collection" ADD COLUMN "secondary_color" "enum_site_config_site_collection_secondary_color" DEFAULT 'red-vivid';
  ALTER TABLE "site_config_site_collection" ADD COLUMN "primary_font" "enum_site_config_site_collection_primary_font" DEFAULT 'open-sans';
  ALTER TABLE "site_config_site_collection" ADD COLUMN "favicon_id" integer;
  ALTER TABLE "site_config_site_collection" ADD COLUMN "logo_id" integer;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_tagline" varchar;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_primary_color" "enum__site_config_site_collection_v_version_primary_color" DEFAULT 'blue-warm-vivid';
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_secondary_color" "enum__site_config_site_collection_v_version_secondary_color" DEFAULT 'red-vivid';
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_primary_font" "enum__site_config_site_collection_v_version_primary_font" DEFAULT 'open-sans';
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_favicon_id" integer;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_logo_id" integer;
  ALTER TABLE "site_config" ADD COLUMN "tagline" varchar;
  ALTER TABLE "site_config" ADD COLUMN "primary_color" "enum_site_config_primary_color" DEFAULT 'blue-warm-vivid';
  ALTER TABLE "site_config" ADD COLUMN "secondary_color" "enum_site_config_secondary_color" DEFAULT 'red-vivid';
  ALTER TABLE "site_config" ADD COLUMN "primary_font" "enum_site_config_primary_font" DEFAULT 'open-sans';
  ALTER TABLE "site_config" ADD COLUMN "favicon_id" integer;
  ALTER TABLE "site_config" ADD COLUMN "logo_id" integer;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_tagline" varchar;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_primary_color" "enum__site_config_v_version_primary_color" DEFAULT 'blue-warm-vivid';
  ALTER TABLE "_site_config_v" ADD COLUMN "version_secondary_color" "enum__site_config_v_version_secondary_color" DEFAULT 'red-vivid';
  ALTER TABLE "_site_config_v" ADD COLUMN "version_primary_font" "enum__site_config_v_version_primary_font" DEFAULT 'open-sans';
  ALTER TABLE "_site_config_v" ADD COLUMN "version_favicon_id" integer;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_logo_id" integer;
  ALTER TABLE "site_config_site_collection" ADD CONSTRAINT "site_config_site_collection_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config_site_collection" ADD CONSTRAINT "site_config_site_collection_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_config_site_collection_v" ADD CONSTRAINT "_site_config_site_collection_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_config_site_collection_v" ADD CONSTRAINT "_site_config_site_collection_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_config_v" ADD CONSTRAINT "_site_config_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_config_v" ADD CONSTRAINT "_site_config_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_config_site_collection_favicon_idx" ON "site_config_site_collection" USING btree ("favicon_id");
  CREATE INDEX "site_config_site_collection_logo_idx" ON "site_config_site_collection" USING btree ("logo_id");
  CREATE INDEX "_site_config_site_collection_v_version_version_favicon_idx" ON "_site_config_site_collection_v" USING btree ("version_favicon_id");
  CREATE INDEX "_site_config_site_collection_v_version_version_logo_idx" ON "_site_config_site_collection_v" USING btree ("version_logo_id");
  CREATE INDEX "site_config_favicon_idx" ON "site_config" USING btree ("favicon_id");
  CREATE INDEX "site_config_logo_idx" ON "site_config" USING btree ("logo_id");
  CREATE INDEX "_site_config_v_version_version_favicon_idx" ON "_site_config_v" USING btree ("version_favicon_id");
  CREATE INDEX "_site_config_v_version_version_logo_idx" ON "_site_config_v" USING btree ("version_logo_id");
  ALTER TABLE "site_config_site_collection" DROP COLUMN "font";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_font";
  ALTER TABLE "site_config" DROP COLUMN "font";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_font";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_config_site_collection" DROP CONSTRAINT "site_config_site_collection_favicon_id_media_id_fk";
  
  ALTER TABLE "site_config_site_collection" DROP CONSTRAINT "site_config_site_collection_logo_id_media_id_fk";
  
  ALTER TABLE "_site_config_site_collection_v" DROP CONSTRAINT "_site_config_site_collection_v_version_favicon_id_media_id_fk";
  
  ALTER TABLE "_site_config_site_collection_v" DROP CONSTRAINT "_site_config_site_collection_v_version_logo_id_media_id_fk";
  
  ALTER TABLE "site_config" DROP CONSTRAINT "site_config_favicon_id_media_id_fk";
  
  ALTER TABLE "site_config" DROP CONSTRAINT "site_config_logo_id_media_id_fk";
  
  ALTER TABLE "_site_config_v" DROP CONSTRAINT "_site_config_v_version_favicon_id_media_id_fk";
  
  ALTER TABLE "_site_config_v" DROP CONSTRAINT "_site_config_v_version_logo_id_media_id_fk";
  
  DROP INDEX "site_config_site_collection_favicon_idx";
  DROP INDEX "site_config_site_collection_logo_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_favicon_idx";
  DROP INDEX "_site_config_site_collection_v_version_version_logo_idx";
  DROP INDEX "site_config_favicon_idx";
  DROP INDEX "site_config_logo_idx";
  DROP INDEX "_site_config_v_version_version_favicon_idx";
  DROP INDEX "_site_config_v_version_version_logo_idx";
  ALTER TABLE "site_config_site_collection" ADD COLUMN "font" varchar;
  ALTER TABLE "_site_config_site_collection_v" ADD COLUMN "version_font" varchar;
  ALTER TABLE "site_config" ADD COLUMN "font" varchar;
  ALTER TABLE "_site_config_v" ADD COLUMN "version_font" varchar;
  ALTER TABLE "site_config_site_collection" DROP COLUMN "tagline";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "primary_color";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "secondary_color";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "primary_font";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "favicon_id";
  ALTER TABLE "site_config_site_collection" DROP COLUMN "logo_id";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_tagline";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_primary_color";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_secondary_color";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_primary_font";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_favicon_id";
  ALTER TABLE "_site_config_site_collection_v" DROP COLUMN "version_logo_id";
  ALTER TABLE "site_config" DROP COLUMN "tagline";
  ALTER TABLE "site_config" DROP COLUMN "primary_color";
  ALTER TABLE "site_config" DROP COLUMN "secondary_color";
  ALTER TABLE "site_config" DROP COLUMN "primary_font";
  ALTER TABLE "site_config" DROP COLUMN "favicon_id";
  ALTER TABLE "site_config" DROP COLUMN "logo_id";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_tagline";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_primary_color";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_secondary_color";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_primary_font";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_favicon_id";
  ALTER TABLE "_site_config_v" DROP COLUMN "version_logo_id";
  DROP TYPE "public"."enum_site_config_site_collection_primary_color";
  DROP TYPE "public"."enum_site_config_site_collection_secondary_color";
  DROP TYPE "public"."enum_site_config_site_collection_primary_font";
  DROP TYPE "public"."enum__site_config_site_collection_v_version_primary_color";
  DROP TYPE "public"."enum__site_config_site_collection_v_version_secondary_color";
  DROP TYPE "public"."enum__site_config_site_collection_v_version_primary_font";
  DROP TYPE "public"."enum_site_config_primary_color";
  DROP TYPE "public"."enum_site_config_secondary_color";
  DROP TYPE "public"."enum_site_config_primary_font";
  DROP TYPE "public"."enum__site_config_v_version_primary_color";
  DROP TYPE "public"."enum__site_config_v_version_secondary_color";
  DROP TYPE "public"."enum__site_config_v_version_primary_font";`)
}
