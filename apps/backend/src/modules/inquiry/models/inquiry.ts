import { model } from "@medusajs/framework/utils";

export const Inquiry = model
  .define("inquiry", {
    id: model.id().primaryKey(),
    name: model.text().searchable(),
    email: model.text().searchable(),
    phone: model.text().nullable(),
    subject: model.text().searchable(),
    content: model.text().searchable(),
    handled: model.boolean().default(false),
  })
  .checks([
    {
      name: "limit_name_length",
      expression: columns => `LENGTH(${columns.name}) <= 50`,
    },
    {
      name: "limit_email_length",
      expression: columns => `LENGTH(${columns.email}) <= 50`,
    },
    {
      name: "limit_phone_length",
      expression: columns => `LENGTH(${columns.phone}) <= 20`,
    },
    {
      name: "limit_subject_length",
      expression: columns => `LENGTH(${columns.subject}) <= 256`,
    },
    {
      name: "limit_content_length",
      expression: columns => `LENGTH(${columns.content}) <= 2048`,
    },
  ]);
