import { spawn } from "node:child_process";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      env: process.env,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function start() {
  await run("npx", ["prisma", "db", "push"]);
  await run("npx", ["prisma", "db", "seed"]);
  await run("npx", ["next", "start", "-H", "0.0.0.0", "-p", process.env.PORT || "3000"]);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
