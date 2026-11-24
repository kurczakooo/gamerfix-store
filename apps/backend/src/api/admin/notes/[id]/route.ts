import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";

import { updateNotesWorkflow } from "../../../../workflows/notes/update-notes";
import { PatchNotes } from "../validators";

type PatchNotesType = z.infer<typeof PatchNotes>;

export const PATCH = async (
  req: MedusaRequest<PatchNotesType>,
  res: MedusaResponse,
) => {
  const { result } = await updateNotesWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      content: req.validatedBody.content,
    },
  });

  res.json({ note: result });
};
