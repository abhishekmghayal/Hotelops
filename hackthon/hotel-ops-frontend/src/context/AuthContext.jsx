/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const roleLabels = {
  manager: 'Manager',
  frontdesk: 'FrontDesk',
  housekeeping: 'Housekeeping',
  maintenance: 'Maintenance',
};

const roleEmails = {
  Manager: 'manager@hotelops.com',
  FrontDesk: 'frontdesk@hotelops.com',
  Housekeeping: 'housekeeping@hotelops.com',
  Maintenance: 'maintenance@hotelops.com',
};

const toDisplayRole = (role) => roleLabels[role] || role;

const mapRoom = (r) => ({
  ...r,
  id: r._id,
  number: r.roomNumber,
  guestName: r.guestName || null,
  guestPhone: r.guestPhone || '',
  guestEmail: r.guestEmail || '',
  checkInAt: r.checkInAt,
  checkOutAt: r.checkOutAt,
  adults: r.adults || 1,
  children: r.children || 0,
  bookingSource: r.bookingSource || 'Walk-in',
  paymentStatus: r.paymentStatus || 'Pending',
  vip: Boolean(r.vip),
  doNotDisturb: Boolean(r.doNotDisturb),
  lateCheckout: Boolean(r.lateCheckout),
  notes: r.notes || '',
});

const mapTask = (t) => ({
  ...t,
  id: t._id,
  roomId: t.room?._id || t.room,
  room: t.room ? (t.room.roomNumber || t.room) : 'N/A',
  checklist: t.checklist?.length ? t.checklist : [
    { label: 'Change linens', done: false },
    { label: 'Sanitize bathroom', done: false },
    { label: 'Empty trash', done: false },
    { label: 'Restock amenities', done: false },
  ],
  dueTime: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Asap'
});

const mapTicket = (ticket) => ({
  ...ticket,
  id: ticket._id,
  room: ticket.room ? (ticket.room.roomNumber || ticket.room) : 'N/A',
  reportedTime: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now',
});

