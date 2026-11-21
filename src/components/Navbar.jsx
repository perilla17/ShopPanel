import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LogoutButton from './LogoutButton.jsx';

const claseEnlace = ({ isActive }) => `nav-link${isActive ? ' active fw-semibold' : ''}`;

// Barra de navegación de las páginas internas (productos y detalle).
export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand bg-white border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/productos">ShopPanel</Link>
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><NavLink className={claseEnlace} to="/productos">Productos</NavLink></li>
          <li className="nav-item"><NavLink className={claseEnlace} to="/pedidos">Pedidos</NavLink></li>
        </ul>
        <div className="d-flex align-items-center gap-3">
          <span className="small text-secondary d-none d-sm-inline">{user?.email}</span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
