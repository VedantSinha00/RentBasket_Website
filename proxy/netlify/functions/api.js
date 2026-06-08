/**
 * Netlify Function wrapper around the runtime-agnostic proxy handler.
 *
 * Deployed as its own Netlify site (base directory = proxy/). With the catch-all
 * redirect in netlify.toml, every request reaches this function and event.path is
 * the original request path (e.g. "/get-amenity-types").
 */
import { handleProxy } from "../../lib/handler.js";

export async function handler(event) {
  // Strip the function prefix if the request hit the function URL directly.
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, "") || "/";

  const res = await handleProxy({
    method: event.httpMethod,
    path,
    query: event.rawQuery || "",
    headers: event.headers || {},
    body: event.isBase64Encoded && event.body
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body,
  });

  return { statusCode: res.status, headers: res.headers, body: res.body };
}
