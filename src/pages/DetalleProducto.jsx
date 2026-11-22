import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { crearPedido } from '../services/orderService.js';
import { getProductById } from '../services/productService.js';
import { formatearPrecio } from '../utils/formatos.js';

const calificacion = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

// Ruta dinámica /productos/:id
export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    setError('');
    setNotFound(false);

    getProductById(id)
      .then((datos) => {
        if (activo) setProduct(datos);
      })
      .catch((err) => {
        if (!activo) return;
        if (err.status === 404) setNotFound(true);
        else setError(err.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="container text-center py-5" role="status">
        <div className="spinner-border" aria-hidden="true" />
        <p className="mt-2">Cargando producto…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">Producto no encontrado</h1>
        <p className="text-muted">El producto con id {id} no existe.</p>
        <Link to="/productos" className="btn btn-primary">Volver al listado</Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <p className="alert alert-danger" role="alert">{error}</p>
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/productos')}>
          Volver al listado
        </button>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <button className="btn btn-link px-0 mb-3" type="button" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="row g-4">
        <div className="col-md-5">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="img-fluid rounded border p-3 w-100"
          />
        </div>
        <div className="col-md-7">
          <h1 className="h2">{product.title}</h1>
          <p className="text-muted">
            {product.brand ? `${product.brand} · ` : ''}
            {product.category}
          </p>
          <p>{product.description}</p>
          <p className="fs-3 fw-bold">{formatearPrecio(product.price)}</p>
          <p className="mb-1">Calificación: {calificacion.format(product.rating)}</p>
          <p>Unidades disponibles: {product.stock}</p>
          <FormularioPedido key={product.id} producto={product} />
        </div>
      </div>
    </main>
  );
}

function FormularioPedido({ producto }) {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [error, setError] = useState('');

  function registrar(evento) {
    evento.preventDefault();
    setError('');
    try {
      crearPedido({ cliente, producto, cantidad });
      navigate('/pedidos', { state: { pedidoRegistrado: true } });
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  return (
    <section className="card shadow-sm mt-4" aria-labelledby="titulo-nuevo-pedido">
      <div className="card-body">
        <h2 id="titulo-nuevo-pedido" className="h5 mb-3">Nuevo pedido</h2>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <form className="row g-3 align-items-end" onSubmit={registrar} noValidate>
          <div className="col-sm-8">
            <label className="form-label" htmlFor="cliente-pedido">Cliente</label>
            <input
              className="form-control"
              id="cliente-pedido"
              maxLength={80}
              placeholder="Nombre del cliente"
              required
              value={cliente}
              onChange={(evento) => setCliente(evento.target.value)}
            />
          </div>
          <div className="col-sm-4">
            <label className="form-label" htmlFor="cantidad-pedido">Cantidad</label>
            <input
              className="form-control"
              id="cantidad-pedido"
              type="number"
              min="1"
              max="99"
              step="1"
              required
              value={cantidad}
              onChange={(evento) => setCantidad(evento.target.value)}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-primary" type="submit">Registrar pedido</button>
          </div>
        </form>
      </div>
    </section>
  );
}
