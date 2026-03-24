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
  { title: "Настройки", href: "/admin/settings", key: "settings" },
];

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [programs, teachers, pages, faq, reviews, blog, leads] =
    await Promise.all([
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
    settings: "1",
  };

  return (
    <div>
      <div className="admin-card mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Управление сайтом и контентной структурой Студии Английского.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardLinks.map((item) => (
          <div key={item.href} className="admin-card">
            <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            <p className="mb-4 mt-3 text-4xl font-bold text-rose-600">
              {values[item.key]}
            </p>
            <Link href={item.href}>
              <Button variant="outline" className="w-full rounded-full">
                Открыть модуль
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
