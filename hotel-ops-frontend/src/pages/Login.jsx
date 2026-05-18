import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, KeyRound, User as UserIcon } from 'lucide-react';
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
    { id: 'Manager', label: 'General Manager' },
    { id: 'FrontDesk', label: 'Front Desk' },
    { id: 'Housekeeping', label: 'Housekeeping' },
    { id: 'Maintenance', label: 'Maintenance' },
  ];

  return (
    <div className="min-h-screen bg-hotel-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-hotel-gold/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-hotel-emerald/10 rounded-full blur-[100px]"></div>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-hotel-gold/20 text-hotel-gold mb-4 border border-hotel-gold/30">
            <Building size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">HotelOps</h1>
          <p className="text-slate-300 text-sm">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Select your role</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    role === r.id 
                      ? 'bg-hotel-gold border-hotel-gold text-hotel-navy shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <UserIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                defaultValue="demo@hotelops.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-hotel-gold focus:ring-1 focus:ring-hotel-gold transition-all"
                placeholder="Email or Employee ID"
              />
            </div>
            <div className="relative">
              <KeyRound size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                defaultValue="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 outline-none focus:border-hotel-gold focus:ring-1 focus:ring-hotel-gold transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 text-lg bg-hotel-gold text-hotel-navy hover:bg-[#b5952f] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] font-bold">
            Sign In
          </Button>
        </form>
        
        <p className="text-center text-xs text-slate-400 mt-8">
          Interactive Hackathon Demo Environment
        </p>
      </div>
    </div>
  );
}
