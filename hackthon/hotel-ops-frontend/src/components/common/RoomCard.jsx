import StatusBadge from './StatusBadge';
import { BedDouble, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function RoomCard({ room, onClick }) {
  const cn = (...inputs) => twMerge(clsx(inputs));

  const getStatusBorder = (status) => {
    switch (status) {
      case 'Ready': return 'border-hotel-emerald/30 group-hover:border-hotel-emerald';
      case 'Dirty': return 'border-hotel-red/30 group-hover:border-hotel-red';
      case 'Cleaning': return 'border-hotel-amber/30 group-hover:border-hotel-amber';
      case 'Maintenance': return 'border-hotel-amber/30 group-hover:border-hotel-amber';
      case 'Occupied': return 'border-hotel-sky/30 group-hover:border-hotel-sky';
      default: return 'border-slate-200 group-hover:border-hotel-navy/30';
    }
  };

  return (
    <div 
      onClick={() => onClick && onClick(room)}
      className={cn(
        "bg-white rounded-[1.25rem] p-5 border-2 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 relative overflow-hidden",
        getStatusBorder(room.status)
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-extrabold text-slate-800 group-hover:text-hotel-navy transition-colors tracking-tight">
            {room.number}
          </h3>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
            <BedDouble size={16} className="text-slate-400 group-hover:text-hotel-gold transition-colors" /> {room.type}
          </p>
        </div>
        <StatusBadge status={room.status} className="shadow-sm" />
      </div>

      <div className={cn(
        "flex items-center gap-2.5 text-sm font-semibold p-3 rounded-xl transition-colors",
        room.guestName ? "bg-hotel-navy/5 text-hotel-navy" : "bg-slate-50 text-slate-400"
      )}>
        <User size={18} className={room.guestName ? "text-hotel-navy/70" : "text-slate-300"} />
        {room.guestName ? room.guestName : 'Vacant'}
      </div>
    </div>
  );
}
