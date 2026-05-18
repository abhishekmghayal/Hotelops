import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RoomCard from '../../components/common/RoomCard';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoomStatus() {
  const { rooms } = useAuth();
  const [filter, setFilter] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const statuses = ['All', 'Ready', 'Occupied', 'Dirty', 'Cleaning', 'Maintenance'];
  
  const filteredRooms = rooms.filter(r => filter === 'All' ? true : r.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Room Status Map</h1>
          <p className="text-slate-500 mt-1">Live view of all property units.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto w-full sm:w-auto">
          <div className="px-3 text-slate-400">
            <Filter size={16} />
          </div>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                filter === s 
                  ? 'bg-hotel-navy text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence>
          {filteredRooms.map(room => (
            <motion.div
              key={room.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <RoomCard room={room} onClick={setSelectedRoom} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredRooms.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
          <p className="text-slate-500 font-medium">No rooms match the selected filter.</p>
        </div>
      )}

      {/* Room Detail Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoom(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800">Room {selectedRoom.number}</h2>
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 bg-white text-slate-400 hover:text-slate-700 rounded-full shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Current Status</span>
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-hotel-navy text-white">
                    {selectedRoom.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Room Type</p>
                    <p className="font-semibold text-slate-800">{selectedRoom.type}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Guest</p>
                    <p className="font-semibold text-slate-800">{selectedRoom.guestName || 'None'}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="w-full py-3 bg-hotel-gold text-hotel-navy font-bold rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 transition-transform"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
