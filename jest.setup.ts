import '@testing-library/jest-dom';
import { installIntersectionObserverMock } from './src/test-utils/mockIntersectionObserver';

// jsdom does not implement IntersectionObserver, and several widgets use it for
// scroll-reveal. Installing the mock globally keeps every test file from
// re-declaring it.
installIntersectionObserverMock();
