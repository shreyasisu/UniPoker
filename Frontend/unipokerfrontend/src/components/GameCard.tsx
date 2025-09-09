import type { GamePublicCard } from "../types.ts";

export default function GameCard({
  game,
  onRequestAccess,
  isRequested = false,
  isRequesting = false,
}: {
  game: GamePublicCard;
  onRequestAccess: (gameId: string) => void;
  isRequested?: boolean;
  isRequesting?: boolean;
}) {
  return (
    <div className="card">
      <div className="cardRow">
        <div>
          <div className="cardTitle">{game.gameType}</div>
          <div className="muted">
            {game.blinds} • ${game.minBuyIn}–${game.maxBuyIn}
          </div>
          <div className="muted">
            Starts: {new Date(game.startTime).toLocaleString()}
          </div>
        </div>
        <div className="distance">{game.distanceMi.toFixed(1)} mi</div>
      </div>
      <div className="cardRow end">
        <button
          className={`btn ${isRequested ? "requested" : "primary"}`}
          onClick={() => onRequestAccess(game.id)}
          disabled={isRequested || isRequesting}
        >
          {isRequesting
            ? "Requesting..."
            : isRequested
            ? "Requested"
            : "Request Access"}
        </button>
      </div>
    </div>
  );
}
