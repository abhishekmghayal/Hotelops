import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, User as UserIcon, LayoutDashboard, ClipboardList, PenTool, CalendarCheck } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Login() {
  const [role, setRole] = useState('FrontDesk');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(role);
    
    // Route based on role
    switch(role) {
      case 'Manager': navigate('/manager'); break;
      case 'FrontDesk': navigate('/frontdesk'); break;
      case 'Housekeeping': navigate('/housekeeping'); break;
      case 'Maintenance': navigate('/maintenance'); break;
      default: navigate('/');
    }
  };

  const roles = [
    { id: 'Manager', label: 'General Manager', icon: LayoutDashboard },
    { id: 'FrontDesk', label: 'Front Desk', icon: CalendarCheck },
    { id: 'Housekeeping', label: 'Housekeeping', icon: ClipboardList },
    { id: 'Maintenance', label: 'Maintenance', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-hotel-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-hotel-gold/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-hotel-sky/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
      
      <div className="w-full max-w-[1000px] bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl z-10 overflow-hidden flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-12 duration-1000 relative">
        
        {/* Left Branding Panel */}
        <div className="w-full md:w-5/12 bg-hotel-navy/80 p-10 flex flex-col items-center justify-center relative overflow-hidden border-r border-white/10">
           <div className="absolute top-0 right-0 w-32 h-32 bg-hotel-gold/20 rounded-full blur-[40px] -mr-16 -mt-16"></div>
           
           <div className="w-40 h-40 mb-8 bg-white rounded-3xl p-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center relative z-10 group">
              <img 
                src="/logo.png" 
                alt="HotelOps Logo" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden text-hotel-navy font-bold text-2xl text-center items-center justify-center h-full w-full">
                HotelOps
              </div>
           </div>
           
           <div className="text-center relative z-10">
             <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
               Hotel<span className="text-hotel-gold">Ops</span>
             </h1>
             <p className="text-hotel-sky/80 text-sm tracking-widest font-semibold uppercase mb-8">
               Smart. Efficient. Reliable.
             </p>
             <p className="text-slate-400 text-sm leading-relaxed max-w-[250px] mx-auto">
               The next-generation operating system for modern hospitality management.
             </p>
           </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-7/12 p-10 lg:p-14 bg-gradient-to-br from-white/[0.08] to-transparent relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-300">Select your role to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {roles.map(r => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`relative overflow-hidden group p-4 rounded-2xl border text-sm transition-all duration-500 flex flex-col items-center gap-2 ${
                        role === r.id 
                          ? 'bg-hotel-gold/20 border-hotel-gold/50 shadow-[0_0_25px_rgba(212,175,55,0.2)] transform -translate-y-1' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {role === r.id && (
                        <div className="absolute inset-0 bg-gradient-to-b from-hotel-gold/20 to-transparent"></div>
                      )}
                      <Icon size={24} className={`relative z-10 transition-colors duration-500 ${role === r.id ? 'text-hotel-gold' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span className={`relative z-10 font-semibold ${role === r.id ? 'text-hotel-gold' : 'text-slate-300 group-hover:text-white'}`}>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="relative group">
                <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-hotel-gold transition-colors" />
                <input 
                  type="text" 
                  defaultValue="demo@hotelops.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 outline-none focus:border-hotel-gold focus:bg-white/10 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 font-medium"
                  placeholder="Email or Employee ID"
                />
              </div>
              <div className="relative group">
                <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-hotel-gold transition-colors" />
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 outline-none focus:border-hotel-gold focus:bg-white/10 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 font-medium"
                  placeholder="Password"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-4 text-lg bg-gradient-to-r from-hotel-gold to-[#b5952f] border-none text-hotel-navy hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] font-bold rounded-2xl transition-all duration-300 hover:-translate-y-1">
              Sign In
            </Button>
          </form>
          
          <p className="text-center text-xs text-slate-500 mt-8 font-medium">
            Interactive Hackathon Demo Environment &bull; Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
