import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";

import { createInquiryWorkflow } from "../../../workflows/inquiries/create-inquiry";
import { PostCreateInquiry } from "../../admin/inquiries/validators";

type PostCreateInquiryType = z.infer<typeof PostCreateInquiry>;

export const POST = async (
  req: MedusaRequest<PostCreateInquiryType>,
  res: MedusaResponse,
) => {
  const { result } = await createInquiryWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.json({ inquiry: result });
};
