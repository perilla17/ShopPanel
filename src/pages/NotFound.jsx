import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container py-4">
      <h1>404 · Página no encontrada</h1>
      <p>La dirección que intentaste abrir no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
