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
      { name: 'Guest Check-in', path: '#', icon: CalendarCheck },
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
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-hotel-navy text-slate-300 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-hotel-gold p-1.5 rounded-lg">
              <Building size={20} className="text-hotel-navy" />
            </div>
            <span className="text-xl font-bold tracking-tight">HotelOps</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} />
                {link.name}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Current Shift</p>
            <p className="text-sm font-semibold text-white">Morning (08:00 - 16:00)</p>
          </div>
        </div>
      </aside>
    </>
  );
}
