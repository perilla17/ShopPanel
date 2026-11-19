import { useEffect, useState } from 'react';
import {
  cambiarEstadoPedido,
  ESTADOS_PEDIDO,
  listarPedidos,
} from '../services/orderService.js';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setPedidos(listarPedidos());
    } catch {
      setError('No se pudieron leer los pedidos guardados en este navegador.');
    }
  }, []);

  function actualizarEstado(id, estado) {
    try {
      setPedidos(cambiarEstadoPedido(id, estado));
      setError('');
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  return (
    <section className="container py-4" aria-labelledby="titulo-pedidos">
      <h1 id="titulo-pedidos">Mis pedidos</h1>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {pedidos === null && !error && <p role="status">Cargando pedidos…</p>}
      {pedidos?.length === 0 && <p>Todavía no tienes pedidos.</p>}
      {pedidos?.length > 0 && (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li className="list-group-item" key={pedido.id}>
              <h2 className="h5">{pedido.nombre}</h2>
              <p>Cantidad: {pedido.cantidad}</p>
              <label className="form-label" htmlFor={`estado-${pedido.id}`}>Estado</label>
              <select
                className="form-select"
                id={`estado-${pedido.id}`}
                value={pedido.estado}
                onChange={(evento) => actualizarEstado(pedido.id, evento.target.value)}
              >
                {ESTADOS_PEDIDO.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
