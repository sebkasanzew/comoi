import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get all active vendors
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_active", (q) => q.eq("is_active", true))
      .collect();

    if (limit) {
      return vendors.slice(0, limit);
    }

    return vendors;
  },
});

/**
 * Get a single vendor by ID
 */
export const get = query({
  args: { id: v.id("vendors") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

/**
 * Get vendor with their products and prices
 */
export const getWithProducts = query({
  args: { id: v.id("vendors") },
  handler: async (ctx, { id }) => {
    const vendor = await ctx.db.get(id);
    if (!vendor) return null;

    const priceOffers = await ctx.db
      .query("price_offers")
      .withIndex("by_vendor", (q) => q.eq("vendor_id", id).eq("is_available", true))
      .collect();

    // Get product details for each price offer
    const productsWithPrices = await Promise.all(
      priceOffers.map(async (offer) => {
        const product = await ctx.db.get(offer.product_id);
        if (!product) return null;

        const category = await ctx.db.get(product.category_id);

        return {
          ...product,
          category,
          price: offer.price,
          stock_status: offer.stock_status,
          offer_id: offer._id,
        };
      })
    );

    return {
      ...vendor,
      products: productsWithPrices.filter(Boolean),
    };
  },
});

/**
 * Search vendors by name
 */
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm.trim()) {
      return [];
    }

    const results = await ctx.db
      .query("vendors")
      .withSearchIndex("search_name", (q) => q.search("name", searchTerm).eq("is_active", true))
      .take(10);

    return results;
  },
});
