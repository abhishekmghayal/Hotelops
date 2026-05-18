import { useAuth } from '../../context/AuthContext';
import { Camera, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ProgressBar from '../../components/ui/ProgressBar';
import { getPriorityColor } from '../../utils/helpers';

export default function HousekeepingDashboard() {
  const { tasks, markTaskComplete } = useAuth();
  const [activeTask, setActiveTask] = useState(null);

  // Filter tasks assigned to housekeeping
  const hkTasks = tasks.filter(t => t.type === 'Housekeeping');
  const pendingTasks = hkTasks.filter(t => t.status === 'Pending');

  const progress = Math.round(((hkTasks.length - pendingTasks.length) / (hkTasks.length || 1)) * 100);

  if (activeTask) {
    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
        <div className="mb-6">
          <button 
            onClick={() => setActiveTask(null)}
            className="text-hotel-navy font-semibold text-sm mb-2 hover:underline"
          >
            ← Back to Tasks
          </button>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-slate-800">Room {activeTask.room}</h2>
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(activeTask.priority)}`}>
              {activeTask.priority}
            </span>
          </div>
          <p className="text-slate-500 mt-1">{activeTask.description}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1 space-y-6">
          
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800">Checklist</h3>
            {['Change Linens', 'Sanitize Bathroom', 'Empty Trash', 'Restock Amenities'].map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-hotel-emerald focus:ring-hotel-emerald" />
                <span className="font-medium text-slate-700">{item}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-800">Photo Proof</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-xl h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
              <Camera size={32} className="mb-2" />
              <span className="text-sm font-medium">Tap to take photo</span>
            </div>
          </div>

        </div>

        <button 
          onClick={() => {
            markTaskComplete(activeTask.id, activeTask.room);
            setActiveTask(null);
          }}
          className="mt-6 w-full bg-hotel-emerald text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <CheckCircle2 size={24} /> Mark as Complete
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-hotel-navy text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
        <h2 className="text-xl font-bold mb-1">Your Shift Progress</h2>
        <p className="text-slate-300 text-sm mb-4">{hkTasks.length - pendingTasks.length} of {hkTasks.length} tasks completed</p>
        <ProgressBar progress={progress} />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg flex justify-between items-center">
          Pending Tasks
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm">{pendingTasks.length}</span>
        </h3>
        
        {pendingTasks.map(task => (
          <div 
            key={task.id}
            onClick={() => setActiveTask(task)}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-slate-800">Room {task.room}</span>
                {task.priority === 'High' && <span className="w-2 h-2 rounded-full bg-hotel-red animate-pulse"></span>}
              </div>
              <p className="text-slate-500 text-sm">{task.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-400 mb-2">{task.dueTime}</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-hotel-navy">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
        
        {pendingTasks.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 border-dashed">
            <CheckCircle2 size={48} className="mx-auto text-hotel-emerald mb-3 opacity-50" />
            <p className="text-slate-500 font-medium">All caught up! Great job.</p>
          </div>
        )}
      </div>
    </div>
  );
}
