import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { INQUIRY_MODULE } from "../../modules/inquiry";
import InquiryModuleService from "../../modules/inquiry/service";

export type DeleteInquiryStepInput = {
  id: string;
};

export const deleteInquiryStep = createStep(
  "delete-inquiry-step",
  async ({ id }: DeleteInquiryStepInput, { container }) => {
    const inquiryModuleService: InquiryModuleService =
      container.resolve(INQUIRY_MODULE);

    await inquiryModuleService.deleteInquiries(id);

    return new StepResponse(id);
  },
);

export type DeleteInquiryWorkflowInput = {
  id: string;
};

export const deleteInquiryWorkflow = createWorkflow(
  "delete-inquiry",
  (input: DeleteInquiryWorkflowInput) => {
    deleteInquiryStep(input);

    return new WorkflowResponse(void 0);
  },
);
