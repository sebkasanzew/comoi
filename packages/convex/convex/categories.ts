import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get all categories ordered by display order
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories.sort((a, b) => a.order - b.order);
  },
});

/**
 * Get a single category by slug
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});
