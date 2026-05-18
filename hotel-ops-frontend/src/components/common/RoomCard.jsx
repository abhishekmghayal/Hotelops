import StatusBadge from './StatusBadge';
import { BedDouble, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function RoomCard({ room, onClick }) {
  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <div 
      onClick={() => onClick && onClick(room)}
      className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 group-hover:text-hotel-navy transition-colors">
            {room.number}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <BedDouble size={14} /> {room.type}
          </p>
        </div>
        <StatusBadge status={room.status} />
      </div>

      <div className={cn(
        "flex items-center gap-2 text-sm font-medium p-2 rounded-lg mt-4",
        room.guestName ? "bg-slate-50 text-slate-700" : "bg-slate-50/50 text-slate-400"
      )}>
        <User size={16} />
        {room.guestName ? room.guestName : 'Vacant'}
      </div>
    </div>
  );
}
