import { AbstractPaymentProvider } from "@medusajs/framework/utils";

import {
  CapturePaymentInput,
  CapturePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
  ProviderWebhookPayload,
  PaymentSessionStatus,
} from "@medusajs/framework/types";
import { calculateHash } from "../../utils/calculate-hex";

type Options = {
  apiKey: string;
  apiServiceId: string;
  apiSeparator: string;
};

class TransferProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "autopay_transfer";

  protected readonly options_: Options;

  constructor(container: Record<string, unknown>, options: Options) {
    super(container, options);

    this.options_ = options;
  }

  static validateOptions(options: Record<any, any>): void {
    if (!options.apiKey) {
      throw new Error("Autopay transfer provider requires an apiKey option");
    }
    if (!options.apiServiceId) {
      throw new Error("Autopay transfer provider requires an apiServiceId option");
    }
    if (!options.apiSeparator) {
      throw new Error("Autopay transfer provider requires an apiSeparator option");
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const paymentId = (input.data?.id as string) || crypto.randomUUID();

    return {
      id: paymentId,
      data: {
        ...input.data,
        provider: "autopay_transfer",
        status: "pending",
      },
    };
  }

  async authorizePayment(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput> {
    // Order ID structure for Autopay
    // OrderID = order_display_number + "_" + cart_id[:10]

    const orderId =
      input.data?.orderDisplayId + "_" + input.data?.orderId?.toString().slice(21);
    const amount = input.data?.amount;
    const description = input.data?.description + " " + input.data?.orderDisplayId;
    const customerEmail = input.data?.customerEmail;

    if (
      typeof orderId !== "string" ||
      typeof amount !== "number" ||
      typeof description !== "string" ||
      typeof customerEmail !== "string"
    ) {
      throw new Error(
        "Autopay transfer requires an order ID, amount, description, and customer email",
      );
    }

    const hash = calculateHash(orderId, amount, description, customerEmail, {
      serviceId: this.options_.apiServiceId,
      secret: this.options_.apiKey,
      separator: this.options_.apiSeparator,
    });

    const form = new URLSearchParams();

    form.append("ServiceID", this.options_.apiServiceId);
    form.append("OrderID", orderId);
    form.append("Amount", amount.toString());
    form.append("Description", description);
    form.append("CustomerEmail", customerEmail);
    form.append("Hash", hash);

    console.log(form.toString());

    const response = await fetch("https://pay.autopay.eu/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      redirect: "manual",
    });

    console.log("status:", response.status);

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");

      console.log("Autopay redirect:", location);

      if (!location) {
        throw new Error(`Autopay returned ${response.status} but no Location header`);
      }

      return {
        status: "authorized",
        data: {
          ...input.data,
          provider: "autopay_transfer",
          status: "authorized",
          autopay: {
            redirectUrl: new URL(location, "https://pay.autopay.eu").toString(),
          },
        },
      };
    }

    if (!response.ok) {
      const errorBody = await response.text();

      throw new Error(`Autopay returned ${response.status}: ${errorBody}`);
    }

    throw new Error(`Unexpected response from Autopay: ${response.status}`);
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    console.log("CapturePayment");

    /**
     * Dla BLIK Level 0:
     * capture prawdopodobnie będzie pusty,
     * bo autoryzacja następuje przez dpay.
     */

    return {
      data: {
        ...input.data,
      },
    };
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: {
        ...input.data,
      },
    };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    /**
     * Tutaj później:
     * POST dpay refund endpoint
     */

    return {
      data: {
        ...input.data,
      },
    };
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return {
      data: {
        ...input.data,
      },
    };
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput,
  ): Promise<GetPaymentStatusOutput> {
    console.log("GetPaymentStatus");
    /**
     * Docelowo:
     * GET transaction status z dpay
     */

    return {
      status: "pending",
    };
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return {
      data: {
        ...input.data,
      },
    };
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    console.log("UpdatePayment");

    return {
      data: {
        ...input.data,
      },
    };
  }

  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"],
  ): Promise<WebhookActionResult> {
    console.log("GetWebhookData");
    /**
     * Tutaj obsłużymy IPN dpay.
     *
     * dpay -> webhook
     *        |
     *        v
     * Medusa:
     *        capture / authorize / fail
     */

    return {
      action: "not_supported",
    };
  }
}

export default TransferProviderService;
