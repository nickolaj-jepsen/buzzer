import { createRoom } from "@/api/room";
import { randomRoomId } from "@/utils/random";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-2">
      <div className="card bg-base-200 shadow-sm w-fill">
        <div className="card-body">
          <div className="flex flex-col items-center">
            <h2 className="card-title">Buzzer</h2>
            <p>Host your own realtime quiz</p>
            <form
              action={async (formData: FormData) => {
                "use server";
                const roomId =
                  (formData.get("roomId") as string | null)?.trim() ||
                  randomRoomId();
                await createRoom(roomId);
                redirect(`/room/${roomId}`);
              }}
              className="flex flex-col space-y-2 w-full mt-2"
            >
              <label className="floating-label">
                <span className="label-text">Room ID (optional)</span>
                <input
                  type="text"
                  name="roomId"
                  className="input input-bordered w-full"
                  placeholder="Room ID (optional)"
                />
              </label>
              <span className="text-xs text-gray-500">
                Leave empty for a random room ID
              </span>
              <input
                type="submit"
                className="btn btn-primary"
                value="Join/Create Room"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
