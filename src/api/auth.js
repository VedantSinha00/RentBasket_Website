/**
 * API auth — fetches and caches the bearer token for all API calls.
 * Token is held in memory (not localStorage) so it resets on page reload.
 * Any 401 from the API should call clearToken() then getToken() to retry.
 */

const APP_KEY = import.meta.env.VITE_API_APP_KEY?.trim();
// In dev the Vite proxy forwards /api/* to the real server (avoids CORS).
// In production the full URL is used directly (requires CORS headers from Shivam).
const BASE = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL?.trim();

let _token = null;
let _inflight = null; // shared promise so parallel callers don't each fire a separate POST

export async function getToken() {
  if (_token) return _token;
  if (_inflight) return _inflight;
  _inflight = _refresh().finally(() => { _inflight = null; });
  return _inflight;
}

async function _refresh() {
  const res = await fetch(`${BASE}/get-jwt-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_key: APP_KEY }),
  });
  if (!res.ok) throw new Error(`Auth: token fetch failed (${res.status})`);
  const json = await res.json().catch(() => null);
  const token = json?.data?.jwt_token;
  if (!token) throw new Error("Auth: token missing from response");
  _token = token;
  return _token;
}

export function clearToken() {
  _token = null;
}