const mapNotification = (notification) => ({
  ...notification,
  id: notification._id,
  time: notification.createdAt ? new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hotelops_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hotelops_token'));
  const [rooms, setRooms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const client = useMemo(() => {
    const instance = axios.create({ baseURL: API_URL });
    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return instance;
  }, [token]);

  const canReadRooms = (role = user?.role) => ['Manager', 'FrontDesk', 'Maintenance'].includes(role);

  const fetchRooms = async () => {
    if (!canReadRooms()) return;
    try {
      const { data } = await client.get('/rooms');
      setRooms(data.map(mapRoom));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await client.get('/tasks');
      setTasks(data.map(mapTask));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data } = await client.get('/maintenance');
      setTickets(data.map(mapTicket));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await client.get('/notifications');
      setNotifications(data.map(mapNotification));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await client.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchRooms(),
      fetchTasks(),
      fetchTickets(),
      fetchNotifications(),
      fetchStats(),
    ]);
    setLoading(false);
  };

  const login = async (role) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email: roleEmails[role] || roleEmails.FrontDesk,
        password: 'password123'
      });
      const sessionUser = { ...data, role: toDisplayRole(data.role) };
      localStorage.setItem('hotelops_user', JSON.stringify(sessionUser));
      localStorage.setItem('hotelops_token', data.token);
      setUser(sessionUser);
      setToken(data.token);
      return { ok: true, role: sessionUser.role };
    } catch (error) {
      console.error('Login failed', error);
      return { ok: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('hotelops_user');
    localStorage.removeItem('hotelops_token');
    setUser(null);
    setToken(null);
    setRooms([]);
    setTasks([]);
    setTickets([]);
    setNotifications([]);
    setStats(null);
  };

  const updateRoomStatus = async (roomId, status, details = {}) => {
    try {
      const { data } = await client.put(`/rooms/${roomId}/status`, { status, ...details });
      setRooms((prev) => prev.map(r => r.id === roomId ? mapRoom(data) : r));
      addActivity(`Room ${data.roomNumber} marked ${data.status}`, 'room');
      await Promise.all([fetchTasks(), fetchStats(), fetchNotifications()]);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createTask = async (payload) => {
    try {
      const { data } = await client.post('/tasks', payload);
      setTasks((prev) => [mapTask(data), ...prev]);
      addActivity(`Task created: ${data.title}`, 'task');
      await Promise.all([fetchStats(), fetchNotifications()]);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createMaintenanceTicket = async (payload) => {
    try {
      const { data } = await client.post('/maintenance', payload);
      setTickets((prev) => [mapTicket(data), ...prev]);
      addActivity(`Maintenance reported: ${data.title}`, 'maintenance');
      await Promise.all([fetchRooms(), fetchStats(), fetchNotifications()]);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const checkoutRoom = async (roomNumber) => {
    const room = rooms.find(r => r.number === roomNumber);
    if (!room) return;

    await updateRoomStatus(room.id, 'Dirty');
    addActivity(`Room ${roomNumber} checked out`, 'checkout');
  };

  const updateTaskStatus = async (taskId, status, details = {}) => {
    try {
      const { data } = await client.put(`/tasks/${taskId}/status`, { status, ...details });
      setTasks((prev) => prev.map(t => t.id === taskId ? mapTask(data) : t));
      addActivity(`Task marked ${status}`, 'housekeeping');
      await Promise.all([fetchRooms(), fetchStats(), fetchNotifications()]);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const markTaskComplete = (taskId, details = {}) => updateTaskStatus(taskId, 'Completed', details);

  const updateTicketStatus = async (ticketId, status, details = {}) => {
    try {
      const { data } = await client.put(`/maintenance/${ticketId}/status`, { status, ...details });
      setTickets((prev) => prev.map(t => t.id === ticketId ? mapTicket(data) : t));
      addActivity(`Maintenance ticket marked ${status}`, 'maintenance');
      await Promise.all([fetchRooms(), fetchStats(), fetchNotifications()]);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      const { data } = await client.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) => prev.map(n => n.id === notificationId ? mapNotification(data) : n));
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

  useEffect(() => {
    if (!user || !token) return undefined;

    const loadTimer = window.setTimeout(refreshData, 0);

    const newSocket = io(SOCKET_URL);

    newSocket.on('roomStatusUpdated', (updatedRoom) => {
      setRooms((prev) => prev.map(r => r._id === updatedRoom._id ? mapRoom(updatedRoom) : r));
      addActivity(`Room ${updatedRoom.roomNumber} status updated to ${updatedRoom.status}`, 'system');
      fetchStats();
    });

    newSocket.on('taskCreated', (task) => {
      setTasks((prev) => prev.some(item => item.id === task._id) ? prev : [mapTask(task), ...prev]);
      addActivity(`New task: ${task.title}`, 'system');
      fetchStats();
    });

    newSocket.on('taskUpdated', (task) => {
      if (task.deleted) {
        setTasks((prev) => prev.filter(t => t.id !== task._id));
      } else {
        setTasks((prev) => prev.map(t => t.id === task._id ? mapTask(task) : t));
      }
      fetchStats();
    });

    newSocket.on('maintenanceCreated', (ticket) => {
      setTickets((prev) => prev.some(item => item.id === ticket._id) ? prev : [mapTicket(ticket), ...prev]);
      addActivity(`New maintenance ticket: ${ticket.title}`, 'maintenance');
      fetchStats();
    });

    newSocket.on('maintenanceUpdated', (ticket) => {
      if (ticket.deleted) {
        setTickets((prev) => prev.filter(t => t.id !== ticket._id));
      } else {
        setTickets((prev) => prev.map(t => t.id === ticket._id ? mapTicket(ticket) : t));
      }
      fetchStats();
    });

    newSocket.on('notificationSent', (notification) => {
      setNotifications((prev) => prev.some(item => item.id === notification._id) ? prev : [mapNotification(notification), ...prev]);
    });

    return () => {
      window.clearTimeout(loadTimer);
      newSocket.close();
    };
    // Data loaders intentionally use the latest axios client for this session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, client]);

  return (
    <AuthContext.Provider value={{ 
      user, token, login, logout, loading, refreshData,
      rooms, checkoutRoom, updateRoomStatus,
      tasks, createTask, updateTaskStatus, markTaskComplete,
      tickets, createMaintenanceTicket, updateTicketStatus,
      notifications, markNotificationRead,
      stats, activities
    }}>
      {children}
    </AuthContext.Provider>
  );
};
