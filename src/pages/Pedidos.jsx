import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { crearPedido, ESTADOS_PEDIDO, guardarPedidos, obtenerPedidos } from '../services/orderService.js';

const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const fecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

export default function Pedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState(obtenerPedidos);
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [filtro, setFiltro] = useState('Todos');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!guardarPedidos(pedidos)) setError('No se pudieron guardar los pedidos. Revisa el espacio disponible del navegador.');
  }, [pedidos]);

  const visibles = useMemo(() => filtro === 'Todos'
    ? pedidos
    : pedidos.filter((pedido) => pedido.estado === filtro), [pedidos, filtro]);

  function registrar(evento) {
    evento.preventDefault();
    setMensaje('');
    setError('');
    if (!cliente.trim() || !producto.trim()) {
      setError('Escribe el nombre del cliente y del producto.');
      return;
    }
    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 1 || Number(cantidad) > 99) {
      setError('La cantidad debe ser un número entre 1 y 99.');
      return;
    }
    setPedidos((actuales) => [crearPedido({ cliente, producto, cantidad }), ...actuales]);
    setCliente('');
    setProducto('');
    setCantidad('1');
    setMensaje('Pedido registrado y guardado en este navegador.');
  }

  function cambiarEstado(id, estado) {
    setPedidos((actuales) => actuales.map((pedido) => pedido.id === id ? { ...pedido, estado } : pedido));
    setMensaje('Estado del pedido actualizado.');
    setError('');
  }

  return (
    <main className="min-vh-100 bg-body-tertiary">
      <nav className="navbar navbar-expand bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/pedidos">ShopPanel</Link>
          <div className="d-flex align-items-center gap-3">
            <span className="small text-secondary d-none d-sm-inline">{user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <div className="container py-4 py-lg-5">
        <header className="mb-4">
          <p className="text-primary fw-semibold mb-1">Administración</p>
          <h1 className="h2 mb-1">Pedidos</h1>
          <p className="text-secondary mb-0">Consulta pedidos, registra ejemplos y actualiza su estado.</p>
        </header>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

        <section className="card shadow-sm border-0 mb-4" aria-labelledby="nuevo-pedido">
          <div className="card-body p-4">
            <h2 className="h5 mb-3" id="nuevo-pedido">Registrar pedido de prueba</h2>
            <form className="row g-3 align-items-end" onSubmit={registrar}>
              <div className="col-md-4">
                <label className="form-label" htmlFor="cliente">Cliente</label>
                <input className="form-control" id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} maxLength={80} required placeholder="Nombre del cliente" />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="producto">Producto</label>
                <input className="form-control" id="producto" value={producto} onChange={(e) => setProducto(e.target.value)} maxLength={100} required placeholder="Nombre del producto" />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label" htmlFor="cantidad">Cantidad</label>
                <input className="form-control" id="cantidad" type="number" min="1" max="99" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
              </div>
              <div className="col-6 col-md-2 d-grid">
                <button className="btn btn-primary" type="submit">Crear pedido</button>
              </div>
              <div className="col-12"><small className="text-secondary">Precio simulado: {moneda.format(25000)} por unidad.</small></div>
            </form>
          </div>
        </section>

        <section className="card shadow-sm border-0" aria-labelledby="lista-pedidos">
          <div className="card-body p-0">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 p-4 border-bottom">
              <div><h2 className="h5 mb-1" id="lista-pedidos">Pedidos registrados</h2><span className="small text-secondary">{pedidos.length} en total</span></div>
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
                <p className="text-secondary small mb-0">{pedidos.length ? 'Elige otro estado para ver más resultados.' : 'Registra un pedido de prueba y aparecerá aquí.'}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light"><tr><th className="ps-4">Pedido</th><th>Cliente</th><th>Producto</th><th>Total</th><th>Fecha</th><th className="pe-4">Estado</th></tr></thead>
                  <tbody>{visibles.map((pedido) => (
                    <tr key={pedido.id}>
                      <td className="ps-4"><span className="fw-semibold">#{pedido.id.slice(0, 8)}</span><div className="small text-secondary">{pedido.cantidad} unidad{pedido.cantidad === 1 ? '' : 'es'}</div></td>
                      <td>{pedido.cliente}</td><td>{pedido.producto}</td><td>{moneda.format(pedido.total)}</td>
                      <td className="small text-secondary">{fecha.format(new Date(pedido.creadoEn))}</td>
                      <td className="pe-4"><select aria-label={`Estado del pedido ${pedido.id.slice(0, 8)}`} className={`form-select form-select-sm estado-${pedido.estado.toLowerCase()}`} value={pedido.estado} onChange={(e) => cambiarEstado(pedido.id, e.target.value)}>{ESTADOS_PEDIDO.map((estado) => <option key={estado}>{estado}</option>)}</select></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        </section>
        <p className="small text-secondary mt-3 mb-0">Los pedidos de esta demostración se guardan localmente en este navegador.</p>
      </div>
    </main>
  );
}
