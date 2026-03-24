"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/admin");
        }
      })
      .catch(() => {});
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Не удалось выполнить вход");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Вход в админку</h1>
        <p className="mb-6 text-slate-500">
          Управление контентом Студии Английского
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="admin-label">Логин</span>
            <input
              className="admin-input"
              value={formData.username}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
            />
          </label>
          <label className="block">
            <span className="admin-label">Пароль</span>
            <input
              type="password"
              className="admin-input"
              value={formData.password}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  remember: event.target.checked,
                }))
              }
            />
            Запомнить меня
          </label>
          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
