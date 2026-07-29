import { z } from "@medusajs/framework/zod";

export const PostCreateInquiry = z.object({
  name: z.string().max(50),
  email: z.string().max(50),
  phone: z.string().max(20).nullable(),
  subject: z.string().max(256),
  content: z.string().max(20480),
});

export const PatchHandledInquiry = z.object({
  handled: z.boolean(),
});
