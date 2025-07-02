import "server-only";

import { PARTYKIT_URL } from "@/app/env";

export async function getRoom(roomId: string) {
  const res = await fetch(`${PARTYKIT_URL}/party/${roomId}`, {
    method: "GET",
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null; // Room not found
    } else {
      throw new Error("Something went wrong.");
    }
  }

  return res.json();
}

export async function createRoom(id: string) {
  await fetch(`${PARTYKIT_URL}/party/${id}`, {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
