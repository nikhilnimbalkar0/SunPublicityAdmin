import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ManageUsers from './pages/ManageUsers';
import ManageHoardings from './pages/ManageHoardings';
import ManageBookings from './pages/ManageBookings';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/home" replace />} />
                <Route path="home" element={<Home />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="hoardings" element={<ManageHoardings />} />
                <Route path="bookings" element={<ManageBookings />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/admin/home" replace />} />
              <Route path="*" element={<Navigate to="/admin/home" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
