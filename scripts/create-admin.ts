/**
 * Seeds (or resets the password of) the single admin account. There is no
 * public signup route anywhere in the app — this script is the only way an
 * Admin row is ever created, and it's meant to be run once, by hand, by the
 * site owner:
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... npm run admin:create
 *
 * or by setting ADMIN_EMAIL/ADMIN_PASSWORD in .env first and running
 * `npm run admin:create` with no inline vars. Running it again with the same
 * email updates that account's password rather than creating a second one.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { allowedAdminEmails, isAllowedAdminEmail } from '../src/shared/lib/admin-allowlist';

const MIN_PASSWORD_LENGTH = 12;

async function main() {
  const email = process.env['ADMIN_EMAIL'];
  const password = process.env['ADMIN_PASSWORD'];

  if (!email || !password) {
    console.error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD (in .env, or inline before this command) and try again.',
    );
    process.exit(1);
  }

  // Refuse up front rather than seeding a row that could never sign in: /admin
  // is restricted to the allowlist, so an Admin row for any other address is a
  // dead account whose only effect is to confuse whoever created it.
  if (!isAllowedAdminEmail(email)) {
    console.error(`${email} is not permitted to use the admin panel.`);
    console.error(`Allowed: ${allowedAdminEmails().join(', ') || '(none — ADMIN_ALLOWED_EMAILS is empty)'}`);
    console.error('Add the address to ADMIN_ALLOWED_EMAILS, or to src/shared/lib/admin-allowlist.ts.');
    process.exit(1);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exit(1);
  }

  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  const adapter = new PrismaPg(connectionString);
  const prisma = new PrismaClient({ adapter });

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin account ready: ${admin.email}`);
  console.log('Log in at /admin/login.');
  console.log('Consider removing ADMIN_PASSWORD from .env now that the account exists.');

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
