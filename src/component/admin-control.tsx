"use client";

import { Confirm } from "./confirm";
import { useRoom } from "./room-context";

export default function AdminControls() {
  const {
    state: { state },
    admin: { enableBuzzers, decideOutcome, resetRound, resetGame },
  } = useRoom();

  if (state.type === "lobby" || state.type === "waiting") {
    return (
      <div className="flex flex-col items-center space-y-4">
        <button
          className="btn btn-xl btn-primary w-full"
          onClick={enableBuzzers}
        >
          Unlock buzzers
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={async () => {
            if (
              await Confirm.call({
                message: "Are you sure you want to reset the game?",
              })
            ) {
              resetGame();
            }
          }}
        >
          Reset game
        </button>
      </div>
    );
  }

  if (state.type === "ready") {
    return (
      <div className="flex flex-col items-center space-y-4">
        <button className="btn btn-xl btn-primary w-full" onClick={resetRound}>
          Reset Round
        </button>
        <div className="text-lg">Waiting for players to buzz in...</div>
      </div>
    );
  }

  if (state.type === "buzzed-in") {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="gap-2 w-full grid grid-cols-1 sm:grid-cols-3">
          <button
            className="btn btn-xl btn-success"
            onClick={() => decideOutcome("win")}
          >
            Correct
          </button>
          <button
            className="btn btn-xl btn-primary leading-none"
            onClick={resetRound}
          >
            Reset Round
          </button>
          <button
            className="btn btn-xl btn-error"
            onClick={() => decideOutcome("lose")}
          >
            Wrong
          </button>
        </div>
        <div className="text-lg">{state.player.name} has buzzed in!</div>{" "}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold">Unknown state</h2>
    </div>
  );
}
