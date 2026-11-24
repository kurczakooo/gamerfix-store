import { MedusaService } from "@medusajs/framework/utils";
import { Notes } from "./models/notes";

class NotesModuleService extends MedusaService({
  Notes,
}) {}

export default NotesModuleService;
