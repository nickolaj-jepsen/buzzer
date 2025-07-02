import * as z from "zod/v4";

export const PlayerSchema = z.object({
  name: z.string(),
  admin: z.boolean(),
  id: z.string(),
  points: z.number(),
});

const RoomStateLobbySchema = z.object({
  type: z.literal("lobby"),
});

const RoomStateWaitingSchema = z.object({
  type: z.literal("waiting"),
});

const RoomStateReadySchema = z.object({
  type: z.literal("ready"),
});

const RoomStateBuzzedInSchema = z.object({
  type: z.literal("buzzed-in"),
  player: PlayerSchema,
});

export const RoomStateSchema = z.discriminatedUnion("type", [
  RoomStateLobbySchema,
  RoomStateWaitingSchema,
  RoomStateReadySchema,
  RoomStateBuzzedInSchema,
]);

export const RoomSchema = z.object({
  id: z.string(),
  players: z.array(PlayerSchema),
  state: RoomStateSchema,
  adminId: z.string().nullable(),
});

export type Player = z.infer<typeof PlayerSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type RoomState = z.infer<typeof RoomStateSchema>;
