import { httpRouter } from "convex/server";

/**
 * Convex HTTP Router
 *
 * Handles:
 * - Future: Clerk webhooks for user sync
 * - Future: Payment webhooks
 *
 * Note: Clerk authentication is handled by Clerk's hosted service.
 * User data can be synced via Clerk webhooks.
 */
const http = httpRouter();

// TODO: Add Clerk webhook endpoint for user sync
// http.route({
//   path: "/webhooks/clerk",
//   method: "POST",
//   handler: clerkWebhookHandler,
// });

export default http;
