import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="container min-vh-100 d-flex flex-column align-items-center justify-content-center text-center py-5">
      <p className="display-1 fw-bold text-primary mb-0">404</p>
      <h1 className="h3">No encontramos esta página</h1>
      <p className="text-secondary">Revisa la dirección o vuelve a la gestión de pedidos.</p>
      <Link className="btn btn-primary" to="/pedidos">Ir a pedidos</Link>
    </main>
  );
}
