import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../lib/api.ts";
import { useAuth } from "../context/AuthContext.tsx";

const schema = z.object({
  gameType: z.enum(["TEXAS_HOLDEM", "PLO"]),
  blinds: z
    .string()
    .min(1, "Required")
    .regex(
      /^\$?(\d+(?:\.\d+)?)\/?\$?(\d+(?:\.\d+)?)?$/,
      "Invalid format. Use: 1/2, $1/2, or $1/$2"
    ),
  minBuyIn: z.number().min(1),
  maxBuyIn: z.number().min(1),
  startTime: z.string().min(1),
  address: z.string().min(1, "Required"), // stored privately on backend
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface HostGameProps {
  onGameCreated: () => void;
}

export default function HostGame({ onGameCreated }: HostGameProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gameType: "TEXAS_HOLDEM",
    },
  });

  const openDatePicker = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.showPicker?.();
  };

  const formatBlinds = (value: string) => {
    // Remove all $ signs and normalize the input
    const cleaned = value.replace(/\$/g, "");

    // Only format if we have both parts after the slash
    if (cleaned.includes("/")) {
      const parts = cleaned.split("/");
      if (parts.length === 2) {
        const small = parts[0].trim();
        const big = parts[1].trim();

        // Only format if both parts have content (user finished typing)
        if (small && big) {
          return `$${small}/$${big}`;
        }
      }
    }

    return value; // Return as-is if incomplete or no slash found
  };

  const handleBlindsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBlinds(event.target.value);
    // Only update if the formatted value is different and complete
    if (
      formatted !== event.target.value &&
      formatted.includes("/") &&
      !formatted.endsWith("/")
    ) {
      event.target.value = formatted;
    }
  };

  const createGame = useMutation({
    mutationFn: (data: FormData) => {
      if (!token) {
        throw new Error("User not authenticated");
      }
      return api.createGame(data, parseInt(token));
    },
    onSuccess: () => {
      alert("Game created!");
      onGameCreated?.();
    },
  });

  const onSubmitGame = (data: FormData) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (data.minBuyIn > data.maxBuyIn) {
      setSubmitError("Min buy-in cannot exceed max buy-in");
      return;
    }

    createGame.mutate(data);
  };

  return (
    <div className="host-game-container">
      <form
        className="form host-game-form"
        onSubmit={handleSubmit(onSubmitGame)}
        noValidate
      >
        {submitError && (
          <div className="error-message">
            <strong>Error:</strong> {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="success-message">
            <strong>Success:</strong> {submitSuccess}
          </div>
        )}
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
            <input
              placeholder="e.g., 1/2, $1/2, or $1/$2"
              {...register("blinds")}
              onChange={handleBlindsChange}
            />
            {errors.blinds && (
              <em className="error">{errors.blinds.message}</em>
            )}
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Min Buy-In ($)</span>
            <input
              type="number"
              {...register("minBuyIn", { valueAsNumber: true })}
            />
          </label>
          <label className="field">
            <span>Max Buy-In ($)</span>
            <input
              type="number"
              {...register("maxBuyIn", { valueAsNumber: true })}
            />
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Start Time</span>
            <input
              type="datetime-local"
              {...register("startTime")}
              onClick={openDatePicker}
              style={{ cursor: "pointer" }}
            />
          </label>
          <label className="field">
            <span>Address (private)</span>
            <input
              placeholder="Exact address (kept private)"
              {...register("address")}
            />
            {errors.address && (
              <em className="error">{errors.address.message}</em>
            )}
          </label>
        </div>

        <div className="row">
          <label className="field">
            <span>Latitude (optional)</span>
            <input
              type="number"
              step="any"
              {...register("lat", { valueAsNumber: true })}
            />
          </label>
          <label className="field">
            <span>Longitude (optional)</span>
            <input
              type="number"
              step="any"
              {...register("lng", { valueAsNumber: true })}
            />
          </label>
        </div>

        <label className="field full-width">
          <span>Notes (optional)</span>
          <textarea
            rows={3}
            placeholder="Any house rules, parking hints, etc."
            {...register("notes")}
          />
        </label>

        <div className="actions">
          <button
            className="btn primary"
            type="submit"
            disabled={createGame.isPending}
          >
            {createGame.isPending ? "Creating…" : "Create Game"}
          </button>
        </div>
      </form>
    </div>
  );
}
