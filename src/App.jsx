import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Pedidos from './pages/Pedidos.jsx';
import Productos from './pages/Productos.jsx';

// Diseño de las páginas de catálogo: barra de navegación + contenido.
function LayoutConNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/productos" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/pedidos" element={<Pedidos />} />
            <Route element={<LayoutConNavbar />}>
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<DetalleProducto />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
