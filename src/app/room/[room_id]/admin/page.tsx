import { getRoom } from "@/api/room";
import AdminControls from "@/component/admin-control";
import AdminList from "@/component/admin-list";
import BuzzerProgress from "@/component/buzzer-progress";
import { RoomManager } from "@/component/room-context";
import { baseUrl } from "@/utils/url";
import { notFound } from "next/navigation";
import QRCode from "react-qr-code";

type Params = Promise<{ room_id: string }>;

export default async function RoomPage({ params }: { params: Params }) {
  const { room_id } = await params;

  const room = await getRoom(room_id);

  if (!room) {
    notFound();
  }

  return (
    <RoomManager roomId={room_id} initialState={room}>
      <div className="w-fill sm:w-lg mt-0 sm:mt-4 mx-auto flex flex-col space-y-4 p-2">
        <div className="bg-base-200 border-base-300 border rounded-lg p-4 shadow-sm">
          <AdminControls />
        </div>
        <BuzzerProgress />
        <div className="bg-base-200 border-base-300 border rounded-lg p-4 shadow-sm">
          <AdminList />
        </div>

        <details className="collapse collapse-arrow bg-base-200 border-base-300 border">
          <summary className="collapse-title font-semibold">
            Show QR Code
          </summary>
          <div className="collapse-content text-sm">
            <QRCode
              className="mx-auto"
              value={`${baseUrl()}/room/${room_id}`}
            ></QRCode>
          </div>
        </details>
      </div>
    </RoomManager>
  );
}
