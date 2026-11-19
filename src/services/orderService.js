const STORAGE_KEY = 'shoppanel.pedidos';

export const ESTADOS_PEDIDO = ['Pendiente', 'Confirmado', 'Enviado', 'Cancelado'];

export function listarPedidos() {
  const datos = localStorage.getItem(STORAGE_KEY);
  if (datos === null) return [];

  const pedidos = JSON.parse(datos);
  if (!Array.isArray(pedidos)) {
    throw new Error('Los pedidos guardados tienen un formato inválido.');
  }
  return pedidos;
}

export function crearPedido(producto, cantidad = 1) {
  if (!Number.isInteger(producto?.id) || producto.id < 1 ||
      typeof producto.title !== 'string' || !producto.title.trim() ||
      !Number.isFinite(producto.price) || producto.price < 0 ||
      !Number.isInteger(cantidad) || cantidad < 1) {
    throw new Error('Selecciona un producto válido y una cantidad entera mayor que cero.');
  }

  const pedido = {
    id: crypto.randomUUID(),
    productoId: producto.id,
    nombre: producto.title,
    precioUnitario: producto.price,
    cantidad,
    estado: ESTADOS_PEDIDO[0],
    creadoEn: new Date().toISOString(),
  };
  const pedidos = [pedido, ...listarPedidos()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
  return pedido;
}

export function cambiarEstadoPedido(id, estado) {
  if (!ESTADOS_PEDIDO.includes(estado)) {
    throw new Error('El estado seleccionado no es válido.');
  }

  const pedidos = listarPedidos();
  const indice = pedidos.findIndex((pedido) => pedido.id === id);
  if (indice === -1) throw new Error('No se encontró el pedido.');

  pedidos[indice] = { ...pedidos[indice], estado };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
  return pedidos;
}
