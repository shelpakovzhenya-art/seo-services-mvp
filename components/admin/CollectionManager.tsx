"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ResourceConfig } from "@/lib/admin-config";

type RecordValue = Record<string, any>;

const defaultValueForType = (type?: string) => {
  if (type === "checkbox") {
    return true;
  }

  if (type === "number") {
    return 0;
  }

  return "";
};

export default function CollectionManager({
  resource,
  config,
}: {
  resource: string;
  config: ResourceConfig;
}) {
  const [items, setItems] = useState<RecordValue[]>([]);
  const [form, setForm] = useState<RecordValue>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const emptyForm = useMemo(
    () =>
      config.fields.reduce<RecordValue>((acc, field) => {
        acc[field.key] = defaultValueForType(field.type);
        return acc;
      }, {}),
    [config.fields]
  );

  const loadItems = useCallback(async () => {
    const response = await fetch(`/api/admin/${resource}`);
    const data = await response.json();
    setItems(data.items || []);
  }, [resource]);

  useEffect(() => {
    setForm(emptyForm);
  }, [emptyForm]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Сохранение...");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/${resource}/${editingId}`
      : `/api/admin/${resource}`;

    const payload = { ...form };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Ошибка сохранения" }));
      setStatus(data.error || "Ошибка сохранения");
      return;
    }

    setStatus("Сохранено");
    setEditingId(null);
    setForm(emptyForm);
    await loadItems();
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/admin/${resource}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setStatus("Не удалось удалить запись");
      return;
    }

    setStatus("Удалено");
    await loadItems();
  }

  function startEdit(item: RecordValue) {
    setEditingId(item.id);
    const nextForm = { ...emptyForm, ...item };

    config.fields.forEach((field) => {
      if (field.type === "datetime-local" && nextForm[field.key]) {
        nextForm[field.key] = new Date(nextForm[field.key]).toISOString().slice(0, 16);
      }
    });

    setForm(nextForm);
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h1 className="text-3xl font-bold text-slate-900">{config.label}</h1>
        <p className="mt-2 text-slate-600">{config.description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="admin-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingId ? "Редактирование записи" : "Новая запись"}
            </h2>
            {editingId ? (
              <button
                type="button"
                className="text-sm text-slate-500"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Сбросить
              </button>
            ) : null}
          </div>

          {config.fields.map((field) => (
            <label key={field.key} className="block">
              <span className="admin-label">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  className="admin-input min-h-28"
                  required={field.required}
                  value={form[field.key] ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(form[field.key])}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.checked,
                    }))
                  }
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : field.type || "text"}
                  className="admin-input"
                  required={field.required}
                  value={form[field.key] ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]:
                        field.type === "number"
                          ? Number(event.target.value)
                          : event.target.value,
                    }))
                  }
                />
              )}
            </label>
          ))}

          <div className="flex items-center gap-3">
            <Button type="submit">
              {editingId ? "Сохранить изменения" : "Создать запись"}
            </Button>
            <span className="text-sm text-slate-500">{status}</span>
          </div>
        </form>

        <div className="admin-card">
          <h2 className="mb-4 text-xl font-semibold">Список записей</h2>
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
                Пока нет записей
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.title || item.name || item.question || item.author}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.slug || item.role || item.contact || item.category || item.status || "Запись"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => startEdit(item)}>
                        Изменить
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
