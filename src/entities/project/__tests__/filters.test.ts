import { parseProjectFilters, toPrismaWhere } from '../filters';

describe('parseProjectFilters', () => {
  it('reads all three recognized params', () => {
    expect(
      parseProjectFilters({ type: 'house', usage: 'green-tariff', kw: '10-20' }),
    ).toEqual({ type: 'house', usage: 'green-tariff', capacity: '10-20' });
  });

  it('defaults missing params to null', () => {
    expect(parseProjectFilters({})).toEqual({ type: null, usage: null, capacity: null });
  });

  it('treats an unrecognized value as no filter instead of throwing', () => {
    expect(parseProjectFilters({ type: 'spaceship' })).toEqual({
      type: null,
      usage: null,
      capacity: null,
    });
  });

  it('takes the first value when a param repeats', () => {
    expect(parseProjectFilters({ type: ['house', 'business'] })).toEqual({
      type: 'house',
      usage: null,
      capacity: null,
    });
  });
});

describe('toPrismaWhere', () => {
  it('produces an empty where clause for no filters', () => {
    expect(toPrismaWhere({ type: null, usage: null, capacity: null })).toEqual({});
  });

  it('maps type and usage directly', () => {
    expect(toPrismaWhere({ type: 'business', usage: 'self', capacity: null })).toEqual({
      objectType: 'business',
      usage: 'self',
    });
  });

  it('maps the 0-10 band to a strict upper bound', () => {
    expect(toPrismaWhere({ type: null, usage: null, capacity: '0-10' })).toEqual({
      capacityKw: { lt: 10 },
    });
  });

  it('maps the 10-20 band to an inclusive lower / exclusive upper bound', () => {
    expect(toPrismaWhere({ type: null, usage: null, capacity: '10-20' })).toEqual({
      capacityKw: { gte: 10, lt: 20 },
    });
  });

  it('maps the 20+ band to an open-ended lower bound', () => {
    expect(toPrismaWhere({ type: null, usage: null, capacity: '20+' })).toEqual({
      capacityKw: { gte: 20 },
    });
  });
});
