import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { NOTES_MODULE } from "../../modules/notes";
import { NOTES_ID } from "../../modules/notes/models/notes";
import NotesModuleService from "../../modules/notes/service";

export type CreateNotesInput = {
  content: string;
};

export const createNotesStep = createStep(
  "create-notes-step",
  async ({ content }: CreateNotesInput, { container }) => {
    const notesModuleService: NotesModuleService =
      container.resolve(NOTES_MODULE);
    const notes = await notesModuleService.createNotes({
      id: NOTES_ID,
      content,
    });

    return new StepResponse(notes, notes.id);
  },
);

export const createNotesWorkflow = createWorkflow(
  "create-notes",
  (input: CreateNotesInput) => {
    const notes = createNotesStep(input);

    return new WorkflowResponse(notes);
  },
);
