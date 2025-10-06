import { useState, useEffect } from "react";
import { api } from "../lib/api.ts";
import HostGame from "./HostGame.tsx";
import { useAuth } from "../context/AuthContext.tsx";

export default function HostPage() {
  const [hasHostedGame, setHasHostedGame] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const checkHostedGame = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const hasGame = await api.hasHostedGame(parseInt(token));
      setHasHostedGame(hasGame);
    } catch (error) {
      console.error("Error checking hosted game:", error);
      setHasHostedGame(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHostedGame();
  }, [token]);

  // Callback function to refresh the hosted game status
  const onGameCreated = () => {
    checkHostedGame();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <div>Please log in to host a game.</div>;
  }

  // If user has a hosted game, show requests
  if (hasHostedGame) {
    return <h1>Requests</h1>;
  }

  // If user has no hosted game, show HostGame component
  return <HostGame onGameCreated={onGameCreated} />;
}
