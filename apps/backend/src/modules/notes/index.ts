import { Module } from "@medusajs/framework/utils";
import NotesModuleService from "./service";

export const NOTES_MODULE = "notes";

export default Module(NOTES_MODULE, {
  service: NotesModuleService,
});
