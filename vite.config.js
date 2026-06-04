import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

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
    plugins: [react()],
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
