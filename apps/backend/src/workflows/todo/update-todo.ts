import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { TODO_MODULE } from "../../modules/todo";
import TodoModuleService from "../../modules/todo/service";

export type UpdateTodoInput = {
  id: string;
  content?: string;
  important?: boolean;
  done?: boolean;
};

export const updateTodoStep = createStep(
  "update-todo-step",
  async (input: UpdateTodoInput, { container }) => {
    const todoModuleService: TodoModuleService = container.resolve(TODO_MODULE);
    const todo = await todoModuleService.updateTodos(input);

    return new StepResponse(todo);
  },
);

export const updateTodoWorkflow = createWorkflow(
  "update-todo",
  (input: UpdateTodoInput) => {
    const todo = updateTodoStep(input);

    return new WorkflowResponse(todo);
  },
);
