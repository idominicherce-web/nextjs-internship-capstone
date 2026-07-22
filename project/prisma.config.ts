// prisma.config.ts
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Force Prisma to load environment variables directly from .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});