import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  noStore();

  return prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Студия Английского",
      siteDescription:
        "Онлайн-центр английского языка с теплой подачей и сильной методикой.",
      footerText:
        "Студия Английского. Бережный онлайн-центр английского языка с современной методикой, понятной системой обучения и теплой атмосферой.",
    },
  });
}
