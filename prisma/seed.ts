import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultRobotsTxt, defaultSitemapXml } from "../lib/site-settings";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USER || "admin";
  const password = process.env.ADMIN_PASS || "admin123";

  await prisma.admin.upsert({
    where: { username },
    update: { password: await bcrypt.hash(password, 10) },
    create: {
      username,
      password: await bcrypt.hash(password, 10),
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "Студия Английского",
      siteDescription:
        "Онлайн-центр английского языка с теплой атмосферой и сильной системой обучения.",
      footerText:
        "Студия Английского. Онлайн-центр с современной подачей, экспертной методикой и понятной структурой обучения.",
      robotsTxt: defaultRobotsTxt,
      sitemapXml: defaultSitemapXml,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
