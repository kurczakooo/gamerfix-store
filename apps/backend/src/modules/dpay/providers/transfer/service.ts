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

type Options = {
  apiKey: string;
};

class DpayTransferProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "dpay_transfer";

  protected readonly options_: Options;

  constructor(container: Record<string, unknown>, options: Options) {
    super(container, options);

    this.options_ = options;
  }

  static validateOptions(options: Record<any, any>): void {
    if (!options.apiKey) {
      throw new Error("Dpay transfer provider requires an apiKey option");
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    console.log("InitaitePayment");
    return {
      id: (input.data?.id as string) || crypto.randomUUID(),
      data: {
        ...input.data,
        provider: "dpay_transefr",
        status: "pending",
      },
    };
  }

  async authorizePayment(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput> {
    console.log("AuthorizePayment");

    /**
     * Tutaj później:
     *
     * 1. Pobierz blik_code z input.data
     * 2. Wyślij:
     *    POST /api/v1_0/payments/register
     * 3. Zapisz transactionId
     */

    return {
      status: "pending",
      data: {
        ...input.data,
      },
    };
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

export default DpayTransferProviderService;
