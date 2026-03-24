import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const programs = [
  {
    title: "Английский для детей",
    text: "Мягкий вход в язык через интерес, игровую динамику, правильное произношение и сильную языковую базу.",
  },
  {
    title: "Английский для школьников",
    text: "Системная работа с грамматикой, лексикой, устной практикой и уверенностью в учебе.",
  },
  {
    title: "Подготовка к экзаменам",
    text: "ЕГЭ, ОГЭ и международные форматы с четким планом подготовки и контролем результата.",
  },
  {
    title: "Разговорный английский",
    text: "Для тех, кому важно начать говорить свободно и использовать английский в реальной жизни.",
  },
];

const advantages = [
  "Понятная методика: от диагностики до измеримого результата.",
  "Комфортный онлайн-формат для детей, подростков и взрослых.",
  "Индивидуальный маршрут обучения под уровень и цель ученика.",
  "Теплая атмосфера без стресса и перегруза.",
  "Регулярная обратная связь и прозрачный контроль прогресса.",
  "Сильная база для масштабирования центра и SEO-роста.",
];

const decorItems = [
  "decor-pencil",
  "decor-ruler",
  "decor-notebook",
  "decor-book",
  "decor-book-reading",
  "decor-book-grammar",
  "decor-book-speaking",
  "decor-clip",
  "decor-card",
  "decor-eraser",
  "decor-eraser-two",
  "decor-hand",
  "decor-pencil-two",
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden pb-8">
      <div className="school-scene" aria-hidden="true">
        <div className="chalkboard chalkboard-left">
          <span>Class Work</span>
          <small>Reading • Speaking</small>
        </div>
        <div className="chalkboard chalkboard-right">
          <span>Class Work</span>
          <small>Grammar • Vocabulary</small>
        </div>
        {decorItems.map((item) => (
          <div key={item} className={`school-float ${item}`} />
        ))}
      </div>

      <Header />

      <main className="site-shell relative z-10">
        <section className="glass-card grid items-center gap-10 overflow-hidden px-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-12">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-rose-600">
              Онлайн-центр нового поколения
            </p>
            <h1 className="section-title max-w-3xl">
              Студия Английского
              <span className="mt-2 block text-slate-700">
                теплый, эстетичный и сильный центр английского языка
              </span>
            </h1>
            <p className="section-copy mt-6 max-w-2xl">
              Мы выстраиваем обучение так, чтобы английский становился понятным,
              живым и устойчивым навыком. В центре внимания не просто уроки, а
              продуманная система: диагностика, маршрут, регулярная практика и
              ясный прогресс.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-rose-500 px-6 font-semibold text-white transition hover:-translate-y-0.5"
              >
                Записаться на пробный урок
              </a>
              <a
                href="#advantages"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 font-semibold text-slate-800"
              >
                Посмотреть преимущества
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="soft-card overflow-hidden">
              <Image
                src="/images/lena-founder-hero.jpg"
                alt="Атмосфера Студии Английского"
                width={927}
                height={1648}
                className="h-full min-h-[320px] w-full object-cover"
              />
            </div>
            <div className="soft-card overflow-hidden">
              <Image
                src="/images/lena-founder-profile.jpg"
                alt="Образ Студии Английского"
                width={927}
                height={1648}
                className="h-full min-h-[320px] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section id="about" className="grid gap-6 py-8 md:grid-cols-2">
          <div className="soft-card p-6 md:p-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose-500">
              О нас
            </p>
            <h2 className="section-title text-3xl md:text-4xl">
              Не просто занятия, а целая образовательная среда
            </h2>
          </div>
          <div className="soft-card p-6 md:p-8">
            <p className="section-copy">
              Студия Английского задумана как современный онлайн-центр, где
              сочетаются академическая системность, забота о состоянии ученика и
              эстетичная подача. Мы не перегружаем, а ведем к результату через
              ясную структуру, дисциплину и комфортный темп.
            </p>
          </div>
        </section>

        <section id="programs" className="py-8">
          <div className="mb-6">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose-500">
              Программы
            </p>
            <h2 className="section-title">Ключевые направления обучения</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {programs.map((program) => (
              <article key={program.title} className="soft-card p-6">
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {program.title}
                </h3>
                <p className="text-slate-600 leading-7">{program.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="advantages" className="py-8">
          <div className="glass-card px-6 py-8 md:px-10 md:py-10">
            <div className="mb-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose-500">
                Преимущества
              </p>
              <h2 className="section-title max-w-3xl">
                Почему детям, подросткам и взрослым комфортно учиться у нас
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {advantages.map((item) => (
                <div key={item} className="soft-card p-5 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="grid gap-6 py-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="soft-card p-6 md:p-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose-500">
              Контакт
            </p>
            <h2 className="section-title text-3xl md:text-4xl">
              Оставьте заявку на пробный урок
            </h2>
            <p className="section-copy mt-4">
              Мы свяжемся, уточним задачу, уровень и предложим оптимальный
              формат обучения.
            </p>
          </div>
          <form
            action="/api/lead"
            method="post"
            className="soft-card grid gap-4 p-6 md:p-8"
          >
            <label>
              <span className="admin-label">Имя</span>
              <input className="admin-input" name="name" required />
            </label>
            <label>
              <span className="admin-label">Телефон или Telegram</span>
              <input className="admin-input" name="contact" required />
            </label>
            <label>
              <span className="admin-label">Цель обучения</span>
              <textarea className="admin-input min-h-32" name="message" />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 font-semibold text-white"
            >
              Отправить заявку
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
