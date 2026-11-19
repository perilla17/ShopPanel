import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState('');

  async function cerrarSesion() {
    setCerrando(true);
    setError('');
    try {
      const { error: errorDeSalida } = await signOut();
      if (errorDeSalida) throw errorDeSalida;
      navigate('/login', { replace: true });
    } catch {
      setError('No se pudo cerrar la sesión. Inténtalo de nuevo.');
    } finally {
      setCerrando(false);
    }
  }

  return (
    <div>
      <button className="btn btn-outline-primary" type="button" disabled={cerrando} onClick={cerrarSesion}>
        {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
      {error && <p className="text-danger mt-2 mb-0" role="alert">{error}</p>}
    </div>
  );
}
