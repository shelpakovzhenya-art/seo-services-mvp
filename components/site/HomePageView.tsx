import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Dictionary, Locale } from "@/lib/i18n";

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

export default async function HomePageView({
  locale,
  dictionary,
  isSuccess,
  isError,
}: {
  locale: Locale;
  dictionary: Dictionary;
  isSuccess: boolean;
  isError: boolean;
}) {
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

      <Header locale={locale} dictionary={dictionary} />

      <main className="site-shell relative z-10">
        <section className="hero-panel">
          <div className="hero-copy-column">
            <p className="hero-kicker">{dictionary.hero.kicker}</p>
            <h1 className="hero-heading">
              <span className="hero-heading-script">{dictionary.hero.titlePrimary}</span>
              <span className="hero-heading-main">{dictionary.hero.titleSecondary}</span>
            </h1>
            <p className="hero-lead">{dictionary.hero.lead}</p>
            <div className="hero-actions">
              <a
                href={`/${locale}#contact`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-rose-500 px-6 font-semibold text-white transition hover:-translate-y-0.5"
              >
                {dictionary.hero.primaryCta}
              </a>
              <a
                href={`/${locale}#about`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 font-semibold text-slate-800"
              >
                {dictionary.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="hero-proof">
            <div className="hero-proof-card">
              <p className="hero-proof-label">{dictionary.hero.focusLabel}</p>
              <p className="hero-proof-value">{dictionary.hero.focusValue}</p>
              <p className="hero-proof-text">{dictionary.hero.focusText}</p>
            </div>
            <div className="hero-proof-grid">
              {dictionary.hero.points.map((point) => (
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
                <p className="section-kicker">{dictionary.about.kicker}</p>
                <h2 className="section-title about-title">{dictionary.about.title}</h2>
              </div>
              <p className="section-copy about-copy">{dictionary.about.text}</p>
            </div>

            <div className="about-gallery">
              <article className="about-card">
                <div className="about-image-frame">
                  <Image
                    src="/images/lena-founder-hero.jpg"
                    alt={dictionary.about.cards[0].alt}
                    width={927}
                    height={1648}
                    className="about-image"
                  />
                </div>
                <div className="about-card-copy">
                  <p className="about-card-kicker">{dictionary.about.cards[0].kicker}</p>
                  <h3 className="about-card-title">{dictionary.about.cards[0].title}</h3>
                  <p className="about-card-text">{dictionary.about.cards[0].text}</p>
                  <div className="about-pills">
                    {dictionary.about.cards[0].pills.map((pill) => (
                      <span key={pill}>{pill}</span>
                    ))}
                  </div>
                </div>
              </article>

              <article className="about-card">
                <div className="about-image-frame">
                  <Image
                    src="/images/lena-founder-profile.jpg"
                    alt={dictionary.about.cards[1].alt}
                    width={927}
                    height={1648}
                    className="about-image"
                  />
                </div>
                <div className="about-card-copy">
                  <p className="about-card-kicker">{dictionary.about.cards[1].kicker}</p>
                  <h3 className="about-card-title">{dictionary.about.cards[1].title}</h3>
                  <p className="about-card-text">{dictionary.about.cards[1].text}</p>
                  <div className="about-pills">
                    {dictionary.about.cards[1].pills.map((pill) => (
                      <span key={pill}>{pill}</span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="programs" className="py-8">
          <div className="mb-6">
            <p className="section-kicker">{dictionary.programs.kicker}</p>
            <h2 className="section-title">{dictionary.programs.title}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dictionary.programs.items.map((program) => (
              <article key={program.title} className="soft-card p-6">
                <h3 className="mb-3 text-xl font-bold text-slate-900">{program.title}</h3>
                <p className="text-slate-600 leading-7">{program.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="advantages" className="py-8">
          <div className="glass-card px-6 py-8 md:px-10 md:py-10">
            <div className="mb-8">
              <p className="section-kicker">{dictionary.advantages.kicker}</p>
              <h2 className="section-title max-w-3xl">{dictionary.advantages.title}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dictionary.advantages.items.map((item) => (
                <div key={item} className="soft-card p-5 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="grid gap-6 py-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="soft-card p-6 md:p-8">
            <p className="section-kicker">{dictionary.contact.kicker}</p>
            <h2 className="section-title text-3xl md:text-4xl">{dictionary.contact.title}</h2>
            <p className="section-copy mt-4">{dictionary.contact.text}</p>
          </div>
          <form action="/api/lead" method="post" className="soft-card grid gap-4 p-6 md:p-8">
            <input type="hidden" name="locale" value={locale} />
            {isSuccess ? (
              <div className="form-status form-status-success">
                {dictionary.contact.statusSuccess}
              </div>
            ) : null}
            {isError ? (
              <div className="form-status form-status-error">
                {dictionary.contact.statusError}
              </div>
            ) : null}
            <label>
              <span className="admin-label">{dictionary.contact.fields.name}</span>
              <input className="admin-input" name="name" required />
            </label>
            <label>
              <span className="admin-label">{dictionary.contact.fields.contact}</span>
              <input className="admin-input" name="contact" required />
            </label>
            <label>
              <span className="admin-label">{dictionary.contact.fields.message}</span>
              <textarea className="admin-input min-h-32" name="message" />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 font-semibold text-white"
            >
              {dictionary.contact.button}
            </button>
          </form>
        </section>
      </main>

      <Footer locale={locale} dictionary={dictionary} />
    </div>
  );
}
