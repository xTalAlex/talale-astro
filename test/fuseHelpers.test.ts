import { expect, test, describe } from "vitest";
import { getBestMatch, highlightMatch, searchOptions } from "@src/lib/fuseHelpers";

describe("getBestMatch", () => {
  test("returns the longest index from the first match", () => {
    const matches = [
      {
        indices: [
          [0, 2], // length 2
          [5, 10], // length 5
          [15, 17], // length 2
        ],
      },
    ];
    expect(getBestMatch(matches)).toEqual([5, 10]);
  });

  test("returns the first longest index when there are multiple", () => {
    const matches = [
      {
        indices: [
          [0, 5],
          [10, 15],
        ],
      },
    ];
    expect(getBestMatch(matches)).toEqual([0, 5]);
  });

  test("returns undefined for empty matches", () => {
    expect(getBestMatch([])).toBeUndefined();
  });

  test("returns undefined if no indices in first match", () => {
    expect(getBestMatch([{}])).toBeUndefined();
  });
});

describe("highlightMatch", () => {
  test("returns array with text and range if match is provided", () => {
    const text = "Hello World";
    const match = [0, 5];
    expect(highlightMatch(text, match)).toEqual(["Hello World", 0, 5]);
  });

  test("returns original text if match is undefined", () => {
    const text = "Hello World";
    expect(highlightMatch(text, undefined)).toBe("Hello World");
  });
});

describe("searchOptions", () => {
  test("has expected properties", () => {
    expect(searchOptions.includeScore).toBe(true);
    expect(searchOptions.includeMatches).toBe(true);
    expect(searchOptions.keys).toContainEqual({ name: "name", weight: 4 });
  });
});
