import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CalendarCheck, ClipboardList, PenTool, BarChart3, Settings, Building } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user } = useAuth();
  const cn = (...inputs) => twMerge(clsx(inputs));

  const navItems = {
    Manager: [
      { name: 'Dashboard', path: '/manager', icon: LayoutDashboard },
      { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
      { name: 'Room Status', path: '/rooms', icon: Building },
      { name: 'Settings', path: '#', icon: Settings },
    ],
    FrontDesk: [
      { name: 'Dashboard', path: '/frontdesk', icon: LayoutDashboard },
      { name: 'Room Status', path: '/rooms', icon: Building },
      { name: 'Guest Check-in', path: '/frontdesk/checkin', icon: CalendarCheck },
    ],
    Housekeeping: [
      { name: 'My Tasks', path: '/housekeeping', icon: ClipboardList },
    ],
    Maintenance: [
      { name: 'Work Orders', path: '/maintenance', icon: PenTool },
    ]
  };

  const links = user ? navItems[user.role] || [] : [];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-hotel-navy/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-hotel-navy text-slate-300 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col shadow-2xl lg:shadow-none border-r border-white/5",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-hotel-gold/10 rounded-full blur-[40px] -mr-16 -mt-16"></div>
          <div className="flex items-center gap-3 text-white relative z-10">
            <div className="bg-gradient-to-br from-hotel-gold to-[#b5952f] p-2 rounded-xl shadow-lg shadow-hotel-gold/20">
              <Building size={22} className="text-hotel-navy" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight">Hotel<span className="text-hotel-gold">Ops</span></span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium relative overflow-hidden",
                  isActive 
                    ? "text-white bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-hotel-gold rounded-r-full shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>
                    )}
                    <Icon size={20} className={cn("transition-colors duration-300", isActive ? "text-hotel-gold" : "group-hover:text-slate-300")} />
                    <span className="tracking-wide text-sm">{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-hotel-sky/10 rounded-full blur-[30px] -mr-10 -mt-10"></div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-semibold">Current Shift</p>
            <p className="text-sm font-bold text-white tracking-wide">Morning</p>
            <p className="text-xs text-hotel-sky mt-1">08:00 - 16:00</p>
          </div>
        </div>
      </aside>
    </>
  );
}
