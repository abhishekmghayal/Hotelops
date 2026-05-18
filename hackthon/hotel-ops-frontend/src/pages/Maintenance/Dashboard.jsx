import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, PenTool, CheckCircle2, AlertTriangle, Play, Save } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';

export default function MaintenanceDashboard() {
  const { tickets, updateTicketStatus } = useAuth();
  const [activeTicket, setActiveTicket] = useState(null);
  const [workForm, setWorkForm] = useState({ diagnosis: '', partsUsed: '', resolutionNotes: '' });

  const openTickets = tickets.filter(t => t.status !== 'Resolved');
  const critical = openTickets.filter(t => t.priority === 'Critical').length;
  const inProgress = openTickets.filter(t => t.status === 'In Progress').length;

  const openTicket = (ticket) => {
    setActiveTicket(ticket);
    setWorkForm({
      diagnosis: ticket.diagnosis || '',
      partsUsed: ticket.partsUsed || '',
      resolutionNotes: ticket.resolutionNotes || '',
    });
  };

  const saveWork = async (status = activeTicket.status) => {
    if (!activeTicket) return;
    const updated = await updateTicketStatus(activeTicket.id, status, workForm);
    if (updated) openTicket(updated);
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

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold uppercase text-slate-400 mb-1">Reported Issue</p>
            <p className="text-slate-700 font-medium">{activeTicket.description}</p>
            <p className="text-xs text-slate-400 mt-2">{activeTicket.reportedTime}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => saveWork('In Progress')} className="bg-hotel-navy text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Play size={18} /> Start
            </button>
            <button onClick={() => saveWork()} className="bg-slate-100 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Save size={18} /> Save
            </button>
          </div>

          <Field label="Diagnosis" value={workForm.diagnosis} onChange={(value) => setWorkForm(prev => ({ ...prev, diagnosis: value }))} placeholder="What is causing the issue?" />
          <Field label="Parts Used" value={workForm.partsUsed} onChange={(value) => setWorkForm(prev => ({ ...prev, partsUsed: value }))} placeholder="Filter, bulb, gasket, valve..." />
          <Field label="Resolution Notes" value={workForm.resolutionNotes} onChange={(value) => setWorkForm(prev => ({ ...prev, resolutionNotes: value }))} placeholder="What was fixed or what follow-up is needed?" />
        </div>

        <button
          onClick={async () => {
            await updateTicketStatus(activeTicket.id, 'Resolved', workForm);
            setActiveTicket(null);
          }}
          className="mt-5 w-full bg-hotel-emerald text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-2"
        >
          <CheckCircle2 size={24} /> Resolve & Release Room
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="bg-hotel-navy p-6 rounded-2xl text-white">
        <h2 className="text-xl font-bold mb-2">Maintenance Command</h2>
        <p className="text-slate-300">{openTickets.length} open tickets · {inProgress} in progress</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Metric label="Open" value={openTickets.length} />
        <Metric label="Started" value={inProgress} />
        <Metric label="Critical" value={critical} danger />
      </div>

      <div className="space-y-4">
        {openTickets.map(ticket => (
          <div key={ticket.id} onClick={() => openTicket(ticket)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  {ticket.priority === 'Critical' ? <AlertTriangle size={20} /> : <Settings size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Room {ticket.room}</h3>
                  <p className="text-sm text-slate-500 font-medium">{ticket.status} · {ticket.reportedTime}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl mt-4 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">{ticket.title}</p>
              <p className="text-slate-700 font-medium">{ticket.description}</p>
            </div>
            <div className="flex justify-end mt-4 text-hotel-navy font-bold text-sm">
              <PenTool size={17} className="mr-1" /> Open Work Order
            </div>
          </div>
        ))}

        {openTickets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <CheckCircle2 size={48} className="mx-auto text-hotel-emerald mb-3 opacity-50" />
            <p className="text-slate-500 font-medium text-lg">No pending work orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, danger }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
      <p className={`text-2xl font-extrabold ${danger ? 'text-hotel-red' : 'text-slate-800'}`}>{value}</p>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
    </div>
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
