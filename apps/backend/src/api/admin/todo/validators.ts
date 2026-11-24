import { z } from "@medusajs/framework/zod";

export const PostCreateTodo = z.object({
  content: z.string().max(2048),
  important: z.boolean().optional(),
  done: z.boolean().optional(),
});

export const PatchTodo = z
  .object({
    content: z.string().max(2048).optional(),
    important: z.boolean().optional(),
    done: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });