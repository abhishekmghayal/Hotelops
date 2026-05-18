import { useAuth } from '../../context/AuthContext';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';

export default function Navbar({ onMobileMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          onClick={onMobileMenuClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 w-64 lg:w-96 focus-within:ring-2 ring-hotel-navy/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search rooms, guests, tasks..." 
            className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-hotel-red rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <UserCircle size={32} className="text-slate-400" />
          <button onClick={logout} className="p-2 text-slate-400 hover:text-hotel-red hover:bg-red-50 rounded-lg transition-colors ml-1" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
