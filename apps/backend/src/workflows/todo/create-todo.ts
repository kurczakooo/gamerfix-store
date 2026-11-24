import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { TODO_MODULE } from "../../modules/todo";
import TodoModuleService from "../../modules/todo/service";

export type CreateTodoInput = {
  content: string;
  important?: boolean;
  done?: boolean;
};

export const createTodoStep = createStep(
  "create-todo-step",
  async (input: CreateTodoInput, { container }) => {
    const todoModuleService: TodoModuleService = container.resolve(TODO_MODULE);
    const todo = await todoModuleService.createTodoes(input);

    return new StepResponse(todo, todo.id);
  },
);

export const createTodoWorkflow = createWorkflow(
  "create-todo",
  (input: CreateTodoInput) => {
    const todo = createTodoStep(input);

    return new WorkflowResponse(todo);
  },
);
