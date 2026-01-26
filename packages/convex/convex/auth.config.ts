import type { AuthConfig } from "convex/server";

/**
 * Clerk Authentication Configuration for Convex
 *
 * This configuration allows Convex to verify JWT tokens issued by Clerk.
 * The CLERK_JWT_ISSUER_DOMAIN environment variable should be set to your
 * Clerk Frontend API URL (e.g., https://<your-instance>.clerk.accounts.dev)
 *
 * Setup:
 * 1. Create a Clerk application at https://clerk.com
 * 2. Copy the Frontend API URL from Clerk Dashboard
 * 3. Add CLERK_JWT_ISSUER_DOMAIN to your Convex environment variables
 *
 * @see https://docs.convex.dev/auth/clerk
 */
export default {
  providers: [
    {
      // Clerk's issuer domain for JWT verification
      // Set CLERK_JWT_ISSUER_DOMAIN in Convex Dashboard environment variables
      domain: (() => {
        const issuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;
        if (!issuerDomain) {
          throw new Error("CLERK_JWT_ISSUER_DOMAIN is not set");
        }
        return issuerDomain;
      })(),
      // Application ID must match what Clerk uses (default: "convex")
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
