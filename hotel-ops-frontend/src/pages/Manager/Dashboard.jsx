import { useAuth } from '../../context/AuthContext';
import { kpiData, staffPerformance, taskCompletionTrend } from '../../data/dummyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BedDouble, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function ManagerDashboard() {
  const { activities } = useAuth();

  const statCards = [
    { title: 'Total Rooms', value: kpiData.totalRooms, icon: BedDouble, color: 'text-hotel-sky', bg: 'bg-sky-50' },
    { title: 'Ready', value: kpiData.ready, icon: CheckCircle, color: 'text-hotel-emerald', bg: 'bg-emerald-50' },
    { title: 'Occupied', value: kpiData.occupied, icon: Users, color: 'text-hotel-navy', bg: 'bg-slate-100' },
    { title: 'Needs Attention', value: kpiData.dirty + kpiData.maintenance, icon: AlertTriangle, color: 'text-hotel-amber', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manager Overview</h1>
          <p className="text-slate-500 mt-1">Real-time property performance metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Task Completion Trend</h3>
            <span className="flex items-center gap-1 text-hotel-emerald text-sm font-semibold bg-emerald-50 px-2 py-1 rounded">
              <TrendingUp size={16} /> +12% today
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={taskCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="tasks" stroke="#0F172A" strokeWidth={3} dot={{ fill: '#0F172A', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Staff Performance</h3>
          <div className="space-y-5">
            {staffPerformance.map((staff, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{staff.name}</p>
                    <p className="text-xs text-slate-500">{staff.tasks} tasks completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-hotel-gold font-bold bg-amber-50 px-2 py-1 rounded">
                  ★ {staff.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
