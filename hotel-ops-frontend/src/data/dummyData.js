export const roomsData = Array.from({ length: 20 }, (_, i) => {
  const num = 101 + i;
  let status = 'Ready';
  if (i % 5 === 0) status = 'Occupied';
  else if (i % 7 === 0) status = 'Dirty';
  else if (i % 11 === 0) status = 'Cleaning';
  else if (i === 19) status = 'Maintenance';

  return {
    id: `room-${num}`,
    number: num.toString(),
    type: i % 3 === 0 ? 'Suite' : (i % 2 === 0 ? 'Double' : 'Single'),
    status: status, // Ready, Occupied, Dirty, Cleaning, Maintenance
    guestName: status === 'Occupied' ? `Guest ${i + 1}` : null,
  };
});

export const tasksData = [
  { id: 't1', room: '107', type: 'Housekeeping', priority: 'High', status: 'Pending', dueTime: '14:00', description: 'Checkout clean' },
  { id: 't2', room: '112', type: 'Housekeeping', priority: 'Medium', status: 'Pending', dueTime: '15:00', description: 'Stayover service' },
  { id: 't3', room: '120', type: 'Maintenance', priority: 'High', status: 'Pending', dueTime: 'Asap', description: 'AC not cooling' },
];

export const activitiesData = [
  { id: 'a1', text: 'Room 105 checked out', time: '5 mins ago', type: 'checkout' },
  { id: 'a2', text: 'Maria started cleaning Room 107', time: '10 mins ago', type: 'housekeeping' },
  { id: 'a3', text: 'New maintenance request for Room 120', time: '15 mins ago', type: 'maintenance' },
];

export const kpiData = {
  totalRooms: 20,
  occupied: 4,
  ready: 11,
  dirty: 2,
  cleaning: 2,
  maintenance: 1,
  pendingTasks: 3
};

export const staffPerformance = [
  { name: 'Maria S.', tasks: 12, rating: 4.8 },
  { name: 'John D.', tasks: 8, rating: 4.5 },
  { name: 'Elena R.', tasks: 15, rating: 4.9 },
  { name: 'David W.', tasks: 6, rating: 4.2 },
];

export const taskCompletionTrend = [
  { time: '08:00', tasks: 2 },
  { time: '10:00', tasks: 8 },
  { time: '12:00', tasks: 15 },
  { time: '14:00', tasks: 12 },
  { time: '16:00', tasks: 20 },
];
