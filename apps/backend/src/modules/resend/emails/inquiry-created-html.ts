type InquiryCreatedEmailProps = {
  inquiry: {
    clientName: string;
    date: string;
    storeUrl: string;
    inquiriesUrl: string;
  };
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

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

export const inquiryCreatedEmailHtml = (props: unknown): string => {
  const { inquiry } = props as InquiryCreatedEmailProps;
  const clientName = escapeHtml(inquiry.clientName);
  const date = escapeHtml(inquiry.date);
  const storeUrl = escapeHtml(inquiry.storeUrl);
  const inquiriesUrl = escapeHtml(inquiry.inquiriesUrl);

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
    <title>Nowe zapytanie od klienta</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6; color:#1f2937; font-family:Rubik, Arial, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">Nowe zapytanie od ${clientName} z formularza kontaktowego.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background-color:#f3f4f6;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:640px; background-color:#ffffff;">
          <tr><td style="padding:24px 40px 0;">${renderIconRow(storeUrl)}</td></tr>
          <tr><td style="padding:40px 40px 28px; border-bottom:1px solid #e5e7eb;"><h1 style="margin:0 0 12px; color:#111827; font-size:28px; font-weight:700; line-height:36px;">Nowe zapytanie od klienta</h1><p style="margin:0; color:#374151; font-size:18px; line-height:28px;">Otrzymałeś nową wiadomość z formularza kontaktowego.</p></td></tr>
          <tr><td style="padding:28px 40px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;"><tr><td align="left" style="color:#2563eb; font-size:18px; line-height:28px;">Klient: <strong>${clientName}</strong></td><td align="right" style="color:#4b5563; font-size:18px; line-height:28px; text-align:right;">Data: <strong style="color:#1f2937;">${date}</strong></td></tr></table></td></tr>
          <tr><td style="padding:40px 40px 8px;" align="center"><p style="margin:0 0 32px; color:#374151; font-size:18px; line-height:28px; text-align:center; max-width:480px;">Sprawdź szczegóły zapytania i odpowiedz klientowi jak najszybciej.</p><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" bgcolor="#2563eb" style="border-radius:8px;"><a href="${inquiriesUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:18px; font-weight:700; line-height:28px; text-decoration:none; border-radius:8px;">Sprawdź zapytanie</a></td></tr></table></td></tr>
          <tr><td style="padding:24px 40px 32px;">${renderIconRow(storeUrl)}</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
};
