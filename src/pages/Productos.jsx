import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts, searchProducts } from '../services/productService.js';

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState('');

  async function cargarProductos(busqueda = '') {
    setLoading(true);
    setError('');
    try {
      const termino = busqueda.trim();
      const datos = termino ? await searchProducts(termino) : await getProducts();
      setProducts(datos);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function buscar(evento) {
    evento.preventDefault();
    cargarProductos(term);
  }

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
          <button className="btn btn-outline-primary" type="submit">Buscar</button>
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
          <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => cargarProductos(term)}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="alert alert-info">No se encontraron productos.</p>
      )}

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </main>
  );
}
