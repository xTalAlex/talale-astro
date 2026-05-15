import { expect, test, describe } from "vitest";
import { audioUtils } from "@src/lib/audioUtils";

describe("audioUtils.autoCorrelate", () => {
  const sampleRate = 44100;

  test("returns -1 for silent buffer", () => {
    const buffer = new Float32Array(1024).fill(0);
    expect(audioUtils.autoCorrelate(buffer, sampleRate)).toBe(-1);
  });

  test("returns -1 for near-silent buffer", () => {
    const buffer = new Float32Array(1024).fill(0.005);
    expect(audioUtils.autoCorrelate(buffer, sampleRate)).toBe(-1);
  });

  test("returns -1 for empty buffer", () => {
    const buffer = new Float32Array(0);
    expect(audioUtils.autoCorrelate(buffer, sampleRate)).toBe(-1);
  });

  test("detects frequency of a sine wave", () => {
    const freq = 440;
    const size = 2048;
    const buffer = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      buffer[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate);
    }
    const result = audioUtils.autoCorrelate(buffer, sampleRate);
    expect(result).toBeGreaterThan(439);
    expect(result).toBeLessThan(441);
  });
});

describe("audioUtils.noteFromPitch", () => {
    test("returns correct note for 440Hz", () => {
        expect(audioUtils.noteFromPitch(440)).toBe(69); // A4
    });
});

describe("audioUtils.pitchIsSimilarTo", () => {
    test("returns true for similar pitches", () => {
        expect(audioUtils.pitchIsSimilarTo(440, 442, 5)).toBe(true);
    });

    test("returns false for different pitches", () => {
        expect(audioUtils.pitchIsSimilarTo(440, 450, 5)).toBe(false);
    });
});
