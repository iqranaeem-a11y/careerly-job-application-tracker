import app from "./app";
import { env } from "./config/env";
import { prisma } from "./utils/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`Job tracker API listening on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received; shutting down`);
  server.close(() => {
    void prisma.$disconnect().then(() => process.exit(0));
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
