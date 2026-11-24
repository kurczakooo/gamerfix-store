import { model } from "@medusajs/framework/utils";

export const Todo = model
  .define("todo", {
    id: model.id().primaryKey(),
    content: model.text().searchable(),
    important: model.boolean().default(false),
    done: model.boolean().default(false),
    deleted: model.boolean().default(false),
  })
  .checks([
    {
      name: "limit_content_length",
      expression: (columns) => `LENGTH(${columns.content}) <= 2048`,
    },
  ]);
