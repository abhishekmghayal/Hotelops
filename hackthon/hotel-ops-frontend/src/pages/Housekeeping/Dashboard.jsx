import { useState } from 'react';
import { Camera, CheckCircle2, ChevronRight, Clock, Play, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ui/ProgressBar';
import { getPriorityColor } from '../../utils/helpers';

export default function HousekeepingDashboard() {
  const { tasks, updateTaskStatus, markTaskComplete } = useAuth();
  const [activeTask, setActiveTask] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [notes, setNotes] = useState('');
  const [inspected, setInspected] = useState(false);

  const hkTasks = tasks.filter(t => t.type === 'Cleaning');
  const openTasks = hkTasks.filter(t => t.status !== 'Completed');
  const inProgress = hkTasks.filter(t => t.status === 'In Progress').length;
  const completed = hkTasks.filter(t => t.status === 'Completed').length;
  const progress = Math.round((completed / (hkTasks.length || 1)) * 100);

  const openTask = (task) => {
    setActiveTask(task);
    setChecklist(task.checklist || []);
    setNotes(task.notes || '');
    setInspected(Boolean(task.inspected));
  };

  const toggleChecklist = (index) => {
    setChecklist(prev => prev.map((item, i) => i === index ? { ...item, done: !item.done } : item));
  };

  const saveProgress = async (status = activeTask.status) => {
    if (!activeTask) return;
    const updated = await updateTaskStatus(activeTask.id, status, { checklist, notes, inspected });
    if (updated) openTask(updated);
  };

  if (activeTask) {
    const readyToComplete = checklist.every(item => item.done) && inspected;

    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
        <div className="mb-5">
          <button onClick={() => setActiveTask(null)} className="text-hotel-navy font-semibold text-sm mb-2 hover:underline">
            Back to Tasks
          </button>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-slate-800">Room {activeTask.room}</h2>
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(activeTask.priority)}`}>{activeTask.priority}</span>
          </div>
          <p className="text-slate-500 mt-1">{activeTask.description}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => saveProgress('In Progress')} className="bg-hotel-navy text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2">
              <Play size={18} /> Start
            </button>
            <button onClick={() => saveProgress()} className="bg-slate-100 text-slate-700 rounded-xl py-3 font-bold">
              Save Progress
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-800">Room Checklist</h3>
            {checklist.map((item, i) => (
              <label key={`${item.label}-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input checked={item.done} onChange={() => toggleChecklist(i)} type="checkbox" className="w-5 h-5 rounded border-slate-300 text-hotel-emerald focus:ring-hotel-emerald" />
                <span className="font-medium text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-hotel-emerald/20 bg-hotel-emerald/5 cursor-pointer">
            <input checked={inspected} onChange={(e) => setInspected(e.target.checked)} type="checkbox" className="w-5 h-5 rounded border-slate-300 text-hotel-emerald focus:ring-hotel-emerald" />
            <ShieldCheck size={20} className="text-hotel-emerald" />
            <span className="font-bold text-slate-700">Final self inspection complete</span>
          </label>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-800">Notes</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-hotel-navy resize-none" placeholder="Missing item, minibar issue, stain, guest request..." />
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-xl h-28 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <Camera size={28} className="mb-2" />
            <span className="text-sm font-medium">Photo proof placeholder</span>
          </div>
        </div>

        <button
          disabled={!readyToComplete}
          onClick={async () => {
            await markTaskComplete(activeTask.id, { checklist, notes, inspected });
            setActiveTask(null);
          }}
          className="mt-5 w-full bg-hotel-emerald text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          <CheckCircle2 size={24} /> Complete & Mark Room Ready
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-5">
      <div className="bg-hotel-navy text-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-1">Housekeeping Shift</h2>
        <p className="text-slate-300 text-sm mb-4">{completed} of {hkTasks.length} rooms completed · {inProgress} in progress</p>
        <ProgressBar progress={progress} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Metric label="Open" value={openTasks.length} />
        <Metric label="Started" value={inProgress} />
        <Metric label="Done" value={completed} />
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-lg flex justify-between items-center">
          Cleaning Queue
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm">{openTasks.length}</span>
        </h3>

        {openTasks.map(task => (
          <div key={task.id} onClick={() => openTask(task)} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-slate-800">Room {task.room}</span>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{task.status}</span>
              </div>
              <p className="text-slate-500 text-sm">{task.description}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={13} /> {task.dueTime}</p>
            </div>
            <ChevronRight size={20} className="text-hotel-navy" />
          </div>
        ))}

        {openTasks.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 border-dashed">
            <CheckCircle2 size={48} className="mx-auto text-hotel-emerald mb-3 opacity-50" />
            <p className="text-slate-500 font-medium">All rooms are ready.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
    </div>
  );
}
