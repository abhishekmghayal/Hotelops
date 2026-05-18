import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ClipboardPlus, Wrench, LogIn, LogOut, Sparkles, CreditCard, Crown, Moon, Clock3, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RoomCard from '../../components/common/RoomCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/ui/Button';

const emptyTaskForm = {
  title: '',
  description: '',
  room: '',
  priority: 'Medium',
  type: 'Room Service',
};

const emptyMaintenanceForm = {
  title: '',
  description: '',
  room: '',
  priority: 'Medium',
};

const emptyGuestForm = {
  guestName: '',
  guestPhone: '',
  guestEmail: '',
  checkOutAt: '',
  adults: 1,
  children: 0,
  bookingSource: 'Walk-in',
  paymentStatus: 'Pending',
  vip: false,
  doNotDisturb: false,
  lateCheckout: false,
  notes: '',
};

export default function FrontDeskDashboard() {
  const location = useLocation();
  const {
    rooms,
    tasks,
    tickets,
    checkoutRoom,
    updateRoomStatus,
    createTask,
    createMaintenanceTicket,
    activities,
  } = useAuth();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestForm, setGuestForm] = useState(emptyGuestForm);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [maintenanceForm, setMaintenanceForm] = useState(emptyMaintenanceForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const filters = ['All', 'Ready', 'Occupied', 'Dirty', 'Maintenance'];
  const isCheckInView = location.pathname.includes('/checkin');
  const activeFilter = isCheckInView ? 'Ready' : filter;

  const roomCounts = useMemo(() => ({
    total: rooms.length,
    ready: rooms.filter(room => room.status === 'Ready').length,
    occupied: rooms.filter(room => room.status === 'Occupied').length,
    attention: rooms.filter(room => ['Dirty', 'Maintenance'].includes(room.status)).length,
    departures: rooms.filter(room => room.status === 'Occupied' && room.checkOutAt && isToday(room.checkOutAt)).length,
    unpaid: rooms.filter(room => room.status === 'Occupied' && room.paymentStatus !== 'Paid').length,
    vip: rooms.filter(room => room.status === 'Occupied' && room.vip).length,
  }), [rooms]);

  const filteredRooms = rooms.filter((room) => {
    const matchesFilter = activeFilter === 'All' || room.status === activeFilter;
    const searchText = `${room.number} ${room.type} ${room.status} ${room.guestName || ''} ${room.guestPhone || ''} ${room.guestEmail || ''} ${room.bookingSource || ''}`.toLowerCase();
    return matchesFilter && searchText.includes(query.toLowerCase());
  });

  const expectedDepartures = rooms
    .filter(room => room.status === 'Occupied' && room.checkOutAt)
    .sort((a, b) => new Date(a.checkOutAt) - new Date(b.checkOutAt))
    .slice(0, 5);

  const openRoom = (room) => {
    setSelectedRoom(room);
    setGuestForm({
      ...emptyGuestForm,
      guestName: room.guestName || '',
      guestPhone: room.guestPhone || '',
      guestEmail: room.guestEmail || '',
      checkOutAt: toDateInputValue(room.checkOutAt),
      adults: room.adults || 1,
      children: room.children || 0,
      bookingSource: room.bookingSource || 'Walk-in',
      paymentStatus: room.paymentStatus || 'Pending',
      vip: Boolean(room.vip),
      doNotDisturb: Boolean(room.doNotDisturb),
      lateCheckout: Boolean(room.lateCheckout),
      notes: room.notes || '',
    });
  };

  const openTaskModal = (room = selectedRoom) => {
    setTaskForm({
      ...emptyTaskForm,
      room: room?.id || '',
      title: room ? `Guest request for Room ${room.number}` : '',
    });
    setTaskModalOpen(true);
  };

  const openMaintenanceModal = (room = selectedRoom) => {
    setMaintenanceForm({
      ...emptyMaintenanceForm,
      room: room?.id || '',
      title: room ? `Maintenance issue in Room ${room.number}` : '',
    });
    setMaintenanceModalOpen(true);
  };

  const handleCheckIn = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    setMessage('');
    try {
      await updateRoomStatus(selectedRoom.id, 'Occupied', guestForm);
      setSelectedRoom(null);
      setMessage(`Room ${selectedRoom.number} checked in.`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStayDetails = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    setMessage('');
    try {
      await updateRoomStatus(selectedRoom.id, 'Occupied', guestForm);
      setSelectedRoom(null);
      setMessage(`Room ${selectedRoom.number} guest details updated.`);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    setMessage('');
    try {
      await checkoutRoom(selectedRoom.number);
      setSelectedRoom(null);
      setMessage(`Room ${selectedRoom.number} checked out and sent to housekeeping.`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await createTask({
        ...taskForm,
        title: taskForm.title || 'Guest request',
        description: taskForm.description || 'Front desk request',
        room: taskForm.room || undefined,
      });
      setTaskModalOpen(false);
      setTaskForm(emptyTaskForm);
      setMessage('Task created and sent to the operations queue.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateMaintenance = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await createMaintenanceTicket({
        ...maintenanceForm,
        title: maintenanceForm.title || 'Maintenance issue',
        description: maintenanceForm.description || 'Reported by front desk',
        room: maintenanceForm.room || undefined,
      });
      setMaintenanceModalOpen(false);
      setMaintenanceForm(emptyMaintenanceForm);
      setSelectedRoom(null);
      setMessage('Maintenance ticket created and room status updated.');
    } finally {
      setSaving(false);
    }
  };

  const recentTasks = tasks.filter(task => task.status !== 'Completed').slice(0, 4);
  const openTickets = tickets.filter(ticket => ticket.status !== 'Resolved').slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{isCheckInView ? 'Guest Check-in' : 'Front Desk'}</h1>
          <p className="text-slate-500 mt-1 font-medium">
            {isCheckInView ? 'Ready rooms are filtered for faster arrivals.' : 'Fast check-ins, guest requests, and room readiness from one desk view.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => openTaskModal(null)} variant="primary" className="shadow-lg shadow-hotel-navy/20 flex items-center gap-2">
            <ClipboardPlus size={18} /> Create Task
          </Button>
          <Button onClick={() => openMaintenanceModal(null)} variant="outline" className="flex items-center gap-2 bg-white">
            <Wrench size={18} /> Report Maintenance
          </Button>
        </div>
      </div>

      {message && (
        <div className="bg-hotel-emerald/10 border border-hotel-emerald/20 text-hotel-emerald font-semibold rounded-xl px-4 py-3">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Total Rooms', roomCounts.total, null],
          ['Ready Now', roomCounts.ready, null],
          ['Occupied', roomCounts.occupied, null],
          ['Due Out Today', roomCounts.departures, Clock3],
          ['Payment Pending', roomCounts.unpaid, CreditCard],
          ['VIP In House', roomCounts.vip, Crown],
          ['Needs Action', roomCounts.attention, Sparkles],
        ].map(([label, value, Icon]) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
              {Icon && <Icon size={18} className="text-slate-300" />}
            </div>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-3">
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4">
              <Search size={18} className="text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by room, guest, status..."
                className="w-full bg-transparent outline-none px-3 py-2.5 text-sm font-medium text-slate-700"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeFilter === f ? 'bg-hotel-navy text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} onClick={openRoom} />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="bg-white border border-slate-100 border-dashed rounded-2xl p-10 text-center">
              <p className="font-semibold text-slate-600">No rooms match this search.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-extrabold text-lg text-slate-800 mb-4">Expected Departures</h3>
            <div className="space-y-3">
              {expectedDepartures.map(room => (
                <button key={room.id} onClick={() => openRoom(room)} className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <p className="text-sm font-bold text-slate-800">Room {room.number} · {room.guestName}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(room.checkOutAt)} · {room.paymentStatus}</p>
                </button>
              ))}
              {expectedDepartures.length === 0 && <p className="text-sm text-slate-500">No scheduled departures.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-extrabold text-lg text-slate-800 mb-4">Open Work</h3>
            <div className="space-y-3">
              {recentTasks.map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-bold text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-1">Room {task.room} · {task.priority}</p>
                </div>
              ))}
              {recentTasks.length === 0 && <p className="text-sm text-slate-500">No pending tasks.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-extrabold text-lg text-slate-800 mb-4">Maintenance Watch</h3>
            <div className="space-y-3">
              {openTickets.map(ticket => (
                <div key={ticket.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-bold text-slate-800">{ticket.title}</p>
                  <p className="text-xs text-slate-500 mt-1">Room {ticket.room} · {ticket.status}</p>
                </div>
              ))}
              {openTickets.length === 0 && <p className="text-sm text-slate-500">No open tickets.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-extrabold text-lg text-slate-800 mb-4">Live Activity</h3>
            <div className="space-y-4">
              {activities.slice(0, 5).map(act => (
                <div key={act.id} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center bg-slate-50 border border-slate-200">
                    <div className={`w-2 h-2 rounded-full ${act.type === 'checkout' ? 'bg-hotel-amber' : 'bg-hotel-emerald'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">{act.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && <p className="text-sm text-slate-500">Activity will appear here as the desk works.</p>}
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={!!selectedRoom} 
        onClose={() => setSelectedRoom(null)}
        title={`Room ${selectedRoom?.number} Details`}
      >
        {selectedRoom && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold">Status</p>
                <p className="text-lg font-bold text-slate-800">{selectedRoom.status}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold">Guest</p>
                <p className="text-lg font-bold text-slate-800">{selectedRoom.guestName || 'Vacant'}</p>
              </div>
            </div>

            {selectedRoom.status === 'Occupied' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedRoom.vip && <InfoPill icon={Crown} label="VIP" tone="gold" />}
                {selectedRoom.doNotDisturb && <InfoPill icon={Moon} label="DND" tone="slate" />}
                {selectedRoom.lateCheckout && <InfoPill icon={Clock3} label="Late checkout" tone="sky" />}
                <InfoPill icon={CreditCard} label={selectedRoom.paymentStatus} tone={selectedRoom.paymentStatus === 'Paid' ? 'green' : 'red'} />
              </div>
            )}

            {['Ready', 'Occupied'].includes(selectedRoom.status) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput label="Guest Name" value={guestForm.guestName} onChange={(value) => setGuestForm(prev => ({ ...prev, guestName: value }))} placeholder="Walk-in guest" />
                  <FormInput label="Phone" value={guestForm.guestPhone} onChange={(value) => setGuestForm(prev => ({ ...prev, guestPhone: value }))} placeholder="Optional" />
                  <FormInput label="Email" type="email" value={guestForm.guestEmail} onChange={(value) => setGuestForm(prev => ({ ...prev, guestEmail: value }))} placeholder="guest@example.com" />
                  <FormInput label="Departure" type="date" value={guestForm.checkOutAt} onChange={(value) => setGuestForm(prev => ({ ...prev, checkOutAt: value }))} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <FormInput label="Adults" type="number" value={guestForm.adults} onChange={(value) => setGuestForm(prev => ({ ...prev, adults: value }))} />
                  <FormInput label="Children" type="number" value={guestForm.children} onChange={(value) => setGuestForm(prev => ({ ...prev, children: value }))} />
                  <FormSelect label="Source" value={guestForm.bookingSource} onChange={(value) => setGuestForm(prev => ({ ...prev, bookingSource: value }))}>
                    <option>Walk-in</option>
                    <option>Website</option>
                    <option>OTA</option>
                    <option>Corporate</option>
                    <option>Phone</option>
                  </FormSelect>
                  <FormSelect label="Payment" value={guestForm.paymentStatus} onChange={(value) => setGuestForm(prev => ({ ...prev, paymentStatus: value }))}>
                    <option>Pending</option>
                    <option>Authorized</option>
                    <option>Paid</option>
                  </FormSelect>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormCheckbox label="VIP Guest" checked={guestForm.vip} onChange={(value) => setGuestForm(prev => ({ ...prev, vip: value }))} />
                  <FormCheckbox label="Do Not Disturb" checked={guestForm.doNotDisturb} onChange={(value) => setGuestForm(prev => ({ ...prev, doNotDisturb: value }))} />
                  <FormCheckbox label="Late Checkout" checked={guestForm.lateCheckout} onChange={(value) => setGuestForm(prev => ({ ...prev, lateCheckout: value }))} />
                </div>
                <FormTextarea label="Stay Notes" value={guestForm.notes} onChange={(value) => setGuestForm(prev => ({ ...prev, notes: value }))} placeholder="Preferences, billing notes, special requests..." />
              </div>
            )}

            <div className="sticky bottom-0 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white pt-4 border-t border-slate-100">
              {selectedRoom.status === 'Ready' && (
                <Button disabled={saving} variant="success" onClick={handleCheckIn} className="flex items-center justify-center gap-2">
                  <LogIn size={18} /> Check In
                </Button>
              )}
              {selectedRoom.status === 'Occupied' && (
                <Button disabled={saving} variant="danger" onClick={handleCheckout} className="flex items-center justify-center gap-2">
                  <LogOut size={18} /> Check Out
                </Button>
              )}
              {selectedRoom.status === 'Occupied' && (
                <Button disabled={saving} variant="success" onClick={handleSaveStayDetails} className="flex items-center justify-center gap-2">
                  <Save size={18} /> Save Details
                </Button>
              )}
              <Button disabled={saving} variant="outline" onClick={() => openTaskModal(selectedRoom)} className="flex items-center justify-center gap-2">
                <ClipboardPlus size={18} /> Guest Task
              </Button>
              <Button disabled={saving} variant="outline" onClick={() => openMaintenanceModal(selectedRoom)} className="flex items-center justify-center gap-2">
                <Wrench size={18} /> Maintenance
              </Button>
              <Button 
                disabled={saving} 
                variant="outline" 
                onClick={async () => {
                  setSaving(true);
                  try {
                    await updateRoomStatus(selectedRoom.id, 'Dirty');
                    setSelectedRoom(null);
                    setMessage(`Room ${selectedRoom.number} sent to housekeeping.`);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="sm:col-span-2 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Mark Dirty / Request Cleaning
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} title="Create Guest Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <FormInput label="Title" value={taskForm.title} onChange={(value) => setTaskForm(prev => ({ ...prev, title: value }))} placeholder="Extra towels, luggage help..." />
          <FormSelect label="Room" value={taskForm.room} onChange={(value) => setTaskForm(prev => ({ ...prev, room: value }))}>
            <option value="">No room</option>
            {rooms.map(room => <option key={room.id} value={room.id}>Room {room.number}</option>)}
          </FormSelect>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="Type" value={taskForm.type} onChange={(value) => setTaskForm(prev => ({ ...prev, type: value }))}>
              <option>Room Service</option>
              <option>Cleaning</option>
              <option>Other</option>
            </FormSelect>
            <FormSelect label="Priority" value={taskForm.priority} onChange={(value) => setTaskForm(prev => ({ ...prev, priority: value }))}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </FormSelect>
          </div>
          <FormTextarea label="Details" value={taskForm.description} onChange={(value) => setTaskForm(prev => ({ ...prev, description: value }))} placeholder="Add the guest request details." />
          <Button disabled={saving} type="submit" className="w-full py-3">Create Task</Button>
        </form>
      </Modal>

      <Modal isOpen={maintenanceModalOpen} onClose={() => setMaintenanceModalOpen(false)} title="Report Maintenance">
        <form onSubmit={handleCreateMaintenance} className="space-y-4">
          <FormInput label="Issue" value={maintenanceForm.title} onChange={(value) => setMaintenanceForm(prev => ({ ...prev, title: value }))} placeholder="AC not cooling, leak, light issue..." />
          <FormSelect label="Room" value={maintenanceForm.room} onChange={(value) => setMaintenanceForm(prev => ({ ...prev, room: value }))}>
            <option value="">No room</option>
            {rooms.map(room => <option key={room.id} value={room.id}>Room {room.number}</option>)}
          </FormSelect>
          <FormSelect label="Priority" value={maintenanceForm.priority} onChange={(value) => setMaintenanceForm(prev => ({ ...prev, priority: value }))}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </FormSelect>
          <FormTextarea label="Details" value={maintenanceForm.description} onChange={(value) => setMaintenanceForm(prev => ({ ...prev, description: value }))} placeholder="Describe what the guest or staff reported." />
          <Button disabled={saving} type="submit" className="w-full py-3">Create Ticket</Button>
        </form>
      </Modal>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-hotel-navy"
      />
    </label>
  );
}

function FormCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-hotel-navy focus:ring-hotel-navy"
      />
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </label>
  );
}

function InfoPill({ icon: Icon, label, tone }) {
  const tones = {
    gold: 'bg-hotel-gold/10 text-hotel-gold border-hotel-gold/20',
    green: 'bg-hotel-emerald/10 text-hotel-emerald border-hotel-emerald/20',
    red: 'bg-hotel-red/10 text-hotel-red border-hotel-red/20',
    sky: 'bg-hotel-sky/10 text-hotel-sky border-hotel-sky/20',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${tones[tone] || tones.slate}`}>
      <Icon size={14} /> {label}
    </div>
  );
}

function toDateInputValue(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function FormSelect({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-hotel-navy bg-white"
      >
        {children}
      </select>
    </label>
  );
}

function FormTextarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-hotel-navy resize-none"
      />
    </label>
  );
}
