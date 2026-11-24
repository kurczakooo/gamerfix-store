import { model } from "@medusajs/framework/utils";

export const NOTES_ID = "admin-notes";

export const Notes = model
  .define("notes", {
    id: model.id().primaryKey(),
    content: model.text().searchable(),
  })
  .checks([
    {
      name: "limit_content_length",
      expression: (columns) => `LENGTH(${columns.content}) <= 1048576`,
    },
  ]);
