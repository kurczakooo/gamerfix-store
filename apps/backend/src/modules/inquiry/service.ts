import { MedusaService } from "@medusajs/framework/utils";
import { Inquiry } from "./models/inquiry";

class InquiryModuleService extends MedusaService({
  Inquiry,
}) {}

export default InquiryModuleService;
