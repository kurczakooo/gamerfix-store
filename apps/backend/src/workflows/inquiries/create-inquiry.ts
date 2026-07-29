import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { INQUIRY_MODULE } from "../../modules/inquiry";
import InquiryModuleService from "../../modules/inquiry/service";

export type CreateInquiryStepInput = {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  content: string;
};

export const createInquiryStep = createStep(
  "create-inquiry-step",
  async (input: CreateInquiryStepInput, { container }) => {
    const inquiryModuleService: InquiryModuleService =
      container.resolve(INQUIRY_MODULE);

    const inquiry = await inquiryModuleService.createInquiries(input);

    return new StepResponse(inquiry, inquiry.id);
  },
);

export type CreateInquiryWorkflowInput = {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  content: string;
};

export const createInquiryWorkflow = createWorkflow(
  "create-inquiry",
  (input: CreateInquiryWorkflowInput) => {
    const inquiry = createInquiryStep(input);

    return new WorkflowResponse(inquiry);
  },
);
