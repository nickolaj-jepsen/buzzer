import type { Player, Room, RoomState } from "@/dto/room";
import { ErrorRequest, MessageSchema, UpdateRequest } from "@/dto/messages";
import type * as Party from "partykit/server";
import { randomUsername } from "@/utils/random";

class StateManager {
  id: string;
  players: Record<string, Player> = {};
  adminId: string | null = null;
  state: RoomState = { type: "lobby" };
  disconnectedPlayers: Record<string, Player> = {};

  constructor(id: string) {
    this.id = id;
  }

  updatePlayerName(id: string, name: string) {
    const player = this.players[id];
    if (player) {
      player.name = name;
    }
  }

  updatePlayerPoints(id: string, points: number) {
    const player = this.players[id];
    if (player) {
      player.points = points;
    }
  }

  connectPlayer(id: string) {
    // Check if the player is already connected
    if (this.players[id]) {
      // If the player is already connected, just return
      return;
    }

    // Check if the player is in the disconnected players map
    if (this.disconnectedPlayers[id]) {
      this.players[id] = this.disconnectedPlayers[id];
      delete this.disconnectedPlayers[id];
      return;
    }

    // If the player is not found in disconnected players, create a new one
    const playerCount =
      Object.keys(this.players).length +
      Object.keys(this.disconnectedPlayers).length;
    this.players[id] = {
      name: randomUsername(),
      admin: playerCount === 0, // First player is admin
      points: 0,
      id,
    };
  }

  isAdmin(id: string): boolean {
    const player = this.players[id];
    return player ? player.admin : false;
  }

  disconnectPlayer(id: string) {
    if (this.players[id]) {
      this.disconnectedPlayers[id] = this.players[id];
      delete this.players[id];
    }
  }

  /**
   * Player buzzes in
   *
   * @param id Player ID
   * @returns Whether the buzz was successful
   */
  buzzIn(id: string): boolean {
    const player = this.players[id];
    if (!player) {
      return false;
    }
    if (this.state.type !== "ready") {
      return false; // Only allow buzzing in when the state is "ready"
    }
    this.state = {
      type: "buzzed-in",
      player: { ...player }, // Spread to avoid reference issues
    };
    return true;
  }

  resetRound() {
    this.state = { type: "waiting" }; // Reset state to waiting
  }

  resetGame() {
    this.state = { type: "lobby" }; // Reset the game state
    Object.keys(this.players).forEach((id) => {
      this.players[id].points = 0; // Reset points for all players
    });
    this.disconnectedPlayers = {}; // Clear disconnected players
  }

  decideOutcome(outcome: "win" | "lose") {
    if (this.state.type !== "buzzed-in") {
      throw new Error("Cannot decide outcome when no one has buzzed in");
    }

    const playerId = this.state.player.id;
    const player = this.players[playerId];
    if (!player) {
      throw new Error("Player not found");
    }

    if (outcome === "win") {
      player.points += 1; // Increment points for the player
      this.state = { type: "waiting" }; // Wait for admin to enable buzzers again
    } else {
      this.state = { type: "ready" }; // If they lose, we re-prime the state
    }
  }

  get json(): Room {
    const admin = Object.values(this.players).find((p) => p.admin);

    const players = Object.values(this.players)
      .filter((p) => !p.admin)
      .sort((a, b) => {
        if (a.points !== b.points) {
          return b.points - a.points; // Descending order
        }

        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });

    return {
      id: this.id,
      players,
      state: this.state,
      adminId: admin ? admin.id : null,
    };
  }
}

export default class Server implements Party.Server {
  state: StateManager;

  constructor(readonly room: Party.Room) {
    this.state = new StateManager(room.id);
  }

  #broadcastUpdate(without?: string[]) {
    console.log(`Broadcasting update to room ${this.room.id}`);
    this.room.broadcast(
      JSON.stringify({
        type: "update",
        state: this.state.json,
      } satisfies UpdateRequest),
      without,
    );
  }

  #reportError(message: string, conn: Party.Connection) {
    console.error(`Error in room ${this.room.id}`, message);
    if (conn) {
      conn.send(
        JSON.stringify({
          type: "error",
          message: message,
        } satisfies ErrorRequest),
      );
    }
  }

  onRequest(req: Party.Request) {
    if (req.method === "GET") {
      return new Response(JSON.stringify(this.state.json), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET" },
    });
  }

  onConnect(conn: Party.Connection) {
    this.state.connectPlayer(conn.id);
    this.#broadcastUpdate();
  }

  onClose(conn: Party.Connection) {
    console.log(`Connection ${conn.id} disconnected`);
    this.state.disconnectPlayer(conn.id);
    this.#broadcastUpdate([conn.id]);
  }

  checkAdmin(conn: Party.Connection): boolean {
    if (this.state.isAdmin(conn.id)) {
      return true;
    }
    this.#reportError("You are not an admin", conn);
    return false;
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    const parsedMessage = MessageSchema.safeParse(JSON.parse(message));
    if (!parsedMessage.success) {
      console.error(
        `Invalid message from ${sender.id}: ${message}`,
        parsedMessage.error,
      );
      return;
    }

    if (parsedMessage.data.type === "update-name") {
      this.state.updatePlayerName(sender.id, parsedMessage.data.name);
    } else if (parsedMessage.data.type === "buzz") {
      if (!this.state.buzzIn(sender.id)) {
        this.#reportError("You cannot buzz in at this time", sender);
        return;
      }
    } else if (parsedMessage.data.type === "admin-enable-buzzers") {
      if (!this.checkAdmin(sender)) return;

      this.state.state = { type: "ready" }; // Set state to ready
    } else if (parsedMessage.data.type === "admin-decide-outcome") {
      if (!this.checkAdmin(sender)) return;

      try {
        this.state.decideOutcome(parsedMessage.data.outcome);
      } catch (error) {
        this.#reportError((error as Error).message, sender);
        return;
      }
    } else if (parsedMessage.data.type === "admin-reset-round") {
      if (!this.checkAdmin(sender)) return;

      this.state.resetRound();
    } else if (parsedMessage.data.type === "admin-reset-game") {
      if (!this.checkAdmin(sender)) return;

      this.state.resetGame();
    } else if (parsedMessage.data.type === "admin-update-name") {
      if (!this.checkAdmin(sender)) return;

      this.state.updatePlayerName(
        parsedMessage.data.playerId,
        parsedMessage.data.name,
      );
    } else if (parsedMessage.data.type === "admin-update-points") {
      if (!this.checkAdmin(sender)) return;

      this.state.updatePlayerPoints(
        parsedMessage.data.playerId,
        parsedMessage.data.points,
      );
    }

    this.#broadcastUpdate();
  }
}

Server satisfies Party.Worker;
