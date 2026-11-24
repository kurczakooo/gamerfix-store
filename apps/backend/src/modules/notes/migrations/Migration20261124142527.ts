import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261124142527 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "notes" ("id" text not null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "notes_pkey" primary key ("id"), constraint limit_content_length check (LENGTH(content) <= 1048576));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_notes_deleted_at" ON "notes" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "notes" cascade;`);
  }

}
