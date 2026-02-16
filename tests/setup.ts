import '@testing-library/jest-dom';

// ResizeObserver is used by Recharts ResponsiveContainer but not available in jsdom
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
