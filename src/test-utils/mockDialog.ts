/**
 * jsdom implements the <dialog> element but not showModal()/close(), so any
 * component built on native dialog semantics throws in tests. This installs a
 * minimal implementation that tracks the `open` attribute and fires the `close`
 * event, which is enough to assert open/closed state and Escape handling.
 *
 * Installed globally in jest.setup.ts, alongside the IntersectionObserver mock,
 * so individual test files don't each re-declare it.
 */
export function installDialogMock(): void {
  if (typeof HTMLDialogElement === 'undefined') return;

  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement, returnValue?: string) {
    this.open = false;
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.dispatchEvent(new Event('close'));
  };
}
