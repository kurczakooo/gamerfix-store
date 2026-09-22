import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { addToCartWorkflow } from "@medusajs/medusa/core-flows";
import z from "zod";
import { PostAddFeeToCartBody } from "./validators";

type PostAddFeeToCartType = z.infer<typeof PostAddFeeToCartBody>;

export const POST = async (
  req: MedusaRequest<PostAddFeeToCartType>,
  res: MedusaResponse,
) => {
  console.time("addToCartWorkflow");
  const { result } = await addToCartWorkflow(req.scope).run({
    input: {
      cart_id: req.body.cart_id,
      items: [
        {
          title: req.body.title,
          quantity: req.body.quantity,
          unit_price: req.body.unit_price,
          metadata: {
            is_cod_fee: true,
          },
        },
      ],
    },
  });
  console.timeEnd("addToCartWorkflow");

  res.json({ fee: result });
};
