"use client";

import { useRoom } from "./room-context";
import { clsx } from "clsx";

export default function PlayerList() {
  const {
    state: { players },
    positions,
    me,
  } = useRoom();

  return (
    <div className="flex flex-col space-y-2">
      {players.map((player) => (
        <div
          key={player.id}
          className={clsx(
            "flex items-center justify-between p-2 bg-base-100 rounded-lg shadow-sm border-1 border-base-200",
            player.id === me?.id && "border-primary text-primary-content",
          )}
        >
          <span>
            <span className={"font-semibold"}>#{positions[player.id]}</span>{" "}
            {player.name}
          </span>
          <span>{player.points} points</span>
        </div>
      ))}
      {players.length === 0 && (
        <div className="text-gray-500 text-center">No players connected</div>
      )}
    </div>
  );
}
