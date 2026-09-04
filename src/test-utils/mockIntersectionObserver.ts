/**
 * jsdom doesn't implement IntersectionObserver. Widgets that use it for
 * scroll-reveal need a global mock so their tests can render without crashing.
 * Installed once in jest.setup.ts rather than redeclared per test file.
 */
export function installIntersectionObserverMock(): void {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: readonly number[] = [];

    constructor(
      private callback: IntersectionObserverCallback,
      private options?: IntersectionObserverInit,
    ) {}

    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = (): IntersectionObserverEntry[] => [];
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}
