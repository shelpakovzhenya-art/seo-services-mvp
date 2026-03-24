"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="site-shell relative z-10 flex items-center justify-between gap-4 py-6">
      <Link href="/" className="flex flex-col no-underline">
        <span className="text-sm uppercase tracking-[0.3em] text-rose-500">
          Онлайн-центр
        </span>
        <span className="text-xl font-extrabold text-slate-900 md:text-2xl">
          Студия Английского
        </span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <a href="#about">О нас</a>
        <a href="#programs">Программы</a>
        <a href="#advantages">Преимущества</a>
        <a href="#contact">Контакты</a>
      </nav>

      <div className="flex items-center gap-3">
        <Button asChild className="rounded-full px-5">
          <a href="#contact">Оставить заявку</a>
        </Button>
      </div>
    </header>
  );
}
