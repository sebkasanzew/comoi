import { describe, expect, it } from "vitest";
import { formatCurrency, formatDistance, isValidVietnamesePhone } from "../utils";

describe("formatCurrency", () => {
  it("formats VND correctly", () => {
    expect(formatCurrency(10000)).toContain("10.000");
    expect(formatCurrency(10000, "VND")).toContain("10.000");
  });

  it("formats USD correctly", () => {
    expect(formatCurrency(10.5, "USD")).toContain("10.50");
  });
});

describe("formatDistance", () => {
  it("formats distances less than 1km in meters", () => {
    expect(formatDistance(0.5)).toBe("500m");
    expect(formatDistance(0.1)).toBe("100m");
  });

  it("formats distances greater than 1km in kilometers", () => {
    expect(formatDistance(1.5)).toBe("1.5km");
    expect(formatDistance(10)).toBe("10.0km");
  });
});

describe("isValidVietnamesePhone", () => {
  it("accepts valid Vietnamese mobile numbers", () => {
    expect(isValidVietnamesePhone("0912345678")).toBe(true);
    expect(isValidVietnamesePhone("0987654321")).toBe(true);
    expect(isValidVietnamesePhone("+84912345678")).toBe(true);
    expect(isValidVietnamesePhone("84912345678")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(isValidVietnamesePhone("123456")).toBe(false);
    expect(isValidVietnamesePhone("0111111111")).toBe(false);
    expect(isValidVietnamesePhone("+1234567890")).toBe(false);
  });
});
