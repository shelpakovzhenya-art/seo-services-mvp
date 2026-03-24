type LeadEmailPayload = {
  name: string;
  contact: string;
  message: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "";
  const to = process.env.RESEND_TO_EMAIL?.trim() || "";

  if (!apiKey || !from || !to) {
    return null;
  }

  return { apiKey, from, to };
}

export async function sendLeadEmail(payload: LeadEmailPayload) {
  const config = getResendConfig();

  if (!config) {
    return { skipped: true as const };
  }

  const safeName = escapeHtml(payload.name);
  const safeContact = escapeHtml(payload.contact);
  const safeMessage = escapeHtml(payload.message || "Не указано");

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "studio-angliyskogo/1.0",
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject: "Новая заявка с сайта Студии Английского",
      reply_to: config.from,
      text: `Новая заявка с сайта\n\nИмя: ${payload.name}\nКонтакт: ${payload.contact}\nСообщение: ${payload.message || "Не указано"}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
          <h2 style="margin:0 0 16px">Новая заявка с сайта</h2>
          <p><strong>Имя:</strong> ${safeName}</p>
          <p><strong>Контакт:</strong> ${safeContact}</p>
          <p><strong>Сообщение:</strong><br />${safeMessage}</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${errorText}`);
  }

  return { skipped: false as const };
}
