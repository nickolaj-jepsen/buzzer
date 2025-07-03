"use client";

import { PARTYKIT_HOST } from "@/app/env";
import { RequestSchema } from "@/dto/messages";
import { Player, Room } from "@/dto/room";
import { usePersistantId } from "@/hooks/use-persistant-id";
import usePartySocket from "partysocket/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast/headless";
import { useRouter, usePathname } from "next/navigation";

interface RoomContextType {
  roomId: string;
  state: Room;
  me: Player | undefined;
  positions: Record<string, number>;
  updateName: (name: string) => void;
  buzz: () => void;
  isAdmin: boolean | null;
  admin: {
    enableBuzzers: () => void;
    decideOutcome: (outcome: "win" | "lose") => void;
    resetRound: () => void;
    resetGame: () => void;
    setName: (playerId: string, name: string) => void;
    setPoints: (playerId: string, points: number) => void;
  };
}

export const RoomContext = createContext<RoomContextType | undefined>(
  undefined,
);

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) throw new Error("useRoom must be used within a RoomManager");
  return context;
};

interface RoomManagerProps {
  children: React.ReactNode;
  roomId: string;
  initialState: Room;
}

export const RoomManager = ({
  children,
  roomId,
  initialState,
}: RoomManagerProps) => {
  const persistantId = usePersistantId();
  const [state, setState] = useState<Room>(initialState);
  const pathname = usePathname();
  const router = useRouter();

  const socket = usePartySocket({
    id: persistantId ?? undefined,
    host: PARTYKIT_HOST,
    room: roomId,
    onMessage(event) {
      const message = RequestSchema.safeParse(JSON.parse(event.data));
      if (!message.success) {
        console.error("Invalid message format:", event.data);
        return;
      }
      if (message.data.type === "update") {
        setState(message.data.state);
      }
      if (message.data.type === "error") {
        toast.error(message.data.message);
      }
    },
  });

  const me = useMemo(() => {
    return state.players.find((p) => p.id === persistantId);
  }, [state.players, persistantId]);

  const positions = useMemo(() => {
    let pos = 1;
    let prevPoints: number | null = null;
    const result: Record<string, number> = {};

    state.players.forEach((player, idx) => {
      if (player.points !== prevPoints) {
        pos = idx + 1;
        prevPoints = player.points;
      }
      result[player.id] = pos;
    });

    return result;
  }, [state.players]);

  const isAdmin = useMemo(() => {
    if (!persistantId || state.adminId === null) return null;
    return state.adminId === persistantId;
  }, [state.adminId, persistantId]);

  useEffect(() => {
    // Workaround: Navigate to user to the correct page based on admin status
    if (isAdmin === null) return;
    const isAdminPath = pathname.startsWith("/room/" + roomId + "/admin");
    if (!isAdmin && isAdminPath) {
      console.warn("Redirecting to room page as user is not admin");
      router.push("/room/" + roomId);
    } else if (isAdmin && !isAdminPath) {
      console.warn("Redirecting to admin page as user is admin");
      router.push("/room/" + roomId + "/admin");
    }
  }, [isAdmin, me, pathname, roomId, router]);

  const updateName = useCallback(
    (name: string) => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: "update-name",
          name,
        }),
      );
    },
    [socket],
  );

  const buzz = useCallback(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "buzz",
      }),
    );
  }, [socket]);

  const enableBuzzers = useCallback(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "admin-enable-buzzers",
      }),
    );
  }, [socket]);

  const decideOutcome = useCallback(
    (outcome: "win" | "lose") => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: "admin-decide-outcome",
          outcome,
        }),
      );
    },
    [socket],
  );

  const resetRound = useCallback(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "admin-reset-round",
      }),
    );
  }, [socket]);

  const resetGame = useCallback(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "admin-reset-game",
      }),
    );
  }, [socket]);

  const setName = useCallback(
    (playerId: string, name: string) => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: "admin-update-name",
          name,
          playerId,
        }),
      );
    },
    [socket],
  );

  const setPoints = useCallback(
    (playerId: string, points: number) => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: "admin-update-points",
          playerId,
          points,
        }),
      );
    },
    [socket],
  );

  return (
    <RoomContext.Provider
      value={{
        roomId,
        positions,
        isAdmin,
        state,
        me,
        updateName,
        buzz,
        admin: {
          enableBuzzers,
          decideOutcome,
          resetRound,
          resetGame,
          setName,
          setPoints,
        },
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
