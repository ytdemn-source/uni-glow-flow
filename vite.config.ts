import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      strategies: "injectManifest",
      injectRegister: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      manifest: {
        name: "GS Hub - Galsi Student Hub",
        short_name: "GS Hub",
        description: "Galsi Mahavidyalaya student portal — notices, results, academic updates.",
        start_url: "/",
        display: "standalone",
        theme_color: "#4f46e5",
        background_color: "#ffffff",
        icons: [
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
