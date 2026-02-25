import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";

const viteLogger = createLogger();

const clientDir = path.resolve(import.meta.dirname, "..", "client");

function resolveHtmlFile(urlPath: string): string | null {
  const clean = urlPath.split("?")[0].split("#")[0];

  if (clean === "/" || clean === "/index.html") {
    return path.join(clientDir, "index.html");
  }

  if (clean.endsWith(".html")) {
    const candidate = path.join(clientDir, clean);
    if (fs.existsSync(candidate)) return candidate;
  }

  if (clean.endsWith("/")) {
    const candidate = path.join(clientDir, clean, "index.html");
    if (fs.existsSync(candidate)) return candidate;
  }

  const withHtml = path.join(clientDir, clean + ".html");
  if (fs.existsSync(withHtml)) return withHtml;

  const withIndex = path.join(clientDir, clean, "index.html");
  if (fs.existsSync(withIndex)) return withIndex;

  return null;
}

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;
    const htmlFile = resolveHtmlFile(url);

    if (!htmlFile) {
      return next();
    }

    try {
      const template = await fs.promises.readFile(htmlFile, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
