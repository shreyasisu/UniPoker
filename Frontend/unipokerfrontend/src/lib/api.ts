import axios from "axios";
import type { CreateGameBody, GamePublicCard } from "../types";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 👈 points to backend
  timeout: 10000,
});

export const api = {
  async createGame(body: CreateGameBody, userId: number) {
    const { data } = await client.post("/api/games", body, {
      headers: {
        'X-User-Id': userId.toString()
      }
    });
    return data;
  },

  async listGames(): Promise<GamePublicCard[]> {
    const { data } = await client.get("/api/games");
    return data;
  },

  async hasHostedGame(userId: number): Promise<boolean> {
    const { data } = await client.get(`/api/games/has-hosted/${userId}`);
    return data;
  },

  async getHostedGame(userId: number): Promise<GamePublicCard> {
    const { data } = await client.get(`/api/games/hosted/${userId}`);
    return data;
  },
  async login(data: { email: string; password: string }) {
    const res = await client.post("/auth/login", data);
    return res.data; // { message: string, userId: number }
  },

  async register(data: { email: string; password: string }) {
    const res = await client.post("/auth/register", data);
    return res.data; // { message: string, userId: number }
  }

  //add DeleteGame api
  
};
