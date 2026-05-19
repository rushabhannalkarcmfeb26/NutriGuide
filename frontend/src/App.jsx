import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Meals from './pages/Meals';
import Progress from './pages/Progress';
import Analytics from './pages/Analytics';
import Help from './pages/Help';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/" />;          // send guests to landing
    if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" />;

    return (
        <div className="app-container">
            <Navbar />
            {children}
        </div>
    );
};

// Prevents logged-in users from seeing login/register — sends them to dashboard/admin
const AuthRedirect = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    if (user) {
        return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
    }
    return children;
};

// Shows landing page for guests; redirects logged-in users straight to dashboard/admin
const HomeRedirect = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    if (user) {
        return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
    }
    return <LandingPage />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
            <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminPanel /></ProtectedRoute>} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <AppRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
