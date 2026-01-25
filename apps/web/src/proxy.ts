import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Clerk Proxy for Next.js
 *
 * Protects routes based on authentication status.
 * Public routes are accessible without authentication.
 * Protected routes require the user to be signed in.
 */

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/orders(.*)",
  "/profile(.*)",
  "/vendor/dashboard(.*)",
  "/vendor/orders(.*)",
  "/vendor/products(.*)",
  "/vendor/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
