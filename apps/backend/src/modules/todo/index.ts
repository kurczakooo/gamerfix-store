import { Module } from "@medusajs/framework/utils";
import TodoModuleService from "./service";

export const TODO_MODULE = "todo";

export default Module(TODO_MODULE, {
  service: TodoModuleService,
});
