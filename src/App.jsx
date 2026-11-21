import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LogoutButton from './components/LogoutButton.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Pedidos from './pages/Pedidos.jsx';

// Punto de entrada temporal para probar el acceso antes de integrar el catálogo.
function PanelDeSesion() {
  const { user, loading } = useAuth();

  if (loading) return <p className="container py-4" role="status">Comprobando sesión…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="container py-4">
      <h1>ShopPanel</h1>
      <p>Sesión activa: {user.email}</p>
      <LogoutButton />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/pedidos" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/productos" element={<PanelDeSesion />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
