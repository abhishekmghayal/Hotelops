import { useAuth } from '../../context/AuthContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Users, BedDouble, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ManagerDashboard() {
  const { stats, tasks, tickets } = useAuth();

  const rooms = stats?.rooms || {};
  const taskCompletionTrend = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const completed = tasks.filter(task => {
      if (task.status !== 'Completed' || !task.updatedAt) return false;
      return new Date(task.updatedAt).toDateString() === date.toDateString();
    }).length;

    return { time: key, tasks: completed };
  });

  const staffPerformance = tasks.reduce((acc, task) => {
    const name = task.assignee?.name || 'Unassigned';
    if (!acc[name]) {
      acc[name] = { name, tasks: 0, rating: 4.5 };
    }
    if (task.status === 'Completed') {
      acc[name].tasks += 1;
    }
    return acc;
  }, {});

  const performers = Object.values(staffPerformance)
    .sort((a, b) => b.tasks - a.tasks)
    .slice(0, 4);

  const statCards = [
    { title: 'Total Rooms', value: rooms.total || 0, icon: BedDouble, color: 'text-hotel-sky', bg: 'bg-hotel-sky/10' },
    { title: 'Ready', value: rooms.ready || 0, icon: CheckCircle, color: 'text-hotel-emerald', bg: 'bg-hotel-emerald/10' },
    { title: 'Occupied', value: rooms.occupied || 0, icon: Users, color: 'text-hotel-navy', bg: 'bg-hotel-navy/10' },
    { title: 'Needs Attention', value: (rooms.dirty || 0) + (rooms.maintenance || 0), icon: AlertTriangle, color: 'text-hotel-red', bg: 'bg-hotel-red/10' },
  ];

  const completedToday = taskCompletionTrend[taskCompletionTrend.length - 1]?.tasks || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manager Overview</h1>
          <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hotel-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hotel-emerald"></span>
            </span>
            Real-time property performance metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase mb-2">{stat.title}</p>
                <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} shadow-inner`}>
                <stat.icon size={28} className={stat.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-extrabold text-xl text-slate-800">Task Completion Trend</h3>
            <span className="flex items-center gap-1.5 text-hotel-emerald text-sm font-bold bg-hotel-emerald/10 px-3 py-1.5 rounded-xl">
              <TrendingUp size={16} strokeWidth={3} /> {completedToday} done today
            </span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={taskCompletionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.15)', padding: '12px 20px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#0F172A" strokeWidth={4} fillOpacity={1} fill="url(#colorTasks)" activeDot={{ r: 8, strokeWidth: 0, fill: '#D4AF37' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Staff Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-hotel-gold/10 rounded-xl text-hotel-gold">
              <Activity size={24} />
            </div>
            <h3 className="font-extrabold text-xl text-slate-800">Top Performers</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            {performers.map((staff, i) => (
              <div key={i} className="flex items-center justify-between group hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-hotel-navy/5 border border-hotel-navy/10 flex items-center justify-center font-bold text-hotel-navy text-lg shadow-sm">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[15px]">{staff.name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{staff.tasks} tasks completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-hotel-gold font-bold bg-hotel-gold/10 px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="text-[10px]">★</span> {staff.rating}
                </div>
              </div>
            ))}
            {performers.length === 0 && (
              <p className="text-sm text-slate-500 font-medium">No completed tasks yet.</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm font-semibold uppercase text-slate-500 mb-2">Pending Tasks</p>
          <p className="text-3xl font-extrabold text-slate-800">{stats?.tasks?.pending || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm font-semibold uppercase text-slate-500 mb-2">Open Maintenance</p>
          <p className="text-3xl font-extrabold text-slate-800">{stats?.maintenance?.open || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm font-semibold uppercase text-slate-500 mb-2">Critical Tickets</p>
          <p className="text-3xl font-extrabold text-slate-800">{tickets.filter(ticket => ticket.priority === 'Critical' && ticket.status !== 'Resolved').length}</p>
        </div>
      </div>
    </div>
  );
}
