"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/admin/RichTextEditor";
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

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

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
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");

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

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return items;
    }

    const search = query.toLowerCase();

    return items.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [items, query]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Сохраняем...");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/${resource}/${editingId}`
      : `/api/admin/${resource}`;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
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

  const summaryValue = (item: RecordValue) =>
    item.title ||
    item.name ||
    item.question ||
    item.author ||
    item.slug ||
    "Запись";

  const metaValue = (item: RecordValue) =>
    item.slug ||
    item.role ||
    item.contact ||
    item.category ||
    item.status ||
    "Без метки";

  const textPreview = (item: RecordValue) => {
    const text =
      item.summary ||
      item.description ||
      item.content ||
      item.text ||
      item.bio ||
      item.answer ||
      item.message ||
      "";

    return stripHtml(String(text)).slice(0, 180);
  };

  return (
    <div className="space-y-6">
      <section className="admin-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              Контент-модуль
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{config.label}</h1>
            <p className="mt-3 max-w-3xl text-slate-600">{config.description}</p>
          </div>
          <div className="grid min-w-[220px] gap-3 rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Всего записей</p>
            <p className="text-4xl font-bold text-slate-900">{items.length}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="admin-card space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {editingId ? "Редактирование записи" : "Новая запись"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Структурированное редактирование с визуальным контентом.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Очистить
            </Button>
          </div>

          <div className="grid gap-4">
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
                ) : field.type === "richtext" ? (
                  <RichTextEditor
                    content={form[field.key] ?? ""}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: value,
                      }))
                    }
                  />
                ) : field.type === "checkbox" ? (
                  <label className="admin-toggle">
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
                    <span>{Boolean(form[field.key]) ? "Опубликовано" : "Скрыто"}</span>
                  </label>
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
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="rounded-full px-6">
              {editingId ? "Сохранить изменения" : "Создать запись"}
            </Button>
            <span className="text-sm text-slate-500">{status}</span>
          </div>
        </form>

        <section className="admin-card">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Список записей</h2>
              <p className="mt-1 text-sm text-slate-500">
                Быстрый поиск и редактирование контента.
              </p>
            </div>
            <label className="relative block md:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="admin-input pl-11"
                placeholder="Поиск по записям"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-5 space-y-4">
            {filteredItems.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                Записей пока нет
              </div>
            ) : (
              filteredItems.map((item) => (
                <article key={item.id} className="admin-list-card">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {summaryValue(item)}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {metaValue(item)}
                        </span>
                      </div>
                      {textPreview(item) ? (
                        <p className="max-w-2xl text-sm leading-7 text-slate-600">
                          {textPreview(item)}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Изменить
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
