const COD_FEE_TITLE = "Opłata za pobranie";
const SERVICE_COLLECTION_TITLE = "Usługi";

type OrderAddress = {
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  province?: string | null;
  phone?: string | null;
};

type OrderItem = {
  id: string;
  title: string;
  thumbnail?: string | null;
  product_title?: string | null;
  variant_title?: string | null;
  product_collection?: string | null;
  quantity: number;
  unit_price: number;
  total: number;
};

type ShippingMethod = {
  name: string;
  total: number;
};

type Payment = {
  provider_id?: string | null;
};

type PaymentCollection = {
  payments?: Payment[] | null;
};

type OrderMetadata = {
  parcel_locker_code?: string | null;
  parcel_locker_name?: string | null;
  sent_to_service_method?: string | null;
};

type Order = {
  display_id: number | string;
  created_at: string;
  email: string;
  total: number;
  shipping_total?: number | null;
  discount_subtotal?: number | null;
  items: OrderItem[];
  shipping_address?: OrderAddress | null;
  shipping_methods?: ShippingMethod[] | null;
  customer?: { email?: string | null } | null;
  payment_collections?: PaymentCollection[] | null;
  metadata?: OrderMetadata | null;
};

type OrderConfirmationEmailProps = {
  order: Order;
  storeUrl: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatMoney = (amount: number) =>
  `${new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} zł`;

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

const renderIcons = (storeUrl: string) =>
  [
    "laptop192.webp",
    "ps5192.webp",
    "controller192.webp",
    "xbox192.webp",
    "phone192.webp",
  ]
    .map(
      (iconName) =>
        `<td width="20%" align="center"><img src="${storeUrl}/images/content/${iconName}" alt="" width="64" height="64" style="display:block; margin:0 auto; width:64px; height:64px; max-width:64px; border:0;" /></td>`,
    )
    .join("");

const renderIconRow = (storeUrl: string) =>
  `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;"><tr>${renderIcons(storeUrl)}</tr></table>`;

const renderItemRow = (item: OrderItem) => {
  const title = escapeHtml(item.product_title ?? item.title);
  const variantTitle = item.variant_title
    ? `<p style="margin:0; color:#6b7280; font-size:13px; line-height:19px;">${escapeHtml(item.variant_title)}</p>`
    : "";

  return `<tr>
    <td width="80" valign="top" style="width:80px; padding:16px 16px 16px 0; border-bottom:1px solid #e5e7eb;"><img src="${escapeHtml(item.thumbnail ?? "")}" alt="${title}" width="64" height="64" style="display:block; width:64px; height:64px; border:0; object-fit:cover;" /></td>
    <td valign="top" style="padding:16px 8px 16px 0; border-bottom:1px solid #e5e7eb;"><p style="margin:0 0 4px; color:#1f2937; font-size:15px; font-weight:700; line-height:21px;">${title}</p>${variantTitle}</td>
    <td width="120" valign="top" align="right" style="width:120px; padding:16px 0; border-bottom:1px solid #e5e7eb; text-align:right;"><p style="margin:0 0 4px; color:#6b7280; font-size:13px; line-height:19px; white-space:nowrap;">${item.quantity} x ${formatMoney(item.unit_price)}</p><p style="margin:0; color:#1f2937; font-size:15px; font-weight:700; line-height:21px; white-space:nowrap;">${formatMoney(item.total)}</p></td>
  </tr>`;
};

const renderSummaryRow = (label: string, value: string, color = "#4b5563") =>
  `<tr><td style="padding:0 0 8px; color:${color}; font-size:15px; line-height:22px;">${label}</td><td align="right" style="padding:0 0 8px; color:${color}; font-size:15px; line-height:22px; text-align:right;">${value}</td></tr>`;

const renderShippingToServiceText = (method: string | null | undefined) => {
  if (method === "inpost-locker") {
    return "Nadanie przez paczkomat InPost (Za darmo)<br /><br />Etykieta wysyłkowa znajduje się w załączniku.<br />Po wydrukowaniu naklej ją na paczkę i nadaj w najbliższym paczkomacie InPost.";
  }
  if (method === "own-shipping") {
    return "Wysyłka na własną rękę (Własny koszt)<br />Samodzielnie nadaj przesyłkę do paczkomatu PCI01M<br />bądź na adres: Ujny 16, 26-015 Pierzchnica,<br />Z danymi do wysyłki:<br />Gamer Fix<br />+48 455 567 724<br />serwis.gamefix@gmail.com";
  }
  return "";
};

const getPaymentInfo = (order: Order) => {
  const providerId = order.payment_collections?.[0]?.payments?.[0]?.provider_id;

  if (providerId === "pp_autopay_pobranie_autopay") {
    return {
      methodName: "Płatność za pobraniem",
      details: "Pieniądze należy przekazać kurierowi przy odbiorze paczki",
    };
  }
  if (providerId === "pp_autopay_transfer_autopay") {
    return {
      methodName: "Płatność szybkim przelewem / BLIKiem",
      details:
        "Zamówienie zostało opłacone z góry za pomocą bramki płatniczej dostarczanej przez Autopay",
    };
  }
  return { methodName: "—", details: "—" };
};

export const orderPlacedConfirmationEmailHtml = (props: unknown): string => {
  const { order, storeUrl } = props as OrderConfirmationEmailProps;

  const productItems = order.items.filter(
    (item) => item.title !== COD_FEE_TITLE,
  );
  const codFeeItems = order.items.filter(
    (item) => item.title === COD_FEE_TITLE,
  );
  const hasServiceItems = order.items.some(
    (item) => item.product_collection === SERVICE_COLLECTION_TITLE,
  );

  const itemsSubtotal = productItems.reduce((sum, item) => sum + item.total, 0);
  const discountSubtotal = order.discount_subtotal ?? 0;

  const summaryRows = [
    renderSummaryRow("Wartość koszyka", formatMoney(itemsSubtotal)),
    renderSummaryRow("Dostawa", formatMoney(order.shipping_total ?? 0)),
    ...codFeeItems.map((item) =>
      renderSummaryRow(escapeHtml(item.title), formatMoney(item.total)),
    ),
    ...(discountSubtotal > 0
      ? [
          renderSummaryRow(
            "Rabat",
            `- ${formatMoney(discountSubtotal)}`,
            "#2563eb",
          ),
        ]
      : []),
  ].join("");

  const shippingAddress = order.shipping_address;
  const addressLine1 = [shippingAddress?.first_name, shippingAddress?.last_name]
    .filter(Boolean)
    .join(" ")
    .concat(shippingAddress?.company ? ` (${shippingAddress.company})` : "");
  const addressLine2 = [shippingAddress?.address_1, shippingAddress?.address_2]
    .filter(Boolean)
    .join(" ");
  const addressLine3 = [
    [shippingAddress?.postal_code, shippingAddress?.city]
      .filter(Boolean)
      .join(", "),
    shippingAddress?.province,
  ]
    .filter(Boolean)
    .join(", ");

  const shippingMethod = order.shipping_methods?.[0];
  const parcelLockerMetadata = order.metadata;
  const isParcelLocker =
    !!shippingMethod?.name?.includes("Paczkomat") &&
    !!parcelLockerMetadata?.parcel_locker_name &&
    !!parcelLockerMetadata?.parcel_locker_code;

  const paymentInfo = getPaymentInfo(order);
  const sentToServiceMethod = order.metadata?.sent_to_service_method;
  const shippingToServiceText =
    renderShippingToServiceText(sentToServiceMethod);

  const labelAttachedBanner =
    sentToServiceMethod === "inpost-locker"
      ? `<tr><td style="padding:0 40px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background-color:#eff6ff; border-radius:8px;"><tr><td style="padding:16px; color:#1d4ed8; font-size:14px; line-height:21px;">Etykieta do wysyłki sprzętu jest załączona do tego maila.</td></tr></table></td></tr>`
      : "";

  const serviceShippingSection = hasServiceItems
    ? `<tr>
      <td style="padding:32px 40px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-top:1px solid #e5e7eb;"><tr><td style="font-size:1px; line-height:1px;">&nbsp;</td></tr></table>
        <h2 style="margin:32px 0 16px; color:#111827; font-size:22px; font-weight:700; line-height:28px;">Wysyłka i odbiór sprzętu</h2>
        <h3 style="margin:0 0 8px; color:#111827; font-size:15px; font-weight:700; line-height:22px;">Metoda wysyłki sprzętu</h3>
        <p style="margin:0 0 20px; color:#4b5563; font-size:14px; line-height:21px;">${shippingToServiceText}</p>
        <h3 style="margin:0 0 8px; color:#111827; font-size:15px; font-weight:700; line-height:22px;">Metoda odbioru sprzętu</h3>
        <p style="margin:0; color:#4b5563; font-size:14px; line-height:21px;">Sprzęt zostanie odesłany przez wybraną metodę dostawy. (Jeśli zamówienie obejmuje produkty i usługę, produkty zostaną dostarczone razem z naprawionym sprzętem)</p>
      </td>
    </tr>`
    : "";

  return `<!doctype html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <title>Potwierdzenie zamówienia ${escapeHtml(String(order.display_id))}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6; color:#1f2937; font-family:Rubik, Arial, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">Dziękujemy za zamówienie nr ${escapeHtml(String(order.display_id))}.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background-color:#f3f4f6;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:640px; background-color:#ffffff;">
          <tr><td style="padding:24px 40px 0;">${renderIconRow(storeUrl)}</td></tr>
          <tr><td style="padding:40px 40px 28px; border-bottom:1px solid #e5e7eb;"><h1 style="margin:0 0 12px; color:#111827; font-size:28px; font-weight:700; line-height:36px;">Dziękujemy za zaufanie Gamer Fix!</h1><p style="margin:0; color:#374151; font-size:18px; line-height:28px;">Twoje zamówienie zostało złożone pomyślnie.</p></td></tr>
          ${labelAttachedBanner}
          <tr><td style="padding:28px 40px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;"><tr><td align="left" style="color:#2563eb; font-size:15px; line-height:23px;">Numer zamówienia: <strong>${escapeHtml(String(order.display_id))}</strong></td><td align="right" style="color:#4b5563; font-size:15px; line-height:23px; text-align:right;">Data zamówienia: <strong style="color:#1f2937;">${escapeHtml(formatDate(order.created_at))}</strong></td></tr></table></td></tr>
          <tr><td style="padding:34px 40px 0;">
            <h2 style="margin:0 0 16px; color:#111827; font-size:22px; font-weight:700; line-height:28px;">Podsumowanie</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-top:1px solid #e5e7eb;">${productItems.map(renderItemRow).join("")}</table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; margin-top:20px;">
              ${summaryRows}
              <tr><td colspan="2" style="padding:8px 0 0; border-bottom:1px solid #e5e7eb; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              <tr><td style="padding:16px 0 0; color:#111827; font-size:16px; font-weight:700; line-height:24px;">Razem</td><td align="right" style="padding:16px 0 0; color:#111827; font-size:20px; font-weight:700; line-height:24px; text-align:right;">${formatMoney(order.total)}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:36px 40px 0;">
            <h2 style="margin:0 0 16px; color:#111827; font-size:22px; font-weight:700; line-height:28px;">Dostawa</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; table-layout:fixed;">
              <tr>
                <td width="33.33%" valign="top" style="width:33.33%; padding:0 16px 0 0; color:#6b7280; font-size:14px; line-height:21px; overflow-wrap:break-word; word-wrap:break-word;">
                  <strong style="display:block; margin-bottom:4px; color:#1f2937; font-size:15px;">Adres dostawy</strong>
                  ${escapeHtml(addressLine1)}<br />
                  ${escapeHtml(addressLine2)}<br />
                  ${escapeHtml(addressLine3)}
                </td>
                <td width="33.33%" valign="top" style="width:33.33%; padding:0 16px 0 0; color:#6b7280; font-size:14px; line-height:21px; overflow-wrap:break-word; word-wrap:break-word;">
                  <strong style="display:block; margin-bottom:4px; color:#1f2937; font-size:15px;">Kontakt</strong>
                  ${escapeHtml(shippingAddress?.phone ?? "")}<br />
                  ${escapeHtml(order.customer?.email ?? order.email)}
                </td>
                <td width="33.33%" valign="top" style="width:33.33%; color:#6b7280; font-size:14px; line-height:21px; overflow-wrap:break-word; word-wrap:break-word;">
                  <strong style="display:block; margin-bottom:4px; color:#1f2937; font-size:15px;">Metoda dostawy</strong>
                  ${shippingMethod ? `${escapeHtml(shippingMethod.name)} (${formatMoney(shippingMethod.total)})` : ""}<br />
                  ${isParcelLocker ? `Paczkomat: ${escapeHtml(parcelLockerMetadata!.parcel_locker_name!)}<br />` : ""}
                  ${isParcelLocker ? `Kod paczkomatu: ${escapeHtml(parcelLockerMetadata!.parcel_locker_code!)}` : ""}
                </td>
              </tr>
            </table>
          </td></tr>
          ${serviceShippingSection}
          <tr><td style="padding:32px 40px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-top:1px solid #e5e7eb;"><tr><td style="font-size:1px; line-height:1px;">&nbsp;</td></tr></table>
            <h2 style="margin:32px 0 16px; color:#111827; font-size:22px; font-weight:700; line-height:28px;">Płatność</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
              <tr>
                <td width="33.33%" valign="top" style="padding:0 16px 0 0; color:#6b7280; font-size:14px; line-height:21px;">
                  <strong style="display:block; margin-bottom:4px; color:#1f2937; font-size:15px;">Metoda płatności</strong>
                  ${escapeHtml(paymentInfo.methodName)}
                </td>
                <td width="66.66%" valign="top" style="color:#6b7280; font-size:14px; line-height:21px;">
                  <strong style="display:block; margin-bottom:4px; color:#1f2937; font-size:15px;">Szczegóły płatności</strong>
                  ${escapeHtml(paymentInfo.details)}
                </td>
              </tr>
            </table>
          </td></tr>
          <tr><td style="padding:32px 40px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-top:1px solid #e5e7eb;"><tr><td style="font-size:1px; line-height:1px;">&nbsp;</td></tr></table>
            <h2 style="margin:28px 0 8px; color:#111827; font-size:16px; font-weight:700; line-height:24px;">Potrzebujesz pomocy?</h2>
            <p style="margin:0; font-size:15px; line-height:24px;"><a href="${storeUrl}/contact" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline;">Kontakt</a><br /><a href="${storeUrl}/returns" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline;">Zwroty i reklamacje</a></p>
          </td></tr>
          <tr><td style="padding:32px 40px 40px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-top:1px solid #e5e7eb;"><tr><td style="font-size:1px; line-height:1px;">&nbsp;</td></tr></table>
            <h2 style="margin:28px 0 8px; color:#111827; font-size:16px; font-weight:700; line-height:24px;">Sprawdź nasze produkty i usługi</h2>
            <p style="margin:0; font-size:15px; line-height:24px;"><a href="${storeUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; font-weight:700; text-decoration:underline;">gamerfix.pl</a></p>
          </td></tr>
          <tr><td style="padding:24px 40px 32px;">${renderIconRow(storeUrl)}</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
};
