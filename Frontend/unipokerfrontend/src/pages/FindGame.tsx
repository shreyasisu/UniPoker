import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GameCard from "../components/GameCard";
import { api } from "../lib/api.ts";

export default function FindGame() {
  const [coords, setCoords] = useState<{lat: number; lng: number} | null>(null);
  const [zip, setZip] = useState("");
  const [radiusMi, setRadiusMi] = useState(10);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {} // silent fail; user can enter ZIP
    );
    return () => {
      if (typeof id === "number") clearInterval(id);
    };
  }, []);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["games", coords?.lat, coords?.lng, radiusMi, zip],
    queryFn: async () => {
      // If user entered a ZIP, prefer that. Otherwise use coords.
      return zip
        ? api.searchByZip({ zip, radiusMi })
        : coords
          ? api.searchNearby({ lat: coords.lat, lng: coords.lng, radiusMi })
          : [];
    },
    enabled: !!coords || !!zip,
  });

  const requestAccess = useMutation({
    mutationFn: (gameId: string) => api.requestAccess({ gameId }),
    onSuccess: () => {
      alert("Request sent to host! You’ll be notified if approved.");
    },
  });

  return (
    <section>
      <div className="panel">
        <div className="panelRow">
          <button
            className="btn"
            onClick={() => refetch()}
            disabled={isLoading || isFetching || (!coords && !zip)}
          >
            {isFetching ? "Searching…" : "Search"}
          </button>

          <label className="field">
            <span>Radius (mi)</span>
            <input
              type="number"
              min={1}
              max={50}
              value={radiusMi}
              onChange={(e) => setRadiusMi(Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>ZIP (optional)</span>
            <input
              placeholder="e.g., 61801"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </label>

          <div className="hint">
            {coords ? "Using your location (with permission)." : "Enter a ZIP or allow location."}
          </div>
        </div>
      </div>

      {isLoading && <p>Loading…</p>}
      {!isLoading && data && data.length === 0 && <p>No open games found in that radius.</p>}

      <div className="grid">
        {data?.map((g) => (
          <GameCard key={g.id} game={g} onRequestAccess={(id) => requestAccess.mutate(id)} />
        ))}
      </div>
    </section>
  );
}
