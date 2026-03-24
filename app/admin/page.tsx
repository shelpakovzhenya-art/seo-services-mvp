import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const dashboardLinks = [
  { title: "Программы", href: "/admin/programs", key: "programs" },
  { title: "Преподаватели", href: "/admin/teachers", key: "teachers" },
  { title: "Страницы", href: "/admin/pages", key: "pages" },
  { title: "FAQ", href: "/admin/faq", key: "faq" },
  { title: "Отзывы", href: "/admin/reviews", key: "reviews" },
  { title: "Блог", href: "/admin/blog", key: "blog" },
  { title: "Лиды", href: "/admin/leads", key: "leads" },
  { title: "SEO-файлы", href: "/admin/seo-files", key: "seoFiles" },
  { title: "Настройки", href: "/admin/settings", key: "settings" },
];

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [programs, teachers, pages, faq, reviews, blog, leads] = await Promise.all([
    prisma.program.count(),
    prisma.teacher.count(),
    prisma.page.count(),
    prisma.fAQItem.count(),
    prisma.review.count(),
    prisma.blogPost.count(),
    prisma.lead.count(),
  ]);

  const values: Record<string, string> = {
    programs: String(programs),
    teachers: String(teachers),
    pages: String(pages),
    faq: String(faq),
    reviews: String(reviews),
    blog: String(blog),
    leads: String(leads),
    seoFiles: "2",
    settings: "1",
  };

  return (
    <div className="space-y-6">
      <section className="admin-card overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              Control Center
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Управление сайтом и контентом
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Контент, SEO-файлы, заявки и настройки теперь собраны в более
              структурированной админке с редакторами и понятной навигацией.
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Всего модулей</p>
            <p className="mt-3 text-5xl font-bold text-slate-900">
              {dashboardLinks.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {dashboardLinks.map((item) => (
          <article key={item.href} className="admin-list-card">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
              Модуль
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              {item.title}
            </h2>
            <p className="mt-4 text-5xl font-bold text-rose-600">
              {values[item.key]}
            </p>
            <Link href={item.href} className="mt-6 block">
              <Button variant="outline" className="w-full rounded-full">
                Открыть модуль
              </Button>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
