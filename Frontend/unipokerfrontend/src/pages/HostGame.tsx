import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api.ts";

const schema = z.object({
  gameType: z.enum(["TEXAS_HOLDEM", "PLO"]),
  blinds: z.string().min(1, "Required"),
  minBuyIn: z.coerce.number().min(1),
  maxBuyIn: z.coerce.number().min(1),
  startTime: z.string().min(1),
  address: z.string().min(1, "Required"), // stored privately on backend
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function HostGame() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gameType: "TEXAS_HOLDEM",
    },
  });

  const createGame = useMutation({
    mutationFn: (data: FormData) => api.createGame(data),
    onSuccess: () => {
      alert("Game created! Players will only see distance until you approve them.");
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.minBuyIn > data.maxBuyIn) {
      alert("Min buy-in cannot exceed max buy-in");
      return;
    }
    createGame.mutate(data);
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="row">
        <label className="field">
          <span>Game Type</span>
          <select {...register("gameType")}>
            <option value="TEXAS_HOLDEM">Texas Hold’em</option>
            <option value="PLO">PLO</option>
          </select>
        </label>

        <label className="field">
          <span>Blinds</span>
          <input placeholder="e.g., $1/$2" {...register("blinds")} />
          {errors.blinds && <em className="error">{errors.blinds.message}</em>}
        </label>
      </div>

      <div className="row">
        <label className="field">
          <span>Min Buy-In ($)</span>
          <input type="number" {...register("minBuyIn")} />
        </label>
        <label className="field">
          <span>Max Buy-In ($)</span>
          <input type="number" {...register("maxBuyIn")} />
        </label>
      </div>

      <div className="row">
        <label className="field">
          <span>Start Time</span>
          <input type="datetime-local" {...register("startTime")} />
        </label>
        <label className="field">
          <span>Address (private)</span>
          <input placeholder="Exact address (kept private)" {...register("address")} />
          {errors.address && <em className="error">{errors.address.message}</em>}
        </label>
      </div>

      <div className="row">
        <label className="field">
          <span>Latitude (optional)</span>
          <input type="number" step="any" {...register("lat")} />
        </label>
        <label className="field">
          <span>Longitude (optional)</span>
          <input type="number" step="any" {...register("lng")} />
        </label>
      </div>

      <label className="field">
        <span>Notes (optional)</span>
        <textarea rows={3} placeholder="Any house rules, parking hints, etc." {...register("notes")} />
      </label>

      <div className="actions">
        <button className="btn primary" type="submit" disabled={createGame.isPending}>
          {createGame.isPending ? "Creating…" : "Create Game"}
        </button>
      </div>
    </form>
  );
}
