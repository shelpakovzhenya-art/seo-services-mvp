export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "datetime-local";
  required?: boolean;
};

export type ResourceConfig = {
  label: string;
  description: string;
  fields: FieldConfig[];
};

export const adminResources: Record<string, ResourceConfig> = {
  programs: {
    label: "Программы",
    description: "Направления обучения и SEO-посадки центра.",
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title", label: "Название", required: true },
      { key: "summary", label: "Краткое описание", type: "textarea" },
      { key: "description", label: "Полное описание", type: "textarea" },
      { key: "price", label: "Стоимость" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "isPublished", label: "Опубликовано", type: "checkbox" },
    ],
  },
  teachers: {
    label: "Преподаватели",
    description: "Карточки преподавателей и кураторов центра.",
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "name", label: "Имя", required: true },
      { key: "role", label: "Роль" },
      { key: "experience", label: "Опыт" },
      { key: "bio", label: "Описание", type: "textarea" },
      { key: "photo", label: "Фото URL" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "isPublished", label: "Опубликовано", type: "checkbox" },
    ],
  },
  pages: {
    label: "Страницы",
    description: "Статические и SEO-страницы сайта.",
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title", label: "Title", required: true },
      { key: "h1", label: "H1" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "content", label: "Контент", type: "textarea" },
      { key: "isPublished", label: "Опубликовано", type: "checkbox" },
    ],
  },
  faq: {
    label: "FAQ",
    description: "Часто задаваемые вопросы и ответы.",
    fields: [
      { key: "question", label: "Вопрос", type: "textarea", required: true },
      { key: "answer", label: "Ответ", type: "textarea", required: true },
      { key: "category", label: "Категория" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "isPublished", label: "Опубликовано", type: "checkbox" },
    ],
  },
  reviews: {
    label: "Отзывы",
    description: "Отзывы учеников и родителей.",
    fields: [
      { key: "author", label: "Автор", required: true },
      { key: "text", label: "Текст", type: "textarea", required: true },
      { key: "rating", label: "Рейтинг", type: "number" },
      { key: "order", label: "Порядок", type: "number" },
      { key: "isPublished", label: "Опубликовано", type: "checkbox" },
    ],
  },
  blog: {
    label: "Блог",
    description: "Статьи для экспертности и SEO-трафика.",
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title", label: "Заголовок", required: true },
      { key: "excerpt", label: "Краткое описание", type: "textarea" },
      { key: "content", label: "Контент", type: "textarea", required: true },
      { key: "isPublished", label: "Опубликовано", type: "checkbox" },
      { key: "publishedAt", label: "Дата публикации", type: "datetime-local" },
    ],
  },
  leads: {
    label: "Лиды",
    description: "Входящие заявки с сайта.",
    fields: [
      { key: "name", label: "Имя", required: true },
      { key: "contact", label: "Контакт", required: true },
      { key: "message", label: "Сообщение", type: "textarea" },
      { key: "source", label: "Источник" },
      { key: "status", label: "Статус" },
    ],
  },
};

export const resourceModelMap: Record<string, string> = {
  programs: "program",
  teachers: "teacher",
  pages: "page",
  faq: "fAQItem",
  reviews: "review",
  blog: "blogPost",
  leads: "lead",
};
