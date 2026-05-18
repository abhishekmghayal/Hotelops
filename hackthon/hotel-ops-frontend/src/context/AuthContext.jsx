import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'FrontDesk' | 'Housekeeping' | 'Maintenance' | 'Manager' }
  const [token, setToken] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && token) {
      fetchRooms();
      fetchTasks();
      
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);
      
      newSocket.on('roomStatusUpdated', (updatedRoom) => {
        setRooms((prev) => prev.map(r => r._id === updatedRoom._id ? mapRoom(updatedRoom) : r));
        addActivity(`Room ${updatedRoom.roomNumber} status updated to ${updatedRoom.status}`, 'system');
      });
      
      newSocket.on('taskCreated', (task) => {
        setTasks((prev) => [mapTask(task), ...prev]);
        addActivity(`New task: ${task.title}`, 'system');
      });
      
      newSocket.on('taskUpdated', (task) => {
        if (task.deleted) {
          setTasks((prev) => prev.filter(t => t.id !== task._id));
        } else {
          setTasks((prev) => prev.map(t => t.id === task._id ? mapTask(task) : t));
        }
      });
      
      return () => newSocket.close();
    }
  }, [user, token]);

  const mapRoom = (r) => ({
    ...r,
    id: r._id,
    number: r.roomNumber,
    guestName: r.status === 'Occupied' ? 'Guest' : null,
  });

  const mapTask = (t) => ({
    ...t,
    id: t._id,
    room: t.room ? (t.room.roomNumber || t.room) : 'N/A',
    dueTime: 'Asap'
  });

  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/rooms`, getAuthHeader());
      setRooms(data.map(mapRoom));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tasks`, getAuthHeader());
      setTasks(data.map(mapTask));
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (role) => {
    const emails = {
      Manager: 'manager@hotelops.com',
      FrontDesk: 'frontdesk@hotelops.com',
      Housekeeping: 'housekeeping@hotelops.com',
      Maintenance: 'maintenance@hotelops.com'
    };
    
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email: emails[role] || emails['FrontDesk'],
        password: 'password123'
      });
      setUser({ ...data, role });
      setToken(data.token);
    } catch (error) {
      console.error('Login failed', error);
      setUser({ role, name: `Demo ${role}` });
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRooms([]);
    setTasks([]);
    if (socket) socket.close();
  };

  // Global Actions
  const checkoutRoom = async (roomNumber) => {
    const room = rooms.find(r => r.number === roomNumber);
    if (!room) return;
    
    try {
      await axios.put(`${API_URL}/rooms/${room.id}/status`, { status: 'Dirty' }, getAuthHeader());
      addActivity(`Room ${roomNumber} checked out`, 'checkout');
    } catch (error) {
      console.error(error);
    }
  };

  const markTaskComplete = async (taskId, roomNumber) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}/status`, { status: 'Completed' }, getAuthHeader());
      addActivity(`Task completed`, 'housekeeping');
    } catch (error) {
      console.error(error);
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
