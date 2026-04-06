import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaPool: Pool | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

const pool =
  databaseUrl && (global.prismaPool ?? new Pool({ connectionString: databaseUrl, max: 5 }));

const adapter = pool ? new PrismaPg(pool) : undefined;

export const prisma =
  databaseUrl && adapter
    ? global.prisma ??
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      })
    : null;

if (process.env.NODE_ENV !== "production" && prisma && pool) {
  global.prisma = prisma;
  global.prismaPool = pool;
}
