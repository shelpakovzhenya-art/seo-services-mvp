"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/programs", label: "Программы" },
  { href: "/admin/teachers", label: "Преподаватели" },
  { href: "/admin/pages", label: "Страницы" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/blog", label: "Блог" },
  { href: "/admin/leads", label: "Лиды" },
  { href: "/admin/seo-files", label: "SEO-файлы" },
  { href: "/admin/settings", label: "Настройки" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
          <Link href="/admin" className="flex flex-col no-underline">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
              Content Control
            </span>
            <span className="mt-1 text-2xl font-bold text-slate-900">
              Админка Студии Английского
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-rose-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-rose-600"
          >
            <ExternalLink className="h-4 w-4" />
            На сайт
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="gap-2 rounded-full">
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>
    </nav>
  );
}
