import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ session, loading }) {
  const location = useLocation();

  if (loading) return <p role="status">Comprobando sesión…</p>;
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
