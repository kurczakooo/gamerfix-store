import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";

import { createNotesWorkflow } from "../../../workflows/notes/create-notes";
import { NOTES_MODULE } from "../../../modules/notes";
import { NOTES_ID } from "../../../modules/notes/models/notes";
import NotesModuleService from "../../../modules/notes/service";
import { PostCreateNotes } from "./validators";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const notesModuleService: NotesModuleService =
    req.scope.resolve(NOTES_MODULE);
  const notes = await notesModuleService.listNotes({ id: NOTES_ID });

  if (notes[0]) {
    res.json({ note: notes[0] });
    return;
  }

  const { result } = await createNotesWorkflow(req.scope).run({
    input: { content: "" },
  });

  res.status(201).json({ note: result });
};

type PostCreateNotesType = z.infer<typeof PostCreateNotes>;

export const POST = async (
  req: MedusaRequest<PostCreateNotesType>,
  res: MedusaResponse,
) => {
  const { result } = await createNotesWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.status(201).json({ note: result });
};
