import '@testing-library/jest-dom';
import { installIntersectionObserverMock } from './src/test-utils/mockIntersectionObserver';
import { installDialogMock } from './src/test-utils/mockDialog';

// jsdom does not implement IntersectionObserver, and several widgets use it for
// scroll-reveal. Installing the mock globally keeps every test file from
// re-declaring it.
installIntersectionObserverMock();

// jsdom also lacks HTMLDialogElement.showModal()/close(), which the callback
// modal relies on for focus trapping and Escape handling.
installDialogMock();
