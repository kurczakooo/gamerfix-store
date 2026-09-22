import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import TransferProviderService from "./providers/transfer/service";
import PayOnDeliveryProviderService from "./providers/pobranie/service";

export default ModuleProvider(Modules.PAYMENT, {
  services: [TransferProviderService, PayOnDeliveryProviderService],
});
