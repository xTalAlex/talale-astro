import { describe, it, expect } from "vitest";
import { getAllCharacters } from "../src/lib/disney.js";

describe("Disney API Tests", () => {
  it("should fetch Disney characters page", async () => {
    const response = await getAllCharacters();

    expect(response).toBeDefined();
  });
});
