import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><span className="spinner" /> Loading your workspace</div>;
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}
