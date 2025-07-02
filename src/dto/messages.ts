import * as z from "zod/v4";
import { RoomSchema } from "./room";

const UpdateNameMessageSchema = z.object({
  type: z.literal("update-name"),
  name: z.string(),
});

const BuzzMessageSchema = z.object({
  type: z.literal("buzz"),
});

const EnableBuzzersMessageSchema = z.object({
  type: z.literal("admin-enable-buzzers"),
});

const ResetRoundMessageSchema = z.object({
  type: z.literal("admin-reset-round"),
});

const ResetGameMessageSchema = z.object({
  type: z.literal("admin-reset-game"),
});

const AdminUpdateNameMessageSchema = z.object({
  type: z.literal("admin-update-name"),
  playerId: z.string(),
  name: z.string(),
});

const AdminUpdatePointsMessageSchema = z.object({
  type: z.literal("admin-update-points"),
  playerId: z.string(),
  points: z.number(),
});

const DecideOutcomeMessageSchema = z.object({
  type: z.literal("admin-decide-outcome"),
  outcome: z.enum(["win", "lose"]),
});

export const MessageSchema = z.discriminatedUnion("type", [
  UpdateNameMessageSchema,
  BuzzMessageSchema,
  EnableBuzzersMessageSchema,
  ResetRoundMessageSchema,
  ResetGameMessageSchema,
  DecideOutcomeMessageSchema,
  AdminUpdateNameMessageSchema,
  AdminUpdatePointsMessageSchema,
]);

export type Message = z.infer<typeof MessageSchema>;

const UpdateRequestSchema = z.object({
  type: z.literal("update"),
  state: RoomSchema,
});

const ErrorRequestSchema = z.object({
  type: z.literal("error"),
  message: z.string(),
});

export const RequestSchema = z.discriminatedUnion("type", [
  UpdateRequestSchema,
  ErrorRequestSchema,
]);

export type UpdateRequest = z.infer<typeof UpdateRequestSchema>;
export type ErrorRequest = z.infer<typeof ErrorRequestSchema>;
export type Request = z.infer<typeof RequestSchema>;
