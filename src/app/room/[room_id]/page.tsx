import { getRoom } from "@/api/room";
import Buzzer from "@/component/buzzer";
import BuzzerProgress from "@/component/buzzer-progress";
import PlayerControls from "@/component/player-info";
import PlayerList from "@/component/player-list";
import { RoomManager } from "@/component/room-context";
import { notFound } from "next/navigation";

type Params = Promise<{ room_id: string }>;

export default async function RoomPage({ params }: { params: Params }) {
  const { room_id } = await params;

  const room = await getRoom(room_id);

  if (!room) {
    notFound();
  }

  return (
    <RoomManager roomId={room_id} initialState={room}>
      <div className="w-full sm:w-lg mt-0 sm:mt-4 mx-auto flex flex-col space-y-4 p-2">
        <div className="bg-base-200 border-base-300 border rounded-lg p-4 shadow-sm">
          <PlayerControls />
        </div>
        <div className="p-4">
          <Buzzer />
        </div>
        <BuzzerProgress />

        <div className="bg-base-200 border-base-300 border rounded-lg p-4 shadow-sm">
          <PlayerList />
        </div>
      </div>
    </RoomManager>
  );
}
