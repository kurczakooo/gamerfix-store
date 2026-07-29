import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { deleteInquiryWorkflow } from "../../../../workflows/inquiries/delete-inquiry";
import { updateInquiryHandledWorkflow } from "../../../../workflows/inquiries/update-inquiry-handled";
import z from "zod";
import { PatchHandledInquiry } from "../validators";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  await deleteInquiryWorkflow(req.scope).run({
    input: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    id: req.params.id,
    deleted: true,
  });
};

type PatchHandledInquiryType = z.infer<typeof PatchHandledInquiry>;

export const PATCH = async (
  req: MedusaRequest<PatchHandledInquiryType>,
  res: MedusaResponse,
) => {
  const { result } = await updateInquiryHandledWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      handled: req.validatedBody.handled,
    },
  });

  res.json({
    inquiry: result,
  });
};
