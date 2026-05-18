import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import { AlertTriangle, CheckCircle2, Package, PenTool, Play, Plus, Save, Search, Settings, ShieldAlert } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';

const emptyTicketForm = {
  title: '',
  description: '',
  room: '',
  priority: 'Medium',
  category: 'General',
  asset: '',
  locationNote: '',
  vendorRequired: false,
  safetyLockout: false,
};

export default function MaintenanceDashboard() {
  const { rooms, tickets, createMaintenanceTicket, updateTicketStatus } = useAuth();
  const [activeTicket, setActiveTicket] = useState(null);
  const [workForm, setWorkForm] = useState(getWorkForm({}));
  const [createOpen, setCreateOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState(emptyTicketForm);
  const [filter, setFilter] = useState('Open');
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const visibleTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        if (filter === 'Open') return ticket.status !== 'Resolved';
        if (filter === 'All') return true;
        return ticket.status === filter || ticket.priority === filter;
      })
      .filter((ticket) => `${ticket.title} ${ticket.description} ${ticket.room} ${ticket.priority} ${ticket.category} ${ticket.asset}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
      });
  }, [tickets, filter, query]);

  const openTickets = tickets.filter(t => t.status !== 'Resolved');
  const critical = openTickets.filter(t => t.priority === 'Critical').length;
  const inProgress = openTickets.filter(t => t.status === 'In Progress').length;
  const waitingParts = openTickets.filter(t => t.status === 'Waiting Parts').length;

  const openTicket = (ticket) => {
    setActiveTicket(ticket);
    setWorkForm(getWorkForm(ticket));
  };

  const saveWork = async (status = activeTicket.status) => {
    if (!activeTicket) return;
    setSaving(true);
    const updated = await updateTicketStatus(activeTicket.id, status, workForm);
    if (updated) openTicket(updated);
    setSaving(false);
  };

  const handleCreateTicket = async (event) => {
    event.preventDefault();
    setSaving(true);
    await createMaintenanceTicket({
      ...ticketForm,
      title: ticketForm.title || 'Maintenance issue',
      description: ticketForm.description || 'Maintenance issue reported by technician',
      room: ticketForm.room || undefined,
    });
    setTicketForm(emptyTicketForm);
    setCreateOpen(false);
    setSaving(false);
  };

  if (activeTicket) {
    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
        <button onClick={() => setActiveTicket(null)} className="text-hotel-navy font-semibold text-sm mb-3 text-left">
          Back to Work Orders
        </button>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5 flex-1 overflow-y-auto">
          <div className="flex justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">Room {activeTicket.room}</h2>
              <p className="text-sm text-slate-500">{activeTicket.title}</p>
            </div>
            <span className={`h-fit px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(activeTicket.priority)}`}>{activeTicket.priority}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Info label="Status" value={activeTicket.status} />
            <Info label="Category" value={activeTicket.category || 'General'} />
            <Info label="Asset" value={activeTicket.asset || 'Not set'} />
            <Info label="Reported" value={activeTicket.reportedTime} />
          </div>

          {(activeTicket.safetyLockout || activeTicket.vendorRequired) && (
            <div className="grid grid-cols-1 gap-2">
              {activeTicket.safetyLockout && <Flag icon={ShieldAlert} text="Safety lockout required" danger />}
              {activeTicket.vendorRequired && <Flag icon={Package} text="Vendor support may be needed" />}
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold uppercase text-slate-400 mb-1">Reported Issue</p>
            <p className="text-slate-700 font-medium">{activeTicket.description}</p>
            {activeTicket.locationNote && <p className="text-xs text-slate-400 mt-2">{activeTicket.locationNote}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ActionButton disabled={saving} onClick={() => saveWork('In Progress')} icon={Play} label="Start" primary />
            <ActionButton disabled={saving} onClick={() => saveWork('Waiting Parts')} icon={Package} label="Waiting Parts" />
            <ActionButton disabled={saving} onClick={() => saveWork()} icon={Save} label="Save Work" />
            <ActionButton disabled={saving} onClick={() => saveWork('Resolved')} icon={CheckCircle2} label="Resolve" success />
          </div>

          <Field label="Diagnosis" value={workForm.diagnosis} onChange={(value) => setWorkForm(prev => ({ ...prev, diagnosis: value }))} placeholder="What is causing the issue?" />
          <Field label="Parts Used / Needed" value={workForm.partsUsed} onChange={(value) => setWorkForm(prev => ({ ...prev, partsUsed: value }))} placeholder="Filter, bulb, gasket, valve..." />
          <div className="grid grid-cols-2 gap-3">
            <SmallInput label="Cost" type="number" value={workForm.estimatedCost} onChange={(value) => setWorkForm(prev => ({ ...prev, estimatedCost: value }))} />
            <SmallInput label="Labor Min" type="number" value={workForm.laborMinutes} onChange={(value) => setWorkForm(prev => ({ ...prev, laborMinutes: value }))} />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <CheckField label="Vendor Required" checked={workForm.vendorRequired} onChange={(value) => setWorkForm(prev => ({ ...prev, vendorRequired: value }))} />
            <CheckField label="Safety Lockout" checked={workForm.safetyLockout} onChange={(value) => setWorkForm(prev => ({ ...prev, safetyLockout: value }))} />
            <CheckField label="Follow Up Required" checked={workForm.followUpRequired} onChange={(value) => setWorkForm(prev => ({ ...prev, followUpRequired: value }))} />
          </div>
          <Field label="Follow-up Notes" value={workForm.followUpNotes} onChange={(value) => setWorkForm(prev => ({ ...prev, followUpNotes: value }))} placeholder="What needs to happen later?" />
          <Field label="Resolution Notes" value={workForm.resolutionNotes} onChange={(value) => setWorkForm(prev => ({ ...prev, resolutionNotes: value }))} placeholder="What was fixed or what follow-up is needed?" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="bg-hotel-navy p-6 rounded-2xl text-white">
        <div className="flex justify-between gap-4 items-start">
          <div>
            <h2 className="text-xl font-bold mb-2">Maintenance Command</h2>
            <p className="text-slate-300">{openTickets.length} open · {inProgress} in progress · {waitingParts} waiting parts</p>
          </div>
          <button onClick={() => setCreateOpen(true)} className="bg-white text-hotel-navy rounded-xl px-3 py-2 font-bold flex items-center gap-1">
            <Plus size={17} /> New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Metric label="Open" value={openTickets.length} />
        <Metric label="Started" value={inProgress} />
        <Metric label="Parts" value={waitingParts} />
        <Metric label="Critical" value={critical} danger />
      </div>

      <div className="flex items-center bg-white border border-slate-100 rounded-2xl px-3 py-2 shadow-sm">
        <Search size={17} className="text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 bg-transparent outline-none px-2 text-sm font-medium" placeholder="Search room, issue, category..." />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {['Open', 'Critical', 'In Progress', 'Waiting Parts', 'Resolved', 'All'].map(item => (
          <button key={item} onClick={() => setFilter(item)} className={`px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${filter === item ? 'bg-hotel-navy text-white' : 'bg-white text-slate-600 border border-slate-100'}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visibleTickets.map(ticket => (
          <div key={ticket.id} onClick={() => openTicket(ticket)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  {ticket.priority === 'Critical' ? <AlertTriangle size={20} /> : <Settings size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Room {ticket.room}</h3>
                  <p className="text-sm text-slate-500 font-medium">{ticket.status} · {ticket.category || 'General'}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl mt-4 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">{ticket.title}</p>
              <p className="text-slate-700 font-medium">{ticket.description}</p>
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-500">
              <span>{ticket.asset || 'No asset set'}</span>
              <span className="text-hotel-navy font-bold flex items-center"><PenTool size={15} className="mr-1" /> Open</span>
            </div>
          </div>
        ))}

        {visibleTickets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <CheckCircle2 size={48} className="mx-auto text-hotel-emerald mb-3 opacity-50" />
            <p className="text-slate-500 font-medium text-lg">No work orders match this view.</p>
          </div>
        )}
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Work Order">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <SmallInput label="Issue" value={ticketForm.title} onChange={(value) => setTicketForm(prev => ({ ...prev, title: value }))} placeholder="AC leak, power trip, broken fixture..." />
          <Select label="Room" value={ticketForm.room} onChange={(value) => setTicketForm(prev => ({ ...prev, room: value }))}>
            <option value="">No room</option>
            {rooms.map(room => <option key={room.id} value={room.id}>Room {room.number}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Priority" value={ticketForm.priority} onChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </Select>
            <Select label="Category" value={ticketForm.category} onChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
              <option>General</option>
              <option>HVAC</option>
              <option>Electrical</option>
              <option>Plumbing</option>
              <option>Furniture</option>
              <option>Safety</option>
            </Select>
          </div>
          <SmallInput label="Asset" value={ticketForm.asset} onChange={(value) => setTicketForm(prev => ({ ...prev, asset: value }))} placeholder="AC unit, bathroom sink, TV..." />
          <SmallInput label="Location Note" value={ticketForm.locationNote} onChange={(value) => setTicketForm(prev => ({ ...prev, locationNote: value }))} placeholder="Bathroom, balcony, hallway..." />
          <Field label="Details" value={ticketForm.description} onChange={(value) => setTicketForm(prev => ({ ...prev, description: value }))} placeholder="Describe the issue clearly." />
          <CheckField label="Vendor Required" checked={ticketForm.vendorRequired} onChange={(value) => setTicketForm(prev => ({ ...prev, vendorRequired: value }))} />
          <CheckField label="Safety Lockout" checked={ticketForm.safetyLockout} onChange={(value) => setTicketForm(prev => ({ ...prev, safetyLockout: value }))} />
          <button disabled={saving} type="submit" className="w-full bg-hotel-navy text-white py-3 rounded-xl font-bold disabled:opacity-60">
            Create Work Order
          </button>
        </form>
      </Modal>
    </div>
  );
}

