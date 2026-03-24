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
    text: "ОГЭ, ЕГЭ и международные форматы с четким планом подготовки и контролем результата.",
  },
  {
    title: "Разговорный английский",
    text: "Для тех, кому важно начать говорить свободно и использовать английский в реальной жизни.",
  },
];

const advantages = [
  "Диагностика уровня и учебной цели перед стартом.",
  "Персональный маршрут обучения без хаотичной нагрузки.",
  "Сильная работа с базой: grammar, vocabulary, speaking, reading.",
  "Регулярная практика и понятный контроль прогресса.",
  "Комфортный онлайн-формат для детей, подростков и взрослых.",
  "Академическая глубина без сухой школьной подачи.",
];

const expertPoints = [
  {
    title: "Системный подход",
    text: "Каждое обучение строится на диагностике, понятной цели и последовательной программе.",
  },
  {
    title: "Академическая глубина",
    text: "Мы усиливаем базу, речь, грамматику и чтение так, чтобы результат был устойчивым.",
  },
  {
    title: "Спокойный темп",
    text: "Ученик движется без перегруза, но с ясной логикой, дисциплиной и регулярной практикой.",
  },
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
        <section className="hero-panel">
          <div className="hero-copy-column">
            <p className="hero-kicker">Онлайн-центр английского языка</p>
            <h1 className="hero-heading">
              <span className="hero-heading-script">Студия</span>
              <span className="hero-heading-main">Английского</span>
            </h1>
            <p className="hero-lead">
              Системное обучение английскому для детей, подростков и взрослых:
              с ясной программой, спокойной подачей и ощутимым результатом.
            </p>
            <div className="hero-actions">
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-rose-500 px-6 font-semibold text-white transition hover:-translate-y-0.5"
              >
                Записаться на пробный урок
              </a>
              <a
                href="#about"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 font-semibold text-slate-800"
              >
                О центре
              </a>
            </div>
          </div>

          <div className="hero-proof">
            <div className="hero-proof-card">
              <p className="hero-proof-label">Фокус</p>
              <p className="hero-proof-value">Grammar, Speaking, Reading</p>
              <p className="hero-proof-text">
                Программа выстраивается вокруг сильной базы и устойчивого
                языкового роста.
              </p>
            </div>
            <div className="hero-proof-grid">
              {expertPoints.map((point) => (
                <article key={point.title} className="hero-proof-item">
                  <h2>{point.title}</h2>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-8">
          <div className="about-shell">
            <div className="about-intro">
              <div>
                <p className="section-kicker">О нас</p>
                <h2 className="section-title about-title">
                  Экспертная студия английского с продуманной образовательной
                  системой
                </h2>
              </div>
              <p className="section-copy about-copy">
                Студия Английского объединяет академический уровень, бережную
                атмосферу и современную онлайн-подачу. Мы выстраиваем обучение
                как понятный маршрут, где ученик чувствует опору, видит свой
                прогресс и спокойно растет в языке.
              </p>
            </div>

            <div className="about-gallery">
              <article className="about-card">
                <div className="about-image-frame">
                  <Image
                    src="/images/lena-founder-hero.jpg"
                    alt="Студия Английского"
                    width={927}
                    height={1648}
                    className="about-image"
                  />
                </div>
                <div className="about-card-copy">
                  <p className="about-card-kicker">Опыт и качество</p>
                  <h3 className="about-card-title">
                    Многолетняя преподавательская практика и сильный
                    академический стандарт
                  </h3>
                  <p className="about-card-text">
                    В обучении важны не только уроки, но и глубина объяснения,
                    логика программы, качественная база и умение привести
                    ученика к реальному результату.
                  </p>
                  <div className="about-pills">
                    <span>Сильная методическая база</span>
                    <span>Глубокая языковая опора</span>
                  </div>
                </div>
              </article>

              <article className="about-card">
                <div className="about-image-frame">
                  <Image
                    src="/images/lena-founder-profile.jpg"
                    alt="Подход Студии Английского"
                    width={927}
                    height={1648}
                    className="about-image"
                  />
                </div>
                <div className="about-card-copy">
                  <p className="about-card-kicker">Подход и маршрут</p>
                  <h3 className="about-card-title">
                    Спокойная атмосфера, понятная структура и персональный
                    прогресс
                  </h3>
                  <p className="about-card-text">
                    Мы выстраиваем программу так, чтобы ученик занимался в
                    комфортном темпе, понимал свои шаги и ощущал стабильное
                    движение вперед без перегруза.
                  </p>
                  <div className="about-pills">
                    <span>Комфортный темп</span>
                    <span>Прозрачная обратная связь</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="programs" className="py-8">
          <div className="mb-6">
            <p className="section-kicker">Программы</p>
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
              <p className="section-kicker">Преимущества</p>
              <h2 className="section-title max-w-3xl">
                Почему учиться у нас удобно, спокойно и результативно
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
            <p className="section-kicker">Контакт</p>
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
