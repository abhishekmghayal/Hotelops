export const getStatusColor = (status) => {
  switch (status) {
    case 'Ready': return 'bg-hotel-emerald text-white';
    case 'Dirty': return 'bg-hotel-red text-white';
    case 'Cleaning': return 'bg-hotel-amber text-white';
    case 'Maintenance': return 'bg-hotel-amber text-white';
    case 'Occupied': return 'bg-hotel-sky text-white';
    default: return 'bg-slate-200 text-slate-800';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'bg-hotel-red/10 text-hotel-red border-hotel-red/20';
    case 'Medium': return 'bg-hotel-amber/10 text-hotel-amber border-hotel-amber/20';
    case 'Low': return 'bg-slate-100 text-slate-600 border-slate-200';
    default: return 'bg-slate-100 text-slate-600';
  }
};
