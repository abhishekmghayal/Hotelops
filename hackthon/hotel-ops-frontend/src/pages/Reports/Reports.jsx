import { useAuth } from '../../context/AuthContext';
import { BarChart3, BedDouble, CheckCircle2, Wrench } from 'lucide-react';

export default function Reports() {
  const { stats, tasks, tickets } = useAuth();
  const rooms = stats?.rooms || {};
  const totalRooms = rooms.total || 0;
  const occupancyRate = totalRooms ? Math.round(((rooms.occupied || 0) / totalRooms) * 100) : 0;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const taskCompletionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved').length;
  const maintenanceResolutionRate = tickets.length ? Math.round((resolvedTickets / tickets.length) * 100) : 0;

  const reportCards = [
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: BedDouble, detail: `${rooms.occupied || 0} of ${totalRooms} rooms occupied` },
    { label: 'Task Completion', value: `${taskCompletionRate}%`, icon: CheckCircle2, detail: `${completedTasks} of ${tasks.length} tasks complete` },
    { label: 'Maintenance Resolution', value: `${maintenanceResolutionRate}%`, icon: Wrench, detail: `${resolvedTickets} of ${tickets.length} tickets resolved` },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500 mt-1 font-medium">Live operating summary from MongoDB.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-hotel-navy/5 text-hotel-navy">
                  <Icon size={26} />
                </div>
                <BarChart3 size={20} className="text-slate-300" />
              </div>
              <p className="text-sm font-semibold uppercase text-slate-500 mb-2">{card.label}</p>
              <p className="text-4xl font-extrabold text-slate-800">{card.value}</p>
              <p className="text-sm text-slate-500 mt-2">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-xl font-extrabold text-slate-800 mb-5">Room Status Mix</h2>
          <div className="space-y-4">
            {[
              ['Ready', rooms.ready || 0, 'bg-hotel-emerald'],
              ['Occupied', rooms.occupied || 0, 'bg-hotel-sky'],
              ['Dirty', rooms.dirty || 0, 'bg-hotel-red'],
              ['Maintenance', rooms.maintenance || 0, 'bg-hotel-amber'],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${totalRooms ? (value / totalRooms) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-xl font-extrabold text-slate-800 mb-5">Open Work</h2>
          <div className="space-y-4">
            {tasks.filter(task => task.status !== 'Completed').slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                <div>
                  <p className="font-bold text-slate-800">{task.title}</p>
                  <p className="text-sm text-slate-500">Room {task.room} · {task.priority}</p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{task.status}</span>
              </div>
            ))}
            {tasks.filter(task => task.status !== 'Completed').length === 0 && (
              <p className="text-sm text-slate-500">No pending tasks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
