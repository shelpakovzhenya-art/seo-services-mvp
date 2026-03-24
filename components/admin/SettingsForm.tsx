"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, any>;
}) {
  const [form, setForm] = useState(initialSettings);
  const [status, setStatus] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Сохранение...");

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
      <div className="admin-card">
        <h1 className="text-3xl font-bold text-slate-900">Настройки сайта</h1>
        <p className="mt-2 text-slate-600">
          Сквозные данные центра, контакты и подписи.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="admin-card grid gap-4 md:grid-cols-2">
        {[ 
          ["siteName", "Название сайта"],
          ["siteDescription", "Описание сайта"],
          ["phone", "Телефон"],
          ["telegram", "Telegram URL"],
          ["whatsapp", "WhatsApp URL"],
          ["email", "Email"],
          ["address", "Адрес"],
          ["footerText", "Текст в подвале"],
        ].map(([key, label]) => (
          <label key={key} className={key === "footerText" || key === "siteDescription" ? "md:col-span-2" : ""}>
            <span className="admin-label">{label}</span>
            <textarea
              className="admin-input min-h-24"
              value={form[key] || ""}
              onChange={(event) =>
                setForm((current: Record<string, any>) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
            />
          </label>
        ))}
        <div className="md:col-span-2 flex items-center gap-3">
          <Button type="submit">Сохранить настройки</Button>
          <span className="text-sm text-slate-500">{status}</span>
        </div>
      </form>
    </div>
  );
}
