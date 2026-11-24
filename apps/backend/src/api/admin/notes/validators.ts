import { z } from "@medusajs/framework/zod";

export const PostCreateNotes = z.object({
  content: z.string().max(1048576),
});

export const PatchNotes = z.object({
  content: z.string().max(1048576),
});
