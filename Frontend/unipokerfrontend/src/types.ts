export type GamePublicCard = {
    id: string;
    gameType: string;     // Human-readable
    blinds: string;       // e.g., "$1/$2"
    minBuyIn: number;
    maxBuyIn: number;
    startTime: string;    // ISO
    distanceMi?: number;   // distance only, no address here
  };
  
  export type CreateGameBody = {
    gameType: "TEXAS_HOLDEM" | "PLO";
    blinds: string;
    minBuyIn: number;
    maxBuyIn: number;
    startTime: string;
    address: string;      // private on server
    lat?: number;
    lng?: number;
    notes?: string;
  };
  