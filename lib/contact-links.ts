export function normalizeTelegramLink(value?: string | null) {
  const input = value?.trim();

  if (!input) {
    return "";
  }

  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  if (input.startsWith("t.me/")) {
    return `https://${input}`;
  }

  if (input.startsWith("@")) {
    return `https://t.me/${input.slice(1)}`;
  }

  return `https://t.me/${input.replace(/^\/+/, "")}`;
}

export function normalizeExternalLink(value?: string | null) {
  const input = value?.trim();

  if (!input) {
    return "";
  }

  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  return `https://${input}`;
}
