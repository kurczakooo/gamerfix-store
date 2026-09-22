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
} from "@medusajs/framework/types";

type Options = {
  apiKey: string;
};

class PayOnDeliveryProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "autopay_pobranie";

  protected readonly options_: Options;

  constructor(container: Record<string, unknown>, options: Options) {
    super(container, options);

    this.options_ = options;
  }

  static validateOptions(options: Record<any, any>): void {
    if (!options.apiKey) {
      throw new Error("Autopay transfer provider requires an apiKey option");
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const paymentId = (input.data?.id as string) || crypto.randomUUID();

    return {
      id: paymentId,
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "pending",
      },
    };
  }

  async authorizePayment(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput> {
    return {
      status: "authorized",
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "authorized",
      },
    };
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return {
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "captured",
      },
    };
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "canceled",
      },
    };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return {
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "refunded",
      },
    };
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return {
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "deleted",
      },
    };
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput,
  ): Promise<GetPaymentStatusOutput> {
    return {
      status: "authorized",
    };
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return {
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "authorized",
      },
    };
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return {
      data: {
        ...input.data,
        provider: "autopay_pobranie",
        status: "authorized",
      },
    };
  }

  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"],
  ): Promise<WebhookActionResult> {
    return {
      action: "authorized",
    };
  }
}

export default PayOnDeliveryProviderService;
