import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { NOTES_MODULE } from "../../modules/notes";
import NotesModuleService from "../../modules/notes/service";

export type UpdateNotesInput = {
  id: string;
  content: string;
};

export const updateNotesStep = createStep(
  "update-notes-step",
  async (input: UpdateNotesInput, { container }) => {
    const notesModuleService: NotesModuleService =
      container.resolve(NOTES_MODULE);
    const notes = await notesModuleService.updateNotes(input);

    return new StepResponse(notes);
  },
);

export const updateNotesWorkflow = createWorkflow(
  "update-notes",
  (input: UpdateNotesInput) => {
    const notes = updateNotesStep(input);

    return new WorkflowResponse(notes);
  },
);
