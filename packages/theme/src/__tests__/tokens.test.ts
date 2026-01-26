import { describe, expect, it } from "vitest";
import { primitives, semanticColors } from "../colors";
import { spacing, spacingPx } from "../spacing";
import { fontSizes, fontWeights } from "../typography";

describe("Design Tokens", () => {
  describe("Colors", () => {
    it("should export primitive colors", () => {
      expect(primitives.green[500]).toBeDefined();
      expect(primitives.neutral[900]).toBeDefined();
    });

    it("should export semantic colors with light and dark modes", () => {
      expect(semanticColors.light.primary).toBeDefined();
      expect(semanticColors.dark.primary).toBeDefined();
      expect(semanticColors.light.background).toBeDefined();
      expect(semanticColors.dark.background).toBeDefined();
    });
  });

  describe("Spacing", () => {
    it("should export spacing scale in rem", () => {
      expect(spacing[4]).toBe("1rem");
      expect(spacing[8]).toBe("2rem");
    });

    it("should export spacing scale in px", () => {
      expect(spacingPx[4]).toBe(16);
      expect(spacingPx[8]).toBe(32);
    });
  });

  describe("Typography", () => {
    it("should export font sizes", () => {
      expect(fontSizes.base).toBeDefined();
      expect(fontSizes.lg).toBeDefined();
    });

    it("should export font weights", () => {
      expect(fontWeights.normal).toBe("400");
      expect(fontWeights.bold).toBe("700");
    });
  });
});
