import { Module } from "@medusajs/framework/utils";
import InquiryModuleService from "./service";

export const INQUIRY_MODULE = "inquiry";

export default Module(INQUIRY_MODULE, {
  service: InquiryModuleService,
});
