export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
      <div 
        className="bg-hotel-navy h-2.5 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
