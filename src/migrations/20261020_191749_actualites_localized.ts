import { sql } from "@payloadcms/db-sqlite";
import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`actualites_locales\` (
  	\`title\` text,
  	\`excerpt\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`actualites\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`actualites_locales_locale_parent_id_unique\` ON \`actualites_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`actualites_locales_parent_id_idx\` ON \`actualites_locales\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_actualites_v_locales\` (
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_actualites_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_actualites_v_locales_locale_parent_id_unique\` ON \`_actualites_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_locales_parent_id_idx\` ON \`_actualites_v_locales\` (\`_parent_id\`);`,
  );
  await db.run(sql`ALTER TABLE \`_actualites_v\` ADD \`snapshot\` integer;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` ADD \`published_locale\` text;`);
  await db.run(
    sql`CREATE INDEX \`_actualites_v_snapshot_idx\` ON \`_actualites_v\` (\`snapshot\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_published_locale_idx\` ON \`_actualites_v\` (\`published_locale\`);`,
  );
  // Existing articles were written in French: copy their text into the new
  // French locale rows before the old columns are dropped, so nothing is lost.
  await db.run(sql`INSERT INTO \`actualites_locales\` (\`title\`, \`excerpt\`, \`content\`, \`_locale\`, \`_parent_id\`)
    SELECT \`title\`, \`excerpt\`, \`content\`, 'fr', \`id\` FROM \`actualites\`;`);
  await db.run(sql`INSERT INTO \`_actualites_v_locales\` (\`version_title\`, \`version_excerpt\`, \`version_content\`, \`_locale\`, \`_parent_id\`)
    SELECT \`version_title\`, \`version_excerpt\`, \`version_content\`, 'fr', \`id\` FROM \`_actualites_v\`;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` DROP COLUMN \`version_title\`;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` DROP COLUMN \`version_excerpt\`;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` DROP COLUMN \`version_content\`;`);
  await db.run(sql`ALTER TABLE \`actualites\` DROP COLUMN \`title\`;`);
  await db.run(sql`ALTER TABLE \`actualites\` DROP COLUMN \`excerpt\`;`);
  await db.run(sql`ALTER TABLE \`actualites\` DROP COLUMN \`content\`;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`_actualites_v\` ADD \`version_title\` text;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` ADD \`version_excerpt\` text;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` ADD \`version_content\` text;`);
  await db.run(sql`ALTER TABLE \`actualites\` ADD \`title\` text;`);
  await db.run(sql`ALTER TABLE \`actualites\` ADD \`excerpt\` text;`);
  await db.run(sql`ALTER TABLE \`actualites\` ADD \`content\` text;`);
  // Put the French text back into the single-language columns (translations are dropped).
  await db.run(sql`UPDATE \`actualites\` SET
    \`title\` = (SELECT \`title\` FROM \`actualites_locales\` l WHERE l.\`_parent_id\` = \`actualites\`.\`id\` AND l.\`_locale\` = 'fr'),
    \`excerpt\` = (SELECT \`excerpt\` FROM \`actualites_locales\` l WHERE l.\`_parent_id\` = \`actualites\`.\`id\` AND l.\`_locale\` = 'fr'),
    \`content\` = (SELECT \`content\` FROM \`actualites_locales\` l WHERE l.\`_parent_id\` = \`actualites\`.\`id\` AND l.\`_locale\` = 'fr');`);
  await db.run(sql`UPDATE \`_actualites_v\` SET
    \`version_title\` = (SELECT \`version_title\` FROM \`_actualites_v_locales\` l WHERE l.\`_parent_id\` = \`_actualites_v\`.\`id\` AND l.\`_locale\` = 'fr'),
    \`version_excerpt\` = (SELECT \`version_excerpt\` FROM \`_actualites_v_locales\` l WHERE l.\`_parent_id\` = \`_actualites_v\`.\`id\` AND l.\`_locale\` = 'fr'),
    \`version_content\` = (SELECT \`version_content\` FROM \`_actualites_v_locales\` l WHERE l.\`_parent_id\` = \`_actualites_v\`.\`id\` AND l.\`_locale\` = 'fr');`);
  await db.run(sql`DROP TABLE \`actualites_locales\`;`);
  await db.run(sql`DROP TABLE \`_actualites_v_locales\`;`);
  await db.run(sql`DROP INDEX \`_actualites_v_snapshot_idx\`;`);
  await db.run(sql`DROP INDEX \`_actualites_v_published_locale_idx\`;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` DROP COLUMN \`snapshot\`;`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` DROP COLUMN \`published_locale\`;`);
}
