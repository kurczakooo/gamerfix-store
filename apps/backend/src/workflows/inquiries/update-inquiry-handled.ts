import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { INQUIRY_MODULE } from "../../modules/inquiry";
import InquiryModuleService from "../../modules/inquiry/service";

export type UpdateInquiryHandledStepInput = {
  id: string;
  handled: boolean;
};

export const updateInquiryHandledStep = createStep(
  "update-inquiry-handled-step",
  async (input: UpdateInquiryHandledStepInput, { container }) => {
    const inquiryModuleService: InquiryModuleService =
      container.resolve(INQUIRY_MODULE);

    const inquiry = await inquiryModuleService.updateInquiries({
      id: input.id,
      handled: input.handled,
    });

    return new StepResponse(inquiry);
  },
);

export type UpdateInquiryHandledWorkflowInput = {
  id: string;
  handled: boolean;
};

export const updateInquiryHandledWorkflow = createWorkflow(
  "update-inquiry-handled",
  (input: UpdateInquiryHandledWorkflowInput) => {
    const inquiry = updateInquiryHandledStep(input);

    return new WorkflowResponse(inquiry);
  },
);
