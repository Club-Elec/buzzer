import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { nanoid } from "nanoid";
import { zValidator } from "@hono/zod-validator";
import {
  party_body,
  party_params,
  remove_party_player_params,
} from "./schemas";

type Party = {
  players: string[];
  submitted: string[];
  created_at: number;
  updated_at: number;
};

// List of random names
const names = [
  "Judas Sticau",
  "Ken Tucky",
  "Chipo Lata",
  "Alain Proviste",
  "Archie Mède",
  "Annie Versaire",
  "Anne Emone",
  "Alain Terieur",
  "Mo Bylette",
  "Sarah Croche",
  "Sarah Pelle",
];

// Store the parties in memory
const parties: Record<string, Party> = {};

// Create the app
const app = new Hono()
  .use("*", logger())
  .use(cors({ origin: "*" }))
  .get("/", async (c) => c.text("OK"))
  .post("/party", async (c) => {
    let id = nanoid(5);

    // Ensure the id is unique
    while (parties[id]) id = nanoid(5);

    // Get the current timestamp
    const now = Date.now();

    // Create the party
    parties[id] = {
      players: [],
      submitted: [],
      created_at: now,
      updated_at: now,
    };

    return c.json({ id }, 201);
  })
  .get("/party/:id", zValidator("param", party_params), async (c) => {
    const { id } = c.req.valid("param");

    // Ensure the party exists
    if (!parties[id]) {
      return c.json({ error: "Party not found" }, 404);
    }

    return c.json({
      id,
      players: parties[id].players,
      submitted: parties[id].submitted,
    });
  })
  .post("/party/:id", zValidator("param", party_params), async (c) => {
    const { id } = c.req.valid("param");

    // Ensure the party exists
    if (!parties[id]) {
      return c.json({ error: "Party not found" }, 404);
    }

    // Make sure the party is not full
    if (parties[id].players.length >= names.length) {
      return c.json({ error: "Party is full" }, 400);
    }

    // Pick a random name
    let name = names[Math.floor(Math.random() * names.length)];
    while (parties[id].players.includes(name)) {
      name = names[Math.floor(Math.random() * names.length)];
    }

    // Add the player to the party
    parties[id].players.push(name);

    // Update the party's timestamp
    parties[id].updated_at = Date.now();

    return c.json({ id, name });
  })
  .post(
    "/party/:id/buzz",
    zValidator("param", party_params),
    zValidator("json", party_body),
    async (c) => {
      const { id } = c.req.valid("param");
      const { name } = c.req.valid("json");

      // Ensure the party exists
      if (!parties[id]) {
        return c.json({ error: "Party not found" }, 404);
      }

      // Check if the player has already submitted
      if (parties[id].submitted.includes(name)) {
        return c.json({ error: "Player already submitted" }, 400);
      }

      // Add the player to the submitted list
      parties[id].submitted.push(name);

      // Update the party's timestamp
      parties[id].updated_at = Date.now();

      // Retrieve the player's index starting from 1
      const rank = parties[id].submitted.length;

      return c.json({ id, rank });
    }
  )
  .post("/party/:id/reset", zValidator("param", party_params), async (c) => {
    const { id } = c.req.valid("param");

    // Ensure the party exists
    if (!parties[id]) {
      return c.json({ error: "Party not found" }, 404);
    }

    // Reset the submitted list
    parties[id].submitted = [];

    // Update the party's timestamp
    parties[id].updated_at = Date.now();

    return c.json({ id });
  })
  .delete(
    "/party/:id/:name",
    zValidator("param", remove_party_player_params),
    async (c) => {
      const { id, name } = c.req.valid("param");

      // Ensure the party exists
      if (!parties[id]) {
        return c.json({ error: "Party not found" }, 404);
      }

      // Remove the player from the party
      parties[id].players = parties[id].players.filter((n) => n !== name);
      parties[id].submitted = parties[id].submitted.filter((n) => n !== name);

      // Update the party's timestamp
      parties[id].updated_at = Date.now();

      return c.json({ id });
    }
  );

// Clean up the parties every 15 minutes if they are older than 1 hour
setInterval(() => {
  const now = Date.now();

  for (const id in parties) {
    if (now - parties[id].updated_at > 60 * 60 * 1000) {
      delete parties[id];

      console.log(`Party ${id} has been deleted, it was too old`);
    }
  }
}, 15 * 60 * 1000);

// Export / start the app
export default {
  port: 5000,
  fetch: app.fetch,
};

export type AppType = typeof app;
