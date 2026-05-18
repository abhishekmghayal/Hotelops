import { useAuth } from '../../context/AuthContext';
import { Settings, PenTool, CheckCircle2 } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';

export default function MaintenanceDashboard() {
  const { tasks, markTaskComplete } = useAuth();
  
  const maintenanceTasks = tasks.filter(t => t.type === 'Maintenance');
  
  return (
    <div className="space-y-6">
      <div className="bg-hotel-navy p-6 rounded-2xl text-white">
        <h2 className="text-xl font-bold mb-2">Work Orders</h2>
        <p className="text-slate-300">You have {maintenanceTasks.length} pending tickets.</p>
      </div>

      <div className="space-y-4">
        {maintenanceTasks.map(task => (
          <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Room {task.room}</h3>
                  <p className="text-sm text-slate-500 font-medium">Reported: {task.dueTime}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl mt-4 border border-slate-100">
              <p className="text-slate-700 font-medium">{task.description}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
                Order Parts
              </button>
              <button 
                onClick={() => markTaskComplete(task.id, task.room)}
                className="flex-1 bg-hotel-navy text-white font-bold py-3 rounded-xl shadow-lg shadow-hotel-navy/20 active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                <PenTool size={18} /> Fix Complete
              </button>
            </div>
          </div>
        ))}

        {maintenanceTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <CheckCircle2 size={48} className="mx-auto text-hotel-emerald mb-3 opacity-50" />
            <p className="text-slate-500 font-medium text-lg">No pending work orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
