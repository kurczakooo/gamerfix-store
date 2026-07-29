import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260728071012 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "inquiry" ("id" text not null, "name" text not null, "email" text not null, "phone" text null, "subject" text not null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "inquiry_pkey" primary key ("id"), constraint limit_name_length check (LENGTH(name) <= 50), constraint limit_email_length check (LENGTH(email) <= 50), constraint limit_phone_length check (LENGTH(phone) <= 20), constraint limit_subject_length check (LENGTH(subject) <= 256), constraint limit_content_length check (LENGTH(content) <= 2048));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_deleted_at" ON "inquiry" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "inquiry" cascade;`);
  }

}
