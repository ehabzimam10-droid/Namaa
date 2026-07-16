import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Advanced chained Supabase builder mock supporting all query features
const mockSupabaseBuilder = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return Promise.resolve({ data: [], error: null }).then(onfulfilled, onrejected);
  }
};

// Mock Supabase JS library globally
vi.mock('@supabase/supabase-js', () => {
  const mockFrom = vi.fn().mockReturnValue(mockSupabaseBuilder);

  return {
    createClient: vi.fn().mockReturnValue({
      from: mockFrom,
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ data: { user: {} }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    }),
  };
});

// Mock HTMLCanvasElement context
const mockContext2D = {
  fillRect: vi.fn(),
  ellipse: vi.fn(),
  beginPath: vi.fn(),
  lineTo: vi.fn(),
  moveTo: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  rect: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  closePath: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  createLinearGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
  createRadialGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
  measureText: vi.fn().mockReturnValue({ width: 10, height: 10 }),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  font: '',
  textAlign: 'left',
  textBaseline: 'top',
};

// Override getContext on HTMLCanvasElement prototype
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId) => {
  if (contextId === '2d') {
    return mockContext2D;
  }
  return null;
}) as any;

// Mock requestAnimationFrame and cancelAnimationFrame
window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  return window.setTimeout(() => callback(performance.now()), 16);
});
window.cancelAnimationFrame = vi.fn((id: number) => {
  window.clearTimeout(id);
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Global beforeEach to clear storage and set a default profile to mimic user authentication
beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.setItem('namaa_profile', JSON.stringify({
    id: 'father_id_123',
    name: 'أبو خالد',
    role: 'father',
    family_castle_level: 3
  }));
});
