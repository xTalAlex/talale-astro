import { test, expect } from "vitest";
import { getConsole, getGameStatuses, getGameTypes } from "@lib/igdb.js";

test("can fetch console from IGDB", async () => {
  const platform = await getConsole("Nintendo Switch 2");
  expect(typeof platform.id).toBe("number"); // 508
});

// test("can fetch game statuses from IGDB", async () => {
//   const statuses = await getGameStatuses();
//   console.log(statuses);
// });

// test("can fetch game types from IGDB", async () => {
//   const types = await getGameTypes();
//   const sortedTypes = types.sort((a, b) => a.id - b.id);
//   console.log(sortedTypes);
// });
