"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type SEOFilesState = {
  robotsTxt: string;
  sitemapXml: string;
};

export default function SEOFilesManager() {
  const [form, setForm] = useState<SEOFilesState>({
    robotsTxt: "",
    sitemapXml: "",
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadFiles = async () => {
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/seo-files");
      const data = await response.json();
      setForm({
        robotsTxt: data.robotsTxt || "",
        sitemapXml: data.sitemapXml || "",
      });
    } catch (error) {
      console.error(error);
      setStatus("Не удалось загрузить SEO-файлы");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const saveFiles = async () => {
    setStatus("Сохраняем...");

    const response = await fetch("/api/admin/seo-files", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setStatus("Не удалось сохранить SEO-файлы");
      return;
    }

    setStatus("SEO-файлы сохранены");
  };

  return (
    <div className="space-y-6">
      <section className="admin-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              Техническое SEO
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">robots.txt и sitemap.xml</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Редактирование SEO-файлов прямо из админки без ручной правки на сервере.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" className="rounded-full" onClick={loadFiles}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Обновить
            </Button>
            <Button type="button" className="rounded-full" onClick={saveFiles}>
              <Save className="mr-2 h-4 w-4" />
              Сохранить файлы
            </Button>
          </div>
        </div>
        {status ? <p className="mt-4 text-sm text-slate-500">{status}</p> : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="admin-card">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">robots.txt</h2>
            <p className="mt-1 text-sm text-slate-500">Файл доступен по адресу `/robots.txt`.</p>
          </div>
          <textarea
            className="admin-input min-h-[320px] font-mono text-sm"
            value={form.robotsTxt}
            onChange={(event) =>
              setForm((current) => ({ ...current, robotsTxt: event.target.value }))
            }
          />
        </section>

        <section className="admin-card">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">sitemap.xml</h2>
            <p className="mt-1 text-sm text-slate-500">Файл доступен по адресу `/sitemap.xml`.</p>
          </div>
          <textarea
            className="admin-input min-h-[320px] font-mono text-sm"
            value={form.sitemapXml}
            onChange={(event) =>
              setForm((current) => ({ ...current, sitemapXml: event.target.value }))
            }
          />
        </section>
      </div>
    </div>
  );
}
