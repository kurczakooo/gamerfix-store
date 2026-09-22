import { z } from "@medusajs/framework/zod";

export const PostAddFeeToCartBody = z.object({
  cart_id: z.string(),
  title: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
});
