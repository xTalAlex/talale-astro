import { assert, expect, test } from "vitest";
import * as Utils from "@lib/utils";

test("date is formatted", () => {
  expect(Utils.formatDate("2024-03-05T18:27:37.043Z", "short")).toBe(
    "5/3/2024",
  );
  expect(Utils.formatDate("2024-03-05T18:27:37.043Z", "long")).toBe(
    "5 mar 2024",
  );
  expect(Utils.formatDate("2024-03-05T18:27:37.043Z", "longest")).toBe(
    "mar 5 mar 2024",
  );
});

test("adjacent cells calculated", () => {
  expect(Utils.adjacentCells(1, 1, 5, 5).length).toBe(8);
  expect(Utils.adjacentCells(0, 0, 5, 5).length).toBe(3);
  expect(Utils.adjacentCells(4, 4, 5, 5).length).toBe(3);
});

test("strings are trimmed", () => {
  expect(Utils.toTrimmedAlphanumeric("ciao3-é soCos")).toBe("ciao3 soCos");
});

test("strings are slugified", () => {
  expect(Utils.slugify("ciao3-é soCos")).toBe("ciao3-e-socos");
});
