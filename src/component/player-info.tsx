"use client";

import { useState } from "react";
import { useRoom } from "./room-context";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import Link from "next/link";
import { EditNameForm } from "./edit-name-form";

export default function PlayerInfo() {
  const [editMode, setEditMode] = useState(false);

  const {
    roomId,
    me,
    isAdmin,
    updateName,
    state: { state },
  } = useRoom();

  const editable = !isAdmin && state.type === "lobby";

  if (isAdmin) {
    return (
      <Link
        href={`/room/${roomId}/admin`}
        className="btn btn-primary btn-xl w-full"
      >
        Admin controls
      </Link>
    );
  }

  return (
    <div>
      {editMode ? (
        <EditNameForm
          onSubmit={(name) => {
            updateName(name);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
          initialName={me?.name}
        />
      ) : (
        <div className="flex items-center space-x-4">
          <button
            className={clsx("btn btn-outline", {
              hidden: !editable,
            })}
            onClick={() => setEditMode(true)}
            title="Edit Name"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
          </button>
          <Link
            href={`/room/${roomId}/admin`}
            className={clsx("btn btn-primary", !isAdmin && "hidden")}
          >
            Admin controls
          </Link>

          <h2 className="text-lg font-bold">Welcome {me?.name}</h2>
        </div>
      )}
    </div>
  );
}
