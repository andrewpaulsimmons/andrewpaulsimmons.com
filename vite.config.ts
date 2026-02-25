import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const root = path.resolve(import.meta.dirname, "client");

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  root,
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(root, "index.html"),
        blog: path.resolve(root, "blog.html"),
        work: path.resolve(root, "work.html"),
        postChatTactile: path.resolve(root, "posts/chat-plus-tactile-ui/index.html"),
        postChat: path.resolve(root, "posts/chat-is-not-the-final-interface/index.html"),
        postCgui: path.resolve(root, "posts/conversational-gui/index.html"),
        postUber: path.resolve(root, "posts/product-engineering-at-uber/index.html"),
        postFramework: path.resolve(root, "posts/uber-mobile-framework/index.html"),
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
