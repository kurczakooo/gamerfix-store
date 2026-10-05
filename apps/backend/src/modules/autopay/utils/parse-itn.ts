import { XMLParser } from "fast-xml-parser";

export type AutopayItnTransaction = {
  orderID: string;
  remoteID: string;
  amount: string;
  currency: string;
  gatewayID: string;
  paymentDate: string;
  paymentStatus: string;
  paymentStatusDetails: string;
};

export type AutopayItn = {
  serviceID: string;
  transaction: AutopayItnTransaction;
  hash: string;
};

const parser = new XMLParser({
  ignoreAttributes: true,
  trimValues: true,
});

export function parseAutopayItn(encodedTransactions: string): AutopayItn {
  const xml = Buffer.from(encodedTransactions, "base64").toString("utf-8");

  const parsed = parser.parse(xml);

  const transactionList = parsed?.transactionList;
  const transaction = transactionList?.transactions?.transaction;

  if (!transactionList || !transaction) {
    throw new Error("Invalid Autopay ITN structure");
  }

  return {
    serviceID: String(transactionList.serviceID),
    transaction: {
      orderID: String(transaction.orderID),
      remoteID: String(transaction.remoteID),
      amount: String(transaction.amount),
      currency: String(transaction.currency),
      gatewayID: String(transaction.gatewayID),
      paymentDate: String(transaction.paymentDate),
      paymentStatus: String(transaction.paymentStatus),
      paymentStatusDetails: String(transaction.paymentStatusDetails),
    },
    hash: String(transactionList.hash),
  };
}
