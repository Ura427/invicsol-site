import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Next.js dev-mode hot reload re-evaluates this module on every edit, which would
// otherwise open a fresh connection pool each time. Caching the client on
// `globalThis` in development (never in production) avoids exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  }
  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = db;
}
