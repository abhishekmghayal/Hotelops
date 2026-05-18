import { createContext, useState, useContext, useEffect } from 'react';
import { roomsData, tasksData, activitiesData } from '../data/dummyData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'FrontDesk' | 'Housekeeping' | 'Maintenance' | 'Manager' }
  const [rooms, setRooms] = useState(roomsData);
  const [tasks, setTasks] = useState(tasksData);
  const [activities, setActivities] = useState(activitiesData);

  const login = (role) => {
    setUser({ role, name: `Demo ${role}` });
  };

  const logout = () => {
    setUser(null);
  };

  // Global Actions
  const checkoutRoom = (roomNumber) => {
    setRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, status: 'Dirty', guestName: null } : r));
    
    // Add new housekeeping task
    const newTask = {
      id: `t-${Date.now()}`,
      room: roomNumber,
      type: 'Housekeeping',
      priority: 'High',
      status: 'Pending',
      dueTime: 'Asap',
      description: 'Checkout clean'
    };
    setTasks(prev => [newTask, ...prev]);

    // Add activity
    addActivity(`Room ${roomNumber} checked out`, 'checkout');
  };

  const markTaskComplete = (taskId, roomNumber) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    
    if (roomNumber) {
      setRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, status: 'Ready' } : r));
      addActivity(`Room ${roomNumber} marked as Ready`, 'housekeeping');
    }
  };

  const addActivity = (text, type) => {
    const newActivity = {
      id: `a-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      rooms, checkoutRoom,
      tasks, markTaskComplete,
      activities
    }}>
      {children}
    </AuthContext.Provider>
  );
};
