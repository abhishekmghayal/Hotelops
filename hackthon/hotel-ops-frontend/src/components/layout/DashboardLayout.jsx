import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Bell, ScanLine, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const cn = (...inputs) => twMerge(clsx(inputs));
  
  // Mobile App View for Staff (Housekeeping & Maintenance)
  const isMobileStaffView = ['Housekeeping', 'Maintenance'].includes(user.role);

  if (isMobileStaffView) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-8">
        {/* Mobile Device Mockup Frame */}
        <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-slate-50 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-[8px] border-slate-800 ring-4 ring-slate-900/50 flex flex-col">
          
          {/* Top Status Bar Mockup */}
          <div className="h-7 w-full bg-slate-50 absolute top-0 z-50 flex justify-center pt-2">
            <div className="w-24 h-5 bg-slate-800 rounded-b-xl absolute top-[-2px]"></div>
          </div>

          <header className="bg-white px-6 pt-10 pb-4 shadow-sm relative z-40">
            <h1 className="text-2xl font-bold text-slate-800">HotelOps</h1>
            <p className="text-sm text-slate-500 font-medium">{user.role} Portal</p>
          </header>

          <main className="flex-1 overflow-y-auto p-4 pb-24 scroll-smooth">
            <Outlet />
          </main>

          {/* Bottom Navigation */}
          <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center rounded-b-[2rem]">
            {[
              { id: 'tasks', icon: ClipboardList, label: 'Tasks', active: true },
              { id: 'alerts', icon: Bell, label: 'Alerts' },
              { id: 'scan', icon: ScanLine, label: 'Scan' },
              { id: 'profile', icon: User, label: 'Profile' }
            ].map(item => (
              <button key={item.id} className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                item.active ? "text-hotel-navy" : "text-slate-400 hover:text-slate-600"
              )}>
                <item.icon size={24} className={cn(item.active && "fill-hotel-navy/10")} />
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
