import { isRateLimited } from '../rateLimit';

describe('isRateLimited', () => {
  it('allows requests under the limit', () => {
    const key = 'ip-a';
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key, now + i)).toBe(false);
    }
  });

  it('blocks the 6th request within the window', () => {
    const key = 'ip-b';
    const now = 2_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited(key, now + i);
    }
    expect(isRateLimited(key, now + 5)).toBe(true);
  });

  it('allows requests again once the window has passed', () => {
    const key = 'ip-c';
    const start = 3_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited(key, start + i);
    }
    expect(isRateLimited(key, start + 5)).toBe(true);
    expect(isRateLimited(key, start + 70_000)).toBe(false);
  });

  it('tracks separate keys independently', () => {
    const now = 4_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited('ip-d', now + i);
    }
    expect(isRateLimited('ip-d', now + 5)).toBe(true);
    expect(isRateLimited('ip-e', now + 5)).toBe(false);
  });
});
