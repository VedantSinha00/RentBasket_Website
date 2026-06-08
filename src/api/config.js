/**
 * API configuration — the SINGLE source of truth for base URLs and keys.
 *
 * Every module under src/api/ imports from here instead of reading
 * import.meta.env directly. This is the one seam that the planned key-handling
 * change touches: under the proxy model (Option A) API_BASE is repointed at the
 * proxy and the inline keys are removed; under the publishable-key model
 * (Option B) only the read-only CATALOG key stays. See docs/security-plan.md.
 */

// Raw configured API base (unset → mock catalog). Kept separate from API_BASE
// because USING_MOCK_DATA must reflect the *configured* value, not the dev "/api".
const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL?.trim();

/** True when no API base URL is configured — the app falls back to mock data. */
export const USING_MOCK_DATA = !RAW_API_BASE;

// In dev the Vite proxy forwards /api/* to the real server (avoids CORS).
// In production the full configured URL is used directly.
export const API_BASE = import.meta.env.DEV ? "/api" : RAW_API_BASE;

// JWT minting (/get-jwt-token) and KYC upload (/update-kyc) live on testaws.
export const AWS_BASE = "https://testaws.rentbasket.com";

// App key for /get-jwt-token (Bearer-JWT auth for most endpoints).
export const APP_KEY = import.meta.env.VITE_API_APP_KEY?.trim();

// Static key for the bulk catalog endpoint — uses the Authorization-Key header
// instead of the Bearer JWT used by all other endpoints.
export const CATALOG_API_KEY = import.meta.env.VITE_CATALOG_API_KEY?.trim();
