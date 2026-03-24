import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePageView from "@/components/site/HomePageView";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { withBaseUrl } from "@/lib/site-url";

type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ success?: string; error?: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  if (!isLocale(resolvedParams.locale)) {
    return {};
  }

  const locale = resolvedParams.locale as Locale;
  const dictionary = getDictionary(locale);
  const pathname = `/${locale}`;

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    alternates: {
      canonical: withBaseUrl(pathname),
      languages: {
        ru: withBaseUrl("/ru"),
        en: withBaseUrl("/en"),
        "x-default": withBaseUrl("/ru"),
      },
    },
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      url: withBaseUrl(pathname),
      locale: locale === "ru" ? "ru_RU" : "en_US",
      siteName: dictionary.meta.title,
      type: "website",
    },
  };
}

export default async function LocalizedHomePage({
  params,
  searchParams,
}: LocalizedPageProps) {
  const resolvedParams = await params;

  if (!isLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;
  const dictionary = getDictionary(locale);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <HomePageView
      locale={locale}
      dictionary={dictionary}
      isSuccess={resolvedSearchParams?.success === "1"}
      isError={resolvedSearchParams?.error === "1"}
    />
  );
}
