import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261124062645 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "todo" ("id" text not null, "content" text not null, "important" boolean not null default false, "done" boolean not null default false, "deleted" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "todo_pkey" primary key ("id"), constraint limit_content_length check (LENGTH(content) <= 2048));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_todo_deleted_at" ON "todo" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "todo" cascade;`);
  }

}
