import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { cambiarEstadoPedido, ESTADOS_PEDIDO, obtenerPedidos } from '../services/orderService.js';
import { nombreProductoEnEspanol } from '../services/productLocalization.js';
import { formatearPrecio } from '../utils/formatos.js';

const fecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

export default function Pedidos() {
  const [pedidos, setPedidos] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const { pathname, search, hash, state } = useLocation();
  const navigate = useNavigate();
  const pedidoRegistrado = state?.pedidoRegistrado === true;

  useEffect(() => {
    try {
      setPedidos(obtenerPedidos());
    } catch (fallo) {
      setError(fallo.message);
    }
  }, []);

  useEffect(() => {
    if (!pedidoRegistrado) return;
    setMensaje('Pedido registrado y guardado en este navegador.');
    navigate({ pathname, search, hash }, { replace: true, state: null });
  }, [pedidoRegistrado, pathname, search, hash, navigate]);

  const visibles = filtro === 'Todos' ? pedidos : pedidos?.filter((pedido) => pedido.estado === filtro);

  function actualizarEstado(id, estado) {
    setMensaje('');
    setError('');
    try {
      setPedidos(cambiarEstadoPedido(id, estado));
      setMensaje('Estado del pedido actualizado.');
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  return (
    <div className="min-vh-100 bg-body-tertiary">
      <Navbar />
      <main className="container py-4 py-lg-5">
        <header className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <p className="text-primary fw-semibold mb-1">Administración</p>
            <h1 className="h2 mb-1">Pedidos</h1>
            <p className="text-secondary mb-0">Consulta los productos que pediste y actualiza su estado.</p>
          </div>
          <Link className="btn btn-outline-primary" to="/productos">Ver catálogo</Link>
        </header>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
        {!pedidos && !error && <p role="status">Cargando pedidos…</p>}

        {pedidos && (
          <section className="card shadow-sm border-0" aria-labelledby="lista-pedidos">
            <div className="card-body p-0">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 p-4 border-bottom">
                <div>
                  <h2 className="h5 mb-1" id="lista-pedidos">Pedidos registrados</h2>
                  <span className="small text-secondary">{pedidos.length} en total</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="small text-secondary" htmlFor="filtro-estado">Estado</label>
                  <select className="form-select form-select-sm" id="filtro-estado" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                    <option>Todos</option>
                    {ESTADOS_PEDIDO.map((estado) => <option key={estado}>{estado}</option>)}
                  </select>
                </div>
              </div>
              {visibles.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <p className="h6 mb-1">{pedidos.length ? 'No hay pedidos con ese estado' : 'Aún no hay pedidos'}</p>
                  <p className="text-secondary small mb-0">
                    {pedidos.length ? 'Elige otro estado para ver más resultados.' : 'Abre un producto del catálogo para registrar tu primer pedido.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="ps-4">Pedido</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Total</th>
                        <th scope="col">Fecha</th>
                        <th scope="col" className="pe-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibles.map((pedido) => {
                        const moneda = pedido.moneda === 'USD' ? 'USD' : 'COP';
                        const nombre = nombreProductoEnEspanol(pedido.productoId, pedido.producto);
                        const idCorto = pedido.id.slice(0, 8);
                        return (
                          <tr key={pedido.id}>
                            <td className="ps-4">
                              <span className="fw-semibold">#{idCorto}</span>
                              <div className="small text-secondary">{pedido.cantidad} {pedido.cantidad === 1 ? 'unidad' : 'unidades'}</div>
                            </td>
                            <td>{pedido.cliente}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {pedido.imagen && (
                                  <img className="rounded object-fit-contain bg-body-tertiary" src={pedido.imagen} alt="" width="48" height="48" loading="lazy" />
                                )}
                                <div>
                                  {pedido.productoId
                                    ? <Link to={`/productos/${pedido.productoId}`}>{nombre}</Link>
                                    : nombre}
                                  {Number.isFinite(pedido.precioUnitario) && (
                                    <div className="small text-secondary text-nowrap">{formatearPrecio(pedido.precioUnitario, moneda)} por unidad</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="text-nowrap">{formatearPrecio(pedido.total, moneda)}</td>
                            <td className="small text-secondary">{fecha.format(new Date(pedido.creadoEn))}</td>
                            <td className="pe-4">
                              <select
                                aria-label={`Estado del pedido ${idCorto}`}
                                className="form-select form-select-sm"
                                value={pedido.estado}
                                onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                              >
                                {ESTADOS_PEDIDO.map((estado) => <option key={estado}>{estado}</option>)}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
        <p className="small text-secondary mt-3 mb-0">Los pedidos de esta demostración se guardan localmente en este navegador.</p>
      </main>
    </div>
  );
}
