import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Content-Security-Policy injected ONLY into the production build's index.html.
// (A meta CSP in dev would break Vite's HMR, which needs inline scripts + eval + ws.)
// frame-ancestors / nosniff can't be set via <meta> — those live in public/_headers
// for hosts that support real response headers. See docs/security-plan.md (WS1b).
function cspMeta(isProd) {
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'", // Tailwind / Radix / framer-motion inject inline styles
    "img-src 'self' data: https:", // product images come from the remote catalog/CDN
    "font-src 'self' data:",
    "connect-src 'self' https://*.rentbasket.com", // API + (future) proxy on a rentbasket subdomain
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'", // meta-only hosts (e.g. GitHub Pages, which ignores _headers) still get this
    // frame-ancestors can't be set via <meta> — it's in public/_headers for capable hosts.
    // NOTE: under Playwright/e2e the console may show "directive ... contains 'child-src'" —
    // that's a harness artifact (the Playwright MCP appends CSP directives to the meta at
    // runtime); the shipped policy is clean (verify via view-source in a normal browser).
  ].join("; ");
  return {
    name: "inject-csp-meta",
    transformIndexHtml(html) {
      if (!isProd) return html;
      return html.replace(
        "</head>",
        `    <meta http-equiv="Content-Security-Policy" content="${csp}" />\n  </head>`,
      );
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const apiTarget = env.VITE_API_BASE_URL;

  return {
    base: mode === "production" ? "/RentBasket_Website/" : "/",
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
      // Proxy /api/* → API server in dev to avoid CORS issues.
      // Production requests go direct; Shivam needs to add CORS headers there.
      ...(apiTarget
        ? {
            proxy: {
              "/api": {
                target: apiTarget,
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api/, ""),
              },
            },
          }
        : {}),
    },
    plugins: [react(), cspMeta(mode === "production")],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
      exclude: ["e2e/**", "node_modules/**", "dist/**"],
      environment: "jsdom",
    },
  };
});
