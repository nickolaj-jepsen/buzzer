"use client";

import { useRoom } from "./room-context";

export default function BuzzerProgress() {
  const {
    state: { state },
  } = useRoom();
  if (state.type !== "buzzed-in") {
    return null;
  }

  return (
    <div className="bg-base-300 h-8 relative rounded-lg overflow-hidden">
      <div
        className="animate-progress h-8 w-full bg-primary"
        style={{ animationDuration: "15s" }}
      ></div>
      <span
        className="animate-fade-in absolute inset-0 flex items-center justify-center text-lg font-bold text-primary-content opacity-0"
        style={{ animationDelay: "15s" }}
      >
        Times Up!
      </span>
    </div>
  );
}
