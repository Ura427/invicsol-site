import { authorizeAdmin } from '../admin-credentials';
import { db } from '../db';
import bcrypt from 'bcryptjs';

jest.mock('../db', () => ({
  db: { admin: { findUnique: jest.fn() } },
}));

const findUnique = db.admin.findUnique as unknown as jest.Mock;

const ownerRow = {
  id: 'admin-1',
  email: 'urakost427@gmail.com',
  passwordHash: bcrypt.hashSync('correct-horse-battery', 4),
};

describe('authorizeAdmin', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('returns the account for the owner with the right password', async () => {
    findUnique.mockResolvedValue(ownerRow);

    await expect(
      authorizeAdmin({ email: 'urakost427@gmail.com', password: 'correct-horse-battery' }),
    ).resolves.toEqual({ id: 'admin-1', email: 'urakost427@gmail.com' });
  });

  it('refuses the owner with the wrong password', async () => {
    findUnique.mockResolvedValue(ownerRow);

    await expect(
      authorizeAdmin({ email: 'urakost427@gmail.com', password: 'wrong' }),
    ).resolves.toBeNull();
  });

  // The point of the allowlist: a second Admin row with a perfectly valid
  // password is still refused, and is refused without the database being asked
  // about it at all.
  it('refuses another account even when its password is correct', async () => {
    findUnique.mockResolvedValue({
      id: 'admin-2',
      email: 'intruder@example.com',
      passwordHash: bcrypt.hashSync('also-correct', 4),
    });

    await expect(
      authorizeAdmin({ email: 'intruder@example.com', password: 'also-correct' }),
    ).resolves.toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('refuses malformed credentials', async () => {
    await expect(authorizeAdmin(undefined)).resolves.toBeNull();
    await expect(authorizeAdmin({ email: 123, password: [] })).resolves.toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });
});
