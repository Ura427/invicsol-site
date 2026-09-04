import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Next.js dev-mode hot reload re-evaluates this module on every edit, which would
// otherwise open a fresh SQLite connection each time. Caching the client on
// `globalThis` in development (never in production) avoids exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env['DATABASE_URL'] ?? 'file:./dev.db',
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = db;
}
