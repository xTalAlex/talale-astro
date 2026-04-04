/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Global browser APIs extended by third-party scripts
interface Window {
  gtag?: (...args: unknown[]) => void;
  notify?: (message: string, data: unknown, type: string) => void;
  Tawk_API?: Record<string, unknown>;
  Tawk_LoadStart?: Date;
  webkitAudioContext?: typeof AudioContext;
}
