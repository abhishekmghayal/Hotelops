import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboards
import ManagerDashboard from './pages/Manager/Dashboard';
import FrontDeskDashboard from './pages/FrontDesk/Dashboard';
import HousekeepingDashboard from './pages/Housekeeping/Dashboard';
import MaintenanceDashboard from './pages/Maintenance/Dashboard';

// Other Pages
import RoomStatus from './pages/Rooms/RoomStatus';
import Reports from './pages/Reports/Reports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/login" replace />} />
            
            {/* Manager Routes */}
            <Route path="manager" element={<ManagerDashboard />} />
            <Route path="reports" element={<Reports />} />
            
            {/* Front Desk Routes */}
            <Route path="frontdesk" element={<FrontDeskDashboard />} />
            
            {/* Shared Routes */}
            <Route path="rooms" element={<RoomStatus />} />
            
            {/* Staff Routes */}
            <Route path="housekeeping" element={<HousekeepingDashboard />} />
            <Route path="maintenance" element={<MaintenanceDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
