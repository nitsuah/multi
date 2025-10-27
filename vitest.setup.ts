// vitest.setup.ts
import { vi } from 'vitest';

// Mock Spline for all tests
vi.mock('@splinetool/react-spline', () => ({
  __esModule: true,
  default: () => null,
}));
