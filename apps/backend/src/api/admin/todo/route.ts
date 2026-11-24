import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";

import { createTodoWorkflow } from "../../../workflows/todo/create-todo";
import { PostCreateTodo } from "./validators";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const { data: todos, metadata: { count, take, skip } = {} } =
    await query.graph({
      entity: "todo",
      ...req.queryConfig,
      pagination: {
        ...req.queryConfig.pagination,
        order: {
          created_at: "DESC",
        },
      },
    });

  res.json({
    todos,
    count,
    limit: take,
    offset: skip,
  });
};

type PostCreateTodoType = z.infer<typeof PostCreateTodo>;

export const POST = async (
  req: MedusaRequest<PostCreateTodoType>,
  res: MedusaResponse,
) => {
  const { result } = await createTodoWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.status(201).json({ todo: result });
};