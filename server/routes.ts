import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client
// The blueprint automatically sets these env vars
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Notes API ===
  
  app.get(api.notes.list.path, async (req, res) => {
    const leadId = Number(req.params.leadId);
    if (isNaN(leadId)) {
      return res.status(400).json({ message: "Invalid lead ID" });
    }
    const notes = await storage.getNotes(leadId);
    res.json(notes);
  });

  app.post(api.notes.create.path, async (req, res) => {
    try {
      const input = api.notes.create.input.parse(req.body);
      const note = await storage.createNote(input);
      res.status(201).json(note);
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

  app.delete(api.notes.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    await storage.deleteNote(id);
    res.status(204).send();
  });

  // === AI Summary API ===

  app.post(api.ai.summarize.path, async (req, res) => {
    try {
      const { content } = api.ai.summarize.input.parse(req.body);

      const response = await openai.chat.completions.create({
        model: "gpt-5.1", // Using the model recommended in blueprint
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant. Summarize the following note in strictly 20 words or less. Do not include any intro/outro." 
          },
          { 
            role: "user", 
            content 
          }
        ],
        max_completion_tokens: 100, // Small limit for summary
      });

      const summary = response.choices[0]?.message?.content || "Could not generate summary.";
      
      res.json({ summary });

    } catch (err) {
      console.error("AI Summary Error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Failed to generate summary" });
    }
  });

  return httpServer;
}
