"use client";

import { useMemo } from "react";
import { useRoom } from "./room-context";
import { clsx } from "clsx";

export default function Buzzer() {
  const {
    state: { state },
    me,
    buzz,
  } = useRoom();
  const enabled = state.type === "ready";

  const yourBuzzedIn = useMemo(() => {
    return state.type === "buzzed-in" && state.player.id === me?.id;
  }, [state, me?.id]);

  const label = useMemo(() => {
    if (yourBuzzedIn) return "You buzzed!";
    if (state.type === "buzzed-in") return `${state.player.name} buzzed!`;
    if (state.type === "ready") return "Buzz!";
    if (state.type === "waiting") return "Locked";
    return "Waiting for game to start...";
  }, [yourBuzzedIn, state]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        className={clsx(
          "btn",
          yourBuzzedIn ? "btn-success" : "btn-error",
          "w-full",
          "h-full",
          "rounded-full",
          "aspect-square",
          "text-2xl",
          "font-bold",
        )}
        onClick={enabled ? buzz : undefined}
        disabled={!enabled && !yourBuzzedIn}
      >
        {label}
      </button>
    </div>
  );
}
