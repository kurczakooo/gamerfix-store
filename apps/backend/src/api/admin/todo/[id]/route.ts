import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";

import { deleteTodoWorkflow } from "../../../../workflows/todo/delete-todo";
import { updateTodoWorkflow } from "../../../../workflows/todo/update-todo";
import { PatchTodo } from "../validators";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  await deleteTodoWorkflow(req.scope).run({
    input: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    id: req.params.id,
    deleted: true,
  });
};

type PatchTodoType = z.infer<typeof PatchTodo>;

export const PATCH = async (
  req: MedusaRequest<PatchTodoType>,
  res: MedusaResponse,
) => {
  const { result } = await updateTodoWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      ...req.validatedBody,
    },
  });

  res.json({ todo: result });
};
