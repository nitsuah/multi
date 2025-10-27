import { vi } from 'vitest';

// Mock Spline for all tests
vi.mock('@splinetool/react-spline', () => ({
  __esModule: true,
  default: () => null,
}));

// Polyfill ResizeObserver for React Three Fiber tests
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
