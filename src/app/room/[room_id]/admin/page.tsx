import { getRoom } from "@/api/room";
import AdminControls from "@/component/admin-control";
import AdminList from "@/component/admin-list";
import BuzzerProgress from "@/component/buzzer-progress";
import { CopyField } from "@/component/copy-field";
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
      <div className="w-full sm:w-lg mt-0 sm:mt-4 mx-auto flex flex-col space-y-4 p-2">
        <div className="bg-base-200 border-base-300 border rounded-lg p-4 shadow-sm">
          <AdminControls />
        </div>
        <BuzzerProgress />
        <div className="bg-base-200 border-base-300 border rounded-lg p-4 shadow-sm">
          <AdminList />
        </div>

        <details className="collapse collapse-arrow bg-base-200 border-base-300 border">
          <summary className="collapse-title font-semibold">
            Join options
          </summary>
          <div className="collapse-content">
            <p className="text-center">Visit this site and enter the room ID</p>
            <CopyField value={room_id} className="mt-2 w-full" />
            <div className="divider">OR</div>
            <p className="text-center">Directly using this link</p>
            <CopyField
              value={`${baseUrl()}/room/${room_id}`}
              className="mt-2 w-full"
            />
            <div className="divider">OR</div>
            <p className="text-center">Using this QR code</p>
            <QRCode
              className="mx-auto my-2"
              value={`${baseUrl()}/room/${room_id}`}
            ></QRCode>
          </div>
        </details>
      </div>
    </RoomManager>
  );
}
