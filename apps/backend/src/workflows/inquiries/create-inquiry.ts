import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { sendNotificationsStep } from "@medusajs/medusa/core-flows";
import { INQUIRY_MODULE } from "../../modules/inquiry";
import InquiryModuleService from "../../modules/inquiry/service";

const adminEmail = "serwis.gamefix@gmail.com";

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

    const notifications = transform({ inquiry }, ({ inquiry }) => {
      const storeUrl = "https://gamerfix.pl";
      const adminUrl = "https://api.gamerfix.pl/app/inquiries";

      return [
        {
          to: adminEmail,
          channel: "email",
          template: "inquiry-created",
          data: {
            inquiry: {
              clientName: inquiry.name,
              date: new Date(inquiry.created_at).toLocaleString("pl-PL", {
                dateStyle: "long",
                timeStyle: "short",
              }),
              storeUrl,
              inquiriesUrl: adminUrl,
            },
          },
        },
      ];
    });

    sendNotificationsStep(notifications);

    return new WorkflowResponse(inquiry);
  },
);
