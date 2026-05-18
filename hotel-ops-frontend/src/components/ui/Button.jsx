import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({ children, variant = 'primary', className, ...props }) {
  const cn = (...inputs) => twMerge(clsx(inputs));
  
  const variants = {
    primary: 'bg-hotel-navy text-white hover:bg-slate-800',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    danger: 'bg-hotel-red text-white hover:bg-red-600',
    success: 'bg-hotel-emerald text-white hover:bg-emerald-600',
    outline: 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
  };

  return (
    <button 
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
