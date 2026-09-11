import { submitReview } from '../actions';
import { db } from '@/shared/lib/db';

jest.mock('next/headers', () => ({
  headers: async () => new Map([['x-forwarded-for', '203.0.113.9']]),
}));

jest.mock('@/shared/lib/db', () => ({
  db: {
    station: { findUnique: jest.fn() },
    review: { create: jest.fn() },
  },
}));

const findUnique = db.station.findUnique as unknown as jest.Mock;
const create = db.review.create as unknown as jest.Mock;

const good = {
  stationId: 's1',
  authorName: 'Олена',
  rating: 5,
  text: 'Станція працює бездоганно вже пів року.',
  locale: 'uk',
  website: '',
};

describe('submitReview', () => {
  beforeEach(() => {
    findUnique.mockReset();
    create.mockReset();
    findUnique.mockResolvedValue({ id: 's1' });
  });

  it('writes a pending review for a good submission', async () => {
    await expect(submitReview(good)).resolves.toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'pending', rating: 5 }) }),
    );
  });

  // The whole point of the honeypot: a bot that fills every field never
  // touches the database.
  it('drops a honeypot hit without writing', async () => {
    await expect(submitReview({ ...good, website: 'http://spam' })).resolves.toEqual({
      ok: false,
      error: 'spam',
    });
    expect(create).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('rejects an invalid submission without writing', async () => {
    await expect(submitReview({ ...good, rating: 9 })).resolves.toEqual({
      ok: false,
      error: 'invalid',
    });
    expect(create).not.toHaveBeenCalled();
  });

  it('goes nowhere for an unknown station', async () => {
    findUnique.mockResolvedValue(null);
    await expect(submitReview(good)).resolves.toEqual({ ok: false, error: 'invalid' });
    expect(create).not.toHaveBeenCalled();
  });
});
