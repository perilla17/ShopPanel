import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { filtrarProductos, getProducts } from '../services/productService.js';

const PRODUCTOS_INICIALES = 30;

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState('');
  const [consulta, setConsulta] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    getProducts(controlador.signal)
      .then((datos) => {
        if (!controlador.signal.aborted) setProducts(datos);
      })
      .catch((fallo) => {
        if (!controlador.signal.aborted) setError(fallo.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setLoading(false);
      });
    return () => controlador.abort();
  }, [intento]);

  function reintentar() {
    setError('');
    setLoading(true);
    setIntento((actual) => actual + 1);
  }

  function buscar(evento) {
    evento.preventDefault();
    setConsulta(term.trim());
  }

  const visibles = consulta ? filtrarProductos(products, consulta) : products.slice(0, PRODUCTOS_INICIALES);

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h1 className="h2 mb-0">Productos</h1>
        <form className="d-flex gap-2" onSubmit={buscar}>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar producto…"
            aria-label="Buscar producto"
            value={term}
            onChange={(evento) => setTerm(evento.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit" disabled={loading}>Buscar</button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-5" role="status">
          <div className="spinner-border" aria-hidden="true" />
          <p className="mt-2">Cargando productos…</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" type="button" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && visibles.length === 0 && (
        <p className="alert alert-info">No se encontraron productos.</p>
      )}

      <div className="row g-4">
        {visibles.map((product) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </main>
  );
}
