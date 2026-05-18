import { Clock, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';
import Button from '../ui/Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function TaskCard({ task, onComplete }) {
  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <div className="bg-white rounded-[1.25rem] p-6 border-2 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden">
      {task.status === 'Completed' && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-hotel-emerald"></div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-extrabold text-xl text-slate-800 tracking-tight flex items-center gap-2">
            Room {task.room}
            {task.status === 'Completed' && (
              <CheckCircle2 size={18} className="text-hotel-emerald" />
            )}
          </h4>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">{task.type || 'Housekeeping'}</p>
        </div>
        <span className={cn(
          "px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border shadow-sm",
          getPriorityColor(task.priority)
        )}>
          {task.priority}
        </span>
      </div>
      
      <div className="bg-slate-50/80 rounded-xl p-4 mb-5 border border-slate-100/50 group-hover:bg-slate-100/50 transition-colors">
        <p className="text-slate-600 font-medium leading-relaxed">{task.description}</p>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <Clock size={16} className="text-hotel-gold" />
          {task.dueTime}
        </div>
        
        {task.status !== 'Completed' ? (
          <button 
            onClick={() => onComplete(task.id, task.room)}
            className="flex items-center gap-2 bg-hotel-navy hover:bg-hotel-emerald text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(15,23,42,0.2)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
          >
            <Check size={16} strokeWidth={3} /> Complete
          </button>
        ) : (
          <span className="text-sm font-bold text-hotel-emerald bg-hotel-emerald/10 px-4 py-2 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 size={18} /> Done
          </span>
        )}
      </div>
    </div>
  );
}
