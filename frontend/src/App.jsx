import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './hooks/useAuth.js';
import { Login } from './components/Auth/Login.jsx';
import { Signup } from './components/Auth/Signup.jsx';
import { Classroom } from './components/Classroom/Classroom.jsx';
import { TeacherDashboard } from './components/Dashboard/TeacherDashboard.jsx';
import { StudentDashboard } from './components/Dashboard/StudentDashboard.jsx';
import { ROLES } from './utils/constants.js';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;

  return children;
};

const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === ROLES.TEACHER ? <TeacherDashboard /> : <StudentDashboard />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/classroom/:roomCode"
            element={
              <ProtectedRoute>
                <Classroom />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
