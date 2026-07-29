import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260729052200 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "inquiry" add column if not exists "handled" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "inquiry" drop column if exists "handled";`);
  }

}
