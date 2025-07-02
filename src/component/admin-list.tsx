"use client";

import {
  PencilIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { useRoom } from "./room-context";
import { clsx } from "clsx";
import { createCallable } from "react-call";
import { useRef } from "react";
import { EditNameForm } from "./edit-name-form";
import { SpinnerInput } from "./spinner-input";

const EditName = createCallable<{ name: string }, string | null>(
  ({ call, name }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Close when clicking outside the modal-box
    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        call.end(null);
      }
    };

    return (
      <dialog
        ref={dialogRef}
        className="modal modal-open"
        onClick={handleDialogClick}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rename {name}</h3>
          <EditNameForm
            onSubmit={(newName) => {
              call.end(newName);
            }}
            onCancel={() => call.end(null)}
            initialName={name}
            className="mt-4"
          />
        </div>
      </dialog>
    );
  },
);

const EditScore = createCallable<
  {
    name: string;
    points: number;
  },
  number | null
>(({ call, name, points }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Close when clicking outside the modal-box
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      call.end(null);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-open"
      onClick={handleDialogClick}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Score for {name}</h3>
        <form
          className="flex items-center space-x-2 mt-4 w-full"
          action={(formData) => {
            const input = formData.get("points") as string | null;
            const points = input ? parseInt(input, 10) : null;
            if (points !== null && !isNaN(points)) {
              call.end(points);
            } else {
              call.end(null);
            }
          }}
        >
          <SpinnerInput
            label="Points"
            name="points"
            defaultValue={points}
            className="flex-1"
          />
          <button type="submit" className="btn btn-success">
            <PencilIcon className="h-4 w-4" />
            Save
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => call.end(null)}
            title="Cancel Edit"
            aria-label="Cancel Edit"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </form>
      </div>
    </dialog>
  );
});

export default function AdminList() {
  const {
    state: { players },
    positions,
    me,
    admin: { setName, setPoints },
  } = useRoom();

  return (
    <div className="flex flex-col space-y-2">
      <EditName.Root />
      <EditScore.Root />

      {players.map((player) => (
        <div
          key={player.id}
          className={clsx(
            "flex items-center justify-between p-2 bg-base-100 rounded-lg shadow-sm border-1 border-base-200",
            player.id === me?.id && "border-primary text-primary-content",
          )}
        >
          <span className="flex items-center space-x-2">
            <span className={"font-semibold"}>#{positions[player.id]}</span>{" "}
            <button
              className="btn btn-sm"
              onClick={async () => {
                const newName = await EditName.call({ name: player.name });
                if (newName && newName !== player.name) {
                  setName(player.id, newName);
                }
              }}
            >
              {player.name}
              <PencilSquareIcon className="size-[1.2em]" />
            </button>
          </span>
          <button
            className="btn btn-sm btn-primary"
            onClick={async () => {
              const newPoints = await EditScore.call({
                name: player.name,
                points: player.points,
              });
              if (newPoints !== null && newPoints !== player.points) {
                setPoints(player.id, newPoints);
              }
            }}
          >
            {player.points} points
            <PencilSquareIcon className="size-[1.2em]" />
          </button>
        </div>
      ))}
      {players.length === 0 && (
        <div className="text-gray-500 text-center">No players connected</div>
      )}
    </div>
  );
}
