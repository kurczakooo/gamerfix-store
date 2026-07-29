import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";

import { createInquiryWorkflow } from "../../../workflows/inquiries/create-inquiry";
import { PostCreateInquiry } from "./validators";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const { data: inquiries, metadata: { count, take, skip } = {} } = await query.graph({
    entity: "inquiry",
    ...req.queryConfig,
    pagination: {
      ...req.queryConfig.pagination,
      order: {
        created_at: "DESC",
      },
    },
  });

  res.json({
    inquiries,
    count,
    limit: take,
    offset: skip,
  });
};

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
