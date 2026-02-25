import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Hello world greeting endpoint
  app.get(api.greeting.get.path, (req, res) => {
    res.json({ message: "Hello World! The fullstack app is running." });
  });

  // Messages CRUD endpoints
  app.get(api.messages.list.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed the storage with some initial messages
  await storage.createMessage({ text: "Welcome to your new app!" });
  await storage.createMessage({ text: "This is an in-memory message store." });

  return httpServer;
}
