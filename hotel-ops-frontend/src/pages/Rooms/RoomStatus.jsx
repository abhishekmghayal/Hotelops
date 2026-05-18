import { useAuth } from '../../context/AuthContext';
import RoomCard from '../../components/common/RoomCard';

export default function RoomStatus() {
  const { rooms } = useAuth();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Room Status Map</h1>
        <p className="text-slate-500 mt-1">Live view of all property units.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
