import axios from "axios";
import type { CreateGameBody, GamePublicCard } from "../types.ts";

// If VITE_API_URL is set, we’ll use it; otherwise fall back to mock mode.
const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
const mockMode = !BASE_URL;

const client = axios.create({
  baseURL: BASE_URL ?? "http://example.local/unused",
  timeout: 12_000,
});

let MOCK_GAMES: Array<GamePublicCard & { address?: string }> = [
  {
    id: "g1",
    gameType: "Texas Hold’em",
    blinds: "$1/$2",
    minBuyIn: 100,
    maxBuyIn: 300,
    startTime: new Date(Date.now() + 3600_000).toISOString(),
    distanceMi: 2.3,
  },
  {
    id: "g2",
    gameType: "PLO",
    blinds: "$1/$3",
    minBuyIn: 200,
    maxBuyIn: 600,
    startTime: new Date(Date.now() + 7200_000).toISOString(),
    distanceMi: 5.7,
  },
];

export const api = {
  async searchNearby(params: { lat: number; lng: number; radiusMi: number }): Promise<GamePublicCard[]> {
    if (mockMode) {
      // In real API, the server calculates distance; here we just return the mock list.
      await sleep(400);
      return MOCK_GAMES;
    }
    const { data } = await client.get("/api/games/search", { params });
    return data;
  },

  async searchByZip(params: { zip: string; radiusMi: number }): Promise<GamePublicCard[]> {
    if (mockMode) {
      await sleep(400);
      return MOCK_GAMES.map((g) => ({ ...g, distanceMi: g.distanceMi + 0.2 }));
    }
    const { data } = await client.get("/api/games/search", { params });
    return data;
  },

  async requestAccess({ gameId }: { gameId: string }) {
    if (mockMode) {
      await sleep(350);
      return { ok: true };
    }
    const { data } = await client.post(`/api/games/${gameId}/requests`, {});
    return data;
  },

  async createGame(body: CreateGameBody) {
    if (mockMode) {
      await sleep(500);
      // Pretend the new game is now discoverable (still distance-only)
      MOCK_GAMES = [
        { id: cryptoRandomId(), gameType: humanGameType(body.gameType), blinds: body.blinds, minBuyIn: body.minBuyIn, maxBuyIn: body.maxBuyIn, startTime: body.startTime, distanceMi: 1.1 },
        ...MOCK_GAMES,
      ];
      return { id: "mock-created" };
    }
    const { data } = await client.post("/api/games", body);
    return data;
  },
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
function cryptoRandomId() {
  return Math.random().toString(36).slice(2);
}
function humanGameType(t: "TEXAS_HOLDEM" | "PLO") {
  return t === "PLO" ? "PLO" : "Texas Hold’em";
}
