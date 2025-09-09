import type { GamePublicCard } from "../types.ts";

export default function GameCard({
  game,
  onRequestAccess,
}: {
  game: GamePublicCard;
  onRequestAccess: (gameId: string) => void;
}) {
  return (
    <div className="card">
      <div className="cardRow">
        <div>
          <div className="cardTitle">{game.gameType}</div>
          <div className="muted">{game.blinds} • ${game.minBuyIn}–${game.maxBuyIn}</div>
          <div className="muted">Starts: {new Date(game.startTime).toLocaleString()}</div>
        </div>
        <div className="distance">{game.distanceMi.toFixed(1)} mi</div>
      </div>
      <div className="cardRow end">
        <button className="btn primary" onClick={() => onRequestAccess(game.id)}>
          Request Access
        </button>
      </div>
    </div>
  );
}
