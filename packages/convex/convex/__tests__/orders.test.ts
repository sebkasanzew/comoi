import { describe, expect, it } from "vitest";
import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import * as ordersModule from "../orders";

type Identity = { subject: string };

type EqBuilder = { eq: (field: string, value: unknown) => EqBuilder };

type UserDoc = {
  clerk_id: string;
  role: "vendor" | "customer" | "admin";
  phone?: string;
};

type VendorDoc = { _id: Id<"vendors">; phone: string };

type CustomerDoc = { _id: Id<"customers">; phone: string };

type OrderDoc = {
  _id: Id<"orders">;
  vendor_id: Id<"vendors">;
  customer_id: Id<"customers">;
};

type OrderStatusRow = { status: "PENDING" | "COMPLETED" };

type QueryResult<T> = {
  withIndex: (
    index: string,
    fn: (q: EqBuilder) => unknown
  ) => {
    unique: () => Promise<T | null>;
    collect: () => Promise<T[]>;
  };
  collect: () => Promise<T[]>;
};

type Db = {
  query: (table: string) => QueryResult<unknown>;
  get: (id: unknown) => Promise<unknown | null>;
  patch: (id: unknown, value: unknown) => Promise<void>;
  insert: (table: string, value: unknown) => Promise<string>;
};

type Auth = {
  getUserIdentity: () => Promise<Identity | null>;
};

type TestCtx = {
  db: Db;
  auth: Auth;
};

type CtxOverrides = {
  db?: Partial<Db>;
  auth?: Partial<Auth>;
};

const emptyQuery = <T>(): QueryResult<T> => ({
  withIndex: (_index: string, _fn: (q: EqBuilder) => unknown) => ({
    unique: async () => null,
    collect: async () => [],
  }),
  collect: async () => [],
});

const usersQuery = (user: UserDoc | null): QueryResult<UserDoc> => ({
  withIndex: (_index: string, _fn: (q: EqBuilder) => unknown) => ({
    unique: async () => user,
    collect: async () => [],
  }),
  collect: async () => [],
});

const ordersQuery = (rows: OrderStatusRow[]): QueryResult<OrderStatusRow> => ({
  withIndex: (_index: string, _fn: (q: EqBuilder) => unknown) => ({
    unique: async () => null,
    collect: async () => rows,
  }),
  collect: async () => rows,
});

const asQueryCtx = (ctx: TestCtx): QueryCtx => ctx as unknown as QueryCtx;

// Minimal helpers to create a fake Convex ctx for the handlers
function makeCtx(overrides: CtxOverrides = {}): TestCtx {
  const defaultDb: Db = {
    query: (_table: string) => emptyQuery<unknown>(),
    get: async (_id: unknown) => null,
    patch: async () => {
      // no-op test stub
    },
    insert: async () => "id",
  };

  const defaultAuth: Auth = {
    getUserIdentity: async () => null,
  };

  return {
    db: { ...defaultDb, ...(overrides.db ?? {}) },
    auth: { ...defaultAuth, ...(overrides.auth ?? {}) },
  };
}

describe("orders authorization", () => {
  it("allows vendor with matching phone to getCountsByStatus", async () => {
    const vendorId = "vendor-1" as Id<"vendors">;
    const ctx = makeCtx({
      auth: { getUserIdentity: async () => ({ subject: "clerk-vendor" }) },
      db: {
        query: (table: string) => {
          if (table === "users") {
            return usersQuery({ clerk_id: "clerk-vendor", role: "vendor", phone: "091" });
          }
          if (table === "orders") {
            return ordersQuery([
              { status: "PENDING" },
              { status: "COMPLETED" },
              { status: "PENDING" },
            ]);
          }
          return emptyQuery();
        },
        get: async (id: unknown) =>
          id === vendorId ? ({ _id: vendorId, phone: "091" } satisfies VendorDoc) : null,
      },
    });

    // Authorization should succeed for the vendor owner
    await expect(
      ordersModule.requireVendorAccess(asQueryCtx(ctx), vendorId)
    ).resolves.not.toThrow();
  });

  it("rejects unauthenticated requests to getCountsByStatus", async () => {
    const ctx = makeCtx({ auth: { getUserIdentity: async () => null } });
    await expect(
      ordersModule.requireVendorAccess(asQueryCtx(ctx), "v" as Id<"vendors">)
    ).rejects.toThrow("Unauthorized");
  });

  it("forbids a different user from getting counts", async () => {
    const vendorId = "vendor-1" as Id<"vendors">;
    const ctx = makeCtx({
      auth: { getUserIdentity: async () => ({ subject: "clerk-other" }) },
      db: {
        query: (table: string) => {
          if (table === "users") {
            return usersQuery({ clerk_id: "clerk-other", role: "vendor", phone: "000" });
          }
          return emptyQuery();
        },
        get: async (id: unknown) =>
          id === vendorId ? ({ _id: vendorId, phone: "091" } satisfies VendorDoc) : null,
      },
    });

    await expect(ordersModule.requireVendorAccess(asQueryCtx(ctx), vendorId)).rejects.toThrow(
      "Forbidden"
    );
  });

  it("forbids unrelated user from fetching a single order", async () => {
    const orderId = "order-1" as Id<"orders">;
    const vendorId = "vendor-1" as Id<"vendors">;
    const customerId = "customer-1" as Id<"customers">;
    const ctx = makeCtx({
      auth: { getUserIdentity: async () => ({ subject: "clerk-other" }) },
      db: {
        get: async (id: unknown) => {
          if (id === orderId) {
            return {
              _id: orderId,
              vendor_id: vendorId,
              customer_id: customerId,
            } satisfies OrderDoc;
          }
          if (id === vendorId) return { _id: vendorId, phone: "091" } satisfies VendorDoc;
          return null;
        },
        query: (table: string) => {
          if (table === "users") {
            return usersQuery({ clerk_id: "clerk-other", role: "vendor", phone: "000" });
          }
          if (table === "order_items") {
            return emptyQuery();
          }
          return emptyQuery();
        },
      },
    });

    await expect(
      ordersModule.requireOrderAccess(asQueryCtx(ctx), {
        vendor_id: vendorId,
        customer_id: customerId,
      })
    ).rejects.toThrow(/Forbidden|Unauthorized/);
  });

  it("allows the customer who placed the order to fetch it", async () => {
    const orderId = "order-2" as Id<"orders">;
    const vendorId = "vendor-1" as Id<"vendors">;
    const customerId = "customer-1" as Id<"customers">;
    const ctx = makeCtx({
      auth: { getUserIdentity: async () => ({ subject: "clerk-customer" }) },
      db: {
        get: async (id: unknown) => {
          if (id === orderId) {
            return {
              _id: orderId,
              vendor_id: vendorId,
              customer_id: customerId,
            } satisfies OrderDoc;
          }
          if (id === customerId) return { _id: customerId, phone: "091" } satisfies CustomerDoc;
          if (id === vendorId) return { _id: vendorId, phone: "091" } satisfies VendorDoc;
          return null;
        },
        query: (table: string) => {
          if (table === "users") {
            return usersQuery({
              clerk_id: "clerk-customer",
              role: "customer",
              phone: "091",
            });
          }
          if (table === "order_items") {
            return emptyQuery();
          }
          return emptyQuery();
        },
      },
    });

    await expect(
      ordersModule.requireOrderAccess(asQueryCtx(ctx), {
        vendor_id: vendorId,
        customer_id: customerId,
      })
    ).resolves.not.toThrow();
  });
});
