import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useStorage } from '../src/lib/useStorage';
import { nextTick } from 'vue';

describe('useStorage', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    localStorageMock = {};

    const mockStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    };

    vi.stubGlobal('window', { localStorage: mockStorage });
    vi.stubGlobal('localStorage', mockStorage);

    // Silence console.warn for test outputs
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const val = useStorage('test_key', 'default');
    expect(val.value).toBe('default');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test_key', '"default"');
  });

  it('should initialize with value from localStorage if exists', () => {
    localStorageMock['test_key'] = '"stored_value"';
    const val = useStorage('test_key', 'default');
    expect(val.value).toBe('stored_value');
    // Shouldn't overwrite what is already there with default
  });

  it('should update localStorage when the ref value changes', async () => {
    const val = useStorage('test_key', 'default');
    val.value = 'new_value';

    // watch is async in Vue, wait for nextTick
    await nextTick();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('test_key', '"new_value"');
  });

  it('should remove item from localStorage when value is set to null', async () => {
    const val = useStorage('test_key', 'default');
    val.value = null;

    await nextTick();

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('test_key');
  });

  it('should allow storing empty strings', async () => {
    const val = useStorage('test_key', 'default');
    val.value = '';

    await nextTick();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('test_key', '""');
  });

  it('should allow storing 0', async () => {
    const val = useStorage('test_key', 1);
    val.value = 0;

    await nextTick();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('test_key', '0');
  });

  it('should allow storing false', async () => {
    const val = useStorage('test_key', true);
    val.value = false;

    await nextTick();

    expect(window.localStorage.setItem).toHaveBeenCalledWith('test_key', 'false');
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorageMock['test_key'] = 'invalid_json{[';
    const val = useStorage('test_key', 'fallback');

    expect(console.warn).toHaveBeenCalled();
    expect(val.value).toBe('fallback');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('test_key', '"fallback"');
  });

  it('should handle SSR gracefully (window undefined)', () => {
    // Unstub window so it acts like SSR
    vi.unstubAllGlobals();

    // Use an IIFE or function call to ensure window is completely undefined in the execution scope
    // We can just rely on the fact that node context doesn't have window unless we stub it

    const val = useStorage('test_key', 'ssr_default');
    expect(val.value).toBe('ssr_default');

    // Set value and wait
    val.value = 'ssr_update';
    // Shouldn't crash
  });
});
