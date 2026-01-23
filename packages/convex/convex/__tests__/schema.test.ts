import { describe, expect, it } from "vitest";
import schema from "../schema";

describe("@comoi/convex schema", () => {
  it("should define vendors table", () => {
    expect(schema.tables).toBeDefined();
    expect(schema.tables.vendors).toBeDefined();
  });

  it("should define products table", () => {
    expect(schema.tables.products).toBeDefined();
  });

  it("should define orders table", () => {
    expect(schema.tables.orders).toBeDefined();
  });

  it("should define order_items table", () => {
    expect(schema.tables.order_items).toBeDefined();
  });

  it("should define customers table", () => {
    expect(schema.tables.customers).toBeDefined();
  });

  it("should define categories table", () => {
    expect(schema.tables.categories).toBeDefined();
  });

  it("should define price_offers table", () => {
    expect(schema.tables.price_offers).toBeDefined();
  });
});