function getWorkForm(ticket) {
  return {
    diagnosis: ticket.diagnosis || '',
    partsUsed: ticket.partsUsed || '',
    estimatedCost: ticket.estimatedCost || 0,
    laborMinutes: ticket.laborMinutes || 0,
    vendorRequired: Boolean(ticket.vendorRequired),
    safetyLockout: Boolean(ticket.safetyLockout),
    followUpRequired: Boolean(ticket.followUpRequired),
    followUpNotes: ticket.followUpNotes || '',
    resolutionNotes: ticket.resolutionNotes || '',
  };
}

function Metric({ label, value, danger }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm">
      <p className={`text-xl font-extrabold ${danger ? 'text-hotel-red' : 'text-slate-800'}`}>{value}</p>
      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}

function Flag({ icon: Icon, text, danger }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-sm font-bold flex items-center gap-2 ${danger ? 'bg-hotel-red/10 text-hotel-red border-hotel-red/20' : 'bg-hotel-amber/10 text-hotel-amber border-hotel-amber/20'}`}>
      <Icon size={17} /> {text}
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, disabled, primary, success }) {
  const color = success ? 'bg-hotel-emerald text-white' : primary ? 'bg-hotel-navy text-white' : 'bg-slate-100 text-slate-700';
  return (
    <button disabled={disabled} onClick={onClick} className={`${color} py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60`}>
      <Icon size={18} /> {label}
    </button>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-hotel-navy resize-none" />
    </label>
  );
}

function SmallInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-hotel-navy" />
    </label>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-hotel-navy bg-white">
        {children}
      </select>
    </label>
  );
}

function CheckField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-50">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-hotel-navy focus:ring-hotel-navy" />
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </label>
  );
}
