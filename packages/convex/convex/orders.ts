import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

const requireVendorAccess = async (ctx: QueryCtx | MutationCtx, vendorId: Id<"vendors">) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    return;
  }

  if (user.role !== "vendor") {
    throw new Error("Forbidden");
  }

  const vendor = await ctx.db.get(vendorId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (!user.phone || vendor.phone !== user.phone) {
    throw new Error("Forbidden");
  }
};

const requireOrderAccess = async (
  ctx: QueryCtx | MutationCtx,
  order: { customer_id: Id<"customers">; vendor_id: Id<"vendors"> }
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
    .unique();

  if (!user) throw new Error("User not found");
  if (user.role === "admin") return;

  // Vendor owners can access their orders
  if (user.role === "vendor") {
    const vendor = await ctx.db.get(order.vendor_id);
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.phone === user.phone) return;
    throw new Error("Forbidden");
  }

  // Customers can access their own orders (match by phone)
  if (user.role === "customer") {
    const customer = await ctx.db.get(order.customer_id);
    if (!customer) throw new Error("Customer not found");
    if (customer.phone === user.phone) return;
    throw new Error("Forbidden");
  }

  throw new Error("Forbidden");
};

export { requireVendorAccess, requireOrderAccess };

/**
 * Get orders for a vendor filtered by status
 */
export const listByVendor = query({
  args: {
    vendorId: v.id("vendors"),
    status: v.optional(
      v.union(
        v.literal("PENDING"),
        v.literal("CONFIRMED"),
        v.literal("PREPARING"),
        v.literal("READY"),
        v.literal("DELIVERING"),
        v.literal("COMPLETED"),
        v.literal("CANCELLED")
      )
    ),
  },
  handler: async (ctx, { vendorId, status }) => {
    await requireVendorAccess(ctx, vendorId);

    const ordersQuery = ctx.db
      .query("orders")
      .withIndex("by_vendor", (q) =>
        status ? q.eq("vendor_id", vendorId).eq("status", status) : q.eq("vendor_id", vendorId)
      );

    const orders = await ordersQuery.collect();

    // Get order items and customer details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("order_items")
          .withIndex("by_order", (q) => q.eq("order_id", order._id))
          .collect();

        // Get product details for each item
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const product = await ctx.db.get(item.product_id);
            return {
              ...item,
              product: product
                ? {
                    name_vi: product.name_vi,
                    name_en: product.name_en,
                    unit: product.unit,
                  }
                : null,
            };
          })
        );

        const customer = await ctx.db.get(order.customer_id);

        return {
          ...order,
          items: itemsWithProducts,
          customer: customer
            ? {
                name: customer.name,
                phone: customer.phone,
              }
            : null,
        };
      })
    );

    // Sort by created_at descending (newest first)
    ordersWithDetails.sort((a, b) => b.created_at - a.created_at);

    return ordersWithDetails;
  },
});

/**
 * Get a single order with full details
 */
export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    const order = await ctx.db.get(id);
    if (!order) return null;

    await requireOrderAccess(ctx, { customer_id: order.customer_id, vendor_id: order.vendor_id });

    const items = await ctx.db
      .query("order_items")
      .withIndex("by_order", (q) => q.eq("order_id", id))
      .collect();

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await ctx.db.get(item.product_id);
        return {
          ...item,
          product,
        };
      })
    );

    const customer = await ctx.db.get(order.customer_id);
    const vendor = await ctx.db.get(order.vendor_id);

    return {
      ...order,
      items: itemsWithProducts,
      customer,
      vendor,
    };
  },
});

/**
 * Update order status (for vendors)
 */
export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("PREPARING"),
      v.literal("READY"),
      v.literal("DELIVERING"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
  },
  handler: async (ctx, { orderId, status }) => {
    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    await requireVendorAccess(ctx, order.vendor_id);

    await ctx.db.patch(orderId, {
      status,
      updated_at: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get order counts by status for a vendor
 */
export const getCountsByStatus = query({
  args: { vendorId: v.id("vendors") },
  handler: async (ctx, { vendorId }) => {
    await requireVendorAccess(ctx, vendorId);

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_vendor", (q) => q.eq("vendor_id", vendorId))
      .collect();

    const counts = {
      PENDING: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      READY: 0,
      DELIVERING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    for (const order of orders) {
      counts[order.status]++;
    }

    return counts;
  },
});
