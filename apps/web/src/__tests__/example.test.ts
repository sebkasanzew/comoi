import { describe, expect, it } from "vitest";

describe("@comoi/web", () => {
  it("should have basic arithmetic working", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have proper environment", () => {
    expect(typeof process).toBe("object");
  });
});

// Note: More comprehensive tests will be added as components are implemented
// E2E tests should use Playwright in the e2e/ directory
