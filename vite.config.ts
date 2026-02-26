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
        blog: path.resolve(root, "blog/index.html"),
        work: path.resolve(root, "work.html"),
        postKnowledgeBase: path.resolve(root, "blog/ai-knowledge-base/index.html"),
        postChatTactile: path.resolve(root, "blog/chat-plus-tactile-ui/index.html"),
        postChat: path.resolve(root, "blog/chat-is-not-the-final-interface/index.html"),
        postCgui: path.resolve(root, "blog/conversational-gui/index.html"),
        postUber: path.resolve(root, "blog/product-engineering-at-uber/index.html"),
        postFramework: path.resolve(root, "blog/uber-mobile-framework/index.html"),
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
