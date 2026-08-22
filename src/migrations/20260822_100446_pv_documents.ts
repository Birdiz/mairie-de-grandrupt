import { sql } from "@payloadcms/db-sqlite";
import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `);
  await db.run(sql`CREATE INDEX \`documents_updated_at_idx\` ON \`documents\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`documents_created_at_idx\` ON \`documents\` (\`created_at\`);`);
  await db.run(
    sql`CREATE UNIQUE INDEX \`documents_filename_idx\` ON \`documents\` (\`filename\`);`,
  );
  await db.run(sql`ALTER TABLE \`actualites\` ADD \`type\` text DEFAULT 'standard';`);
  await db.run(
    sql`ALTER TABLE \`actualites\` ADD \`document_id\` integer REFERENCES documents(id);`,
  );
  await db.run(sql`CREATE INDEX \`actualites_document_idx\` ON \`actualites\` (\`document_id\`);`);
  await db.run(sql`ALTER TABLE \`_actualites_v\` ADD \`version_type\` text DEFAULT 'standard';`);
  await db.run(
    sql`ALTER TABLE \`_actualites_v\` ADD \`version_document_id\` integer REFERENCES documents(id);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_version_version_document_idx\` ON \`_actualites_v\` (\`version_document_id\`);`,
  );
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`documents_id\` integer REFERENCES documents(id);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`documents_id\`);`,
  );
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`documents\`;`);
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`CREATE TABLE \`__new_actualites\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`date\` text,
  	\`excerpt\` text,
  	\`cover_image_id\` integer,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_actualites\`("id", "title", "slug", "date", "excerpt", "cover_image_id", "content", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "date", "excerpt", "cover_image_id", "content", "updated_at", "created_at", "_status" FROM \`actualites\`;`,
  );
  await db.run(sql`DROP TABLE \`actualites\`;`);
  await db.run(sql`ALTER TABLE \`__new_actualites\` RENAME TO \`actualites\`;`);
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(sql`CREATE UNIQUE INDEX \`actualites_slug_idx\` ON \`actualites\` (\`slug\`);`);
  await db.run(
    sql`CREATE INDEX \`actualites_cover_image_idx\` ON \`actualites\` (\`cover_image_id\`);`,
  );
  await db.run(sql`CREATE INDEX \`actualites_updated_at_idx\` ON \`actualites\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`actualites_created_at_idx\` ON \`actualites\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`actualites__status_idx\` ON \`actualites\` (\`_status\`);`);
  await db.run(sql`CREATE TABLE \`__new__actualites_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_date\` text,
  	\`version_excerpt\` text,
  	\`version_cover_image_id\` integer,
  	\`version_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`actualites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new__actualites_v\`("id", "parent_id", "version_title", "version_slug", "version_date", "version_excerpt", "version_cover_image_id", "version_content", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_slug", "version_date", "version_excerpt", "version_cover_image_id", "version_content", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_actualites_v\`;`,
  );
  await db.run(sql`DROP TABLE \`_actualites_v\`;`);
  await db.run(sql`ALTER TABLE \`__new__actualites_v\` RENAME TO \`_actualites_v\`;`);
  await db.run(
    sql`CREATE INDEX \`_actualites_v_parent_idx\` ON \`_actualites_v\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_version_version_slug_idx\` ON \`_actualites_v\` (\`version_slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_version_version_cover_image_idx\` ON \`_actualites_v\` (\`version_cover_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_version_version_updated_at_idx\` ON \`_actualites_v\` (\`version_updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_version_version_created_at_idx\` ON \`_actualites_v\` (\`version_created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_version_version__status_idx\` ON \`_actualites_v\` (\`version__status\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_created_at_idx\` ON \`_actualites_v\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_actualites_v_updated_at_idx\` ON \`_actualites_v\` (\`updated_at\`);`,
  );
  await db.run(sql`CREATE INDEX \`_actualites_v_latest_idx\` ON \`_actualites_v\` (\`latest\`);`);
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`actualites_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`actualites_id\`) REFERENCES \`actualites\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "actualites_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "actualites_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`,
  );
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_actualites_id_idx\` ON \`payload_locked_documents_rels\` (\`actualites_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  );
}
