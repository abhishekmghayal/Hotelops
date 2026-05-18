import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Bell, ScanLine, User, LogOut, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function DashboardLayout() {
  const { user, logout, notifications, markNotificationRead } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staffTab, setStaffTab] = useState('tasks');

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const cn = (...inputs) => twMerge(clsx(inputs));
  
  // Mobile App View for Staff (Housekeeping & Maintenance)
  const isMobileStaffView = ['Housekeeping', 'Maintenance'].includes(user.role);

  if (isMobileStaffView) {
    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-8">
        {/* Mobile Device Mockup Frame */}
        <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-slate-50 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-[8px] border-slate-800 ring-4 ring-slate-900/50 flex flex-col">
          
          {/* Top Status Bar Mockup */}
          <div className="h-7 w-full bg-slate-50 absolute top-0 z-50 flex justify-center pt-2">
            <div className="w-24 h-5 bg-slate-800 rounded-b-xl absolute top-[-2px]"></div>
          </div>

          <header className="bg-white px-6 pt-10 pb-4 shadow-sm relative z-40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">HotelOps</h1>
                <p className="text-sm text-slate-500 font-medium">{user.role} Portal</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStaffTab('alerts')}
                  className="relative p-2.5 rounded-xl bg-slate-100 text-slate-600"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-hotel-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-hotel-red/10 text-hotel-red"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 pb-24 scroll-smooth">
            {staffTab === 'tasks' && <Outlet />}
            {staffTab === 'alerts' && (
              <StaffAlerts notifications={notifications} markNotificationRead={markNotificationRead} />
            )}
            {staffTab === 'scan' && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
                <ScanLine size={42} className="mx-auto text-hotel-navy mb-3" />
                <h2 className="text-lg font-extrabold text-slate-800">Room Scan</h2>
                <p className="text-sm text-slate-500 mt-1">Use room cards and work orders to update live room operations.</p>
              </div>
            )}
            {staffTab === 'profile' && (
              <StaffProfile user={user} logout={logout} unreadCount={unreadCount} />
            )}
          </main>

          {/* Bottom Navigation */}
          <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center rounded-b-[2rem]">
            {[
              { id: 'tasks', icon: ClipboardList, label: 'Tasks', active: true },
              { id: 'alerts', icon: Bell, label: 'Alerts' },
              { id: 'scan', icon: ScanLine, label: 'Scan' },
              { id: 'profile', icon: User, label: 'Profile' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setStaffTab(item.id)}
                className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                staffTab === item.id ? "text-hotel-navy" : "text-slate-400 hover:text-slate-600"
              )}>
                <div className="relative">
                  <item.icon size={24} className={cn(staffTab === item.id && "fill-hotel-navy/10")} />
                  {item.id === 'alerts' && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-hotel-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

        </div>
      </div>
    );
  }

  // Desktop Web App View for Manager & FrontDesk
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Navbar onMobileMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function StaffAlerts({ notifications, markNotificationRead }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-hotel-navy text-white rounded-2xl p-5">
        <h2 className="text-xl font-extrabold">Notifications</h2>
        <p className="text-sm text-slate-300">{notifications.filter(item => !item.isRead).length} unread updates</p>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 20).map((notification) => (
          <button
            key={notification.id}
            onClick={() => markNotificationRead(notification.id)}
            className="w-full text-left bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
          >
            <div className="flex gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${notification.isRead ? 'bg-slate-100 text-slate-400' : 'bg-hotel-navy text-white'}`}>
                <Bell size={18} />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${notification.isRead ? 'text-slate-500' : 'text-slate-800 font-bold'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">{notification.type} · {notification.time}</p>
              </div>
              {!notification.isRead && <CheckCircle2 size={18} className="text-hotel-emerald" />}
            </div>
          </button>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <Bell size={42} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-500">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StaffProfile({ user, logout, unreadCount }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-hotel-navy/10 text-hotel-navy mx-auto flex items-center justify-center mb-4">
          <User size={34} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">{user?.name || 'Staff User'}</h2>
        <p className="text-sm text-hotel-gold font-bold uppercase tracking-wide mt-1">{user?.role}</p>
        <p className="text-sm text-slate-500 mt-2">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center">
          <p className="text-2xl font-extrabold text-slate-800">Morning</p>
          <p className="text-xs font-bold text-slate-400 uppercase">Shift</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center">
          <p className="text-2xl font-extrabold text-slate-800">{unreadCount}</p>
          <p className="text-xs font-bold text-slate-400 uppercase">Unread</p>
        </div>
      </div>

      <button onClick={logout} className="w-full bg-hotel-red text-white rounded-2xl py-4 font-extrabold flex items-center justify-center gap-2">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
