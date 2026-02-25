import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("/{*path}", (req, res) => {
    const clean = req.path.split("?")[0].split("#")[0];

    const candidates = [
      path.join(distPath, clean, "index.html"),
      path.join(distPath, clean + ".html"),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return res.sendFile(candidate);
      }
    }

    res.status(404).sendFile(path.resolve(distPath, "index.html"));
  });
}
