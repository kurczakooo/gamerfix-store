import { MedusaService } from "@medusajs/framework/utils";
import { Todo } from "./models/todo";

class TodoModuleService extends MedusaService({
  Todo,
}) {}

export default TodoModuleService;
