import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';

export default function Navbar({ onMobileMenuClick }) {
  const { user, logout, notifications, markNotificationRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          onClick={onMobileMenuClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="hidden md:flex items-center bg-slate-100/80 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-2xl px-4 py-2.5 w-64 lg:w-96 focus-within:bg-white focus-within:border-hotel-sky/30 focus-within:ring-4 focus-within:ring-hotel-sky/10 transition-all duration-300">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search rooms, guests, tasks..." 
            className="bg-transparent border-none outline-none ml-3 text-sm w-full text-slate-700 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications((value) => !value)}
            className="relative p-2.5 text-slate-500 hover:text-hotel-navy hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-5 h-5 px-1 bg-hotel-red text-white text-[10px] font-bold rounded-full border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.6)] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-bold text-slate-800">Notifications</p>
                <p className="text-xs text-slate-500">{unreadCount} unread alerts</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 8).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <p className={`text-sm ${notification.isRead ? 'text-slate-500' : 'text-slate-800 font-semibold'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{notification.type} · {notification.time}</p>
                  </button>
                ))}
                {notifications.length === 0 && (
                  <p className="px-4 py-8 text-sm text-slate-500 text-center">No notifications yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user?.name}</p>
            <p className="text-[11px] font-semibold tracking-wider text-hotel-gold uppercase">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-hotel-navy/5 border border-hotel-navy/10 flex items-center justify-center text-hotel-navy">
            <UserCircle size={24} />
          </div>
          <button 
            onClick={logout} 
            className="ml-2 p-2.5 text-slate-400 hover:text-hotel-red hover:bg-hotel-red/10 rounded-xl transition-all duration-300 group" 
            title="Logout"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
