"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const fields = [
  { key: "siteName", label: "Название сайта", type: "text" },
  { key: "siteDescription", label: "Описание сайта", type: "textarea", span: "md:col-span-2" },
  { key: "phone", label: "Телефон", type: "text" },
  { key: "telegram", label: "Telegram URL", type: "text" },
  { key: "whatsapp", label: "WhatsApp URL", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "address", label: "Адрес", type: "text", span: "md:col-span-2" },
  { key: "footerText", label: "Текст в подвале", type: "textarea", span: "md:col-span-2" },
];

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, any>;
}) {
  const [form, setForm] = useState(initialSettings);
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Сохраняем...");

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setStatus("Не удалось сохранить настройки");
      return;
    }

    setStatus("Настройки сохранены");
  }

  return (
    <div className="space-y-6">
      <section className="admin-card">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
          Site Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Настройки сайта</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Сквозные данные центра, контактные каналы и тексты, которые влияют на
          публичную часть сайта.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="admin-card grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className={field.span || ""}>
            <span className="admin-label">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                className="admin-input min-h-28"
                value={form[field.key] || ""}
                onChange={(event) =>
                  setForm((current: Record<string, any>) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
              />
            ) : (
              <input
                className="admin-input"
                value={form[field.key] || ""}
                onChange={(event) =>
                  setForm((current: Record<string, any>) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
              />
            )}
          </label>
        ))}

        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Button type="submit" className="rounded-full px-6">
            Сохранить настройки
          </Button>
          <span className="text-sm text-slate-500">{status}</span>
        </div>
      </form>
    </div>
  );
}
