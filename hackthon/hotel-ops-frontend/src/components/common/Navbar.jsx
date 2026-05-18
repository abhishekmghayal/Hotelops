import { useAuth } from '../../context/AuthContext';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';

export default function Navbar({ onMobileMenuClick }) {
  const { user, logout } = useAuth();

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
        <button className="relative p-2.5 text-slate-500 hover:text-hotel-navy hover:bg-slate-100 rounded-xl transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-hotel-red rounded-full border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
        </button>
        
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
