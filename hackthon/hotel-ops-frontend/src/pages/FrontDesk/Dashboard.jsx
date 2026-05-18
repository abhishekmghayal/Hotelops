import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RoomCard from '../../components/common/RoomCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/ui/Button';

export default function FrontDeskDashboard() {
  const { rooms, checkoutRoom, activities } = useAuth();
  const [filter, setFilter] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const filters = ['All', 'Occupied', 'Ready', 'Dirty', 'Cleaning'];

  const filteredRooms = rooms.filter(room => filter === 'All' || room.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Front Desk</h1>
          <p className="text-slate-500 mt-1">Manage check-ins, check-outs, and guest requests.</p>
        </div>
        <Button variant="primary" className="shadow-lg shadow-hotel-navy/20">+ Create Task</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Room Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === f ? 'bg-hotel-navy text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} onClick={setSelectedRoom} />
            ))}
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 sticky top-24">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Live Activity</h3>
            <div className="space-y-4">
              {activities.slice(0, 5).map(act => (
                <div key={act.id} className="flex gap-3 relative pb-4 last:pb-0">
                  <div className="absolute top-6 bottom-0 left-[11px] w-px bg-slate-100 last:hidden"></div>
                  <div className="w-6 h-6 rounded-full shrink-0 mt-0.5 z-10 flex items-center justify-center bg-slate-50 border border-slate-200">
                    <div className={`w-2 h-2 rounded-full ${act.type === 'checkout' ? 'bg-hotel-amber' : 'bg-hotel-emerald'}`}></div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">{act.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Room Action Modal */}
      <Modal 
        isOpen={!!selectedRoom} 
        onClose={() => setSelectedRoom(null)}
        title={`Room ${selectedRoom?.number} Details`}
      >
        {selectedRoom && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm text-slate-500">Current Status</p>
                <p className="text-lg font-bold text-slate-800">{selectedRoom.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Guest Name</p>
                <p className="text-lg font-bold text-slate-800">{selectedRoom.guestName || 'None'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedRoom.status === 'Ready' && (
                <Button variant="success" className="flex-1">Check In</Button>
              )}
              {selectedRoom.status === 'Occupied' && (
                <Button 
                  variant="danger" 
                  className="flex-1"
                  onClick={() => {
                    checkoutRoom(selectedRoom.number);
                    setSelectedRoom(null);
                  }}
                >
                  Check Out
                </Button>
              )}
              <Button variant="outline" className="flex-1">Mark Dirty</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
