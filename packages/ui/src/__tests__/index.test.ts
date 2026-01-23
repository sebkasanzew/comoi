import { describe, expect, it } from "vitest";
import { VERSION } from "../index";

describe("@comoi/ui", () => {
  it("should export VERSION constant", () => {
    expect(VERSION).toBe("0.0.0");
  });

  it("VERSION should be a string", () => {
    expect(typeof VERSION).toBe("string");
  });
});
