import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import DpayBlikProviderService from "./providers/blik/service";
import DpayTransferProviderService from "./providers/transfer/service";
import DpayOnDeliveryProviderService from "./providers/pobranie/service";

export default ModuleProvider(Modules.PAYMENT, {
  services: [
    DpayBlikProviderService,
    DpayTransferProviderService,
    DpayOnDeliveryProviderService,
  ],
});
