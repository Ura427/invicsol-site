import { TextEncoder, TextDecoder } from 'node:util';
import '@testing-library/jest-dom';
import { installIntersectionObserverMock } from './src/test-utils/mockIntersectionObserver';
import { installDialogMock } from './src/test-utils/mockDialog';

// jsdom's global scope doesn't include TextEncoder/TextDecoder. Harmless until a
// component test transitively imports a Node package that references them (the
// `pg` driver's SASL auth code does) — then it's an opaque crash in an unrelated
// dependency. Cheap to polyfill globally rather than hit this once per package.
if (typeof globalThis.TextEncoder === 'undefined') {
  Object.assign(globalThis, { TextEncoder, TextDecoder });
}

// jsdom does not implement IntersectionObserver, and several widgets use it for
// scroll-reveal. Installing the mock globally keeps every test file from
// re-declaring it.
installIntersectionObserverMock();

// jsdom also lacks HTMLDialogElement.showModal()/close(), which the callback
// modal relies on for focus trapping and Escape handling.
installDialogMock();
