import { Clock, AlertCircle } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';
import Button from '../ui/Button';

export default function TaskCard({ task, onComplete }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-lg text-slate-800">Room {task.room}</h4>
        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
          {task.priority} Priority
        </span>
      </div>
      
      <p className="text-slate-600 mb-4">{task.description}</p>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
          <Clock size={16} />
          {task.dueTime}
        </div>
        
        {task.status !== 'Completed' ? (
          <Button variant="success" className="py-1.5 text-sm" onClick={() => onComplete(task.id, task.room)}>
            Complete Task
          </Button>
        ) : (
          <span className="text-sm font-semibold text-hotel-emerald flex items-center gap-1">
            <AlertCircle size={16} /> Completed
          </span>
        )}
      </div>
    </div>
  );
}
