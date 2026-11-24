import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { TODO_MODULE } from "../../modules/todo";
import TodoModuleService from "../../modules/todo/service";

export type DeleteTodoInput = {
  id: string;
};

export const deleteTodoStep = createStep(
  "delete-todo-step",
  async ({ id }: DeleteTodoInput, { container }) => {
    const todoModuleService: TodoModuleService = container.resolve(TODO_MODULE);

    await todoModuleService.updateTodos({
      id,
      deleted: true,
      deleted_at: new Date(),
    });
    // await todoModuleService.deleteTodos(id);

    return new StepResponse(id);
  },
);

export const deleteTodoWorkflow = createWorkflow(
  "delete-todo",
  (input: DeleteTodoInput) => {
    deleteTodoStep(input);

    return new WorkflowResponse(void 0);
  },
);
