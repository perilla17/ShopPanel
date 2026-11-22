const STORAGE_KEY = 'shoppanel.pedidos.v1';

export const ESTADOS_PEDIDO = ['Pendiente', 'Confirmado', 'Enviado', 'Cancelado'];

function esPedidoGuardado(pedido) {
  return typeof pedido?.id === 'string'
    && typeof pedido.cliente === 'string'
    && typeof pedido.producto === 'string'
    && Number.isInteger(pedido.cantidad)
    && Number.isFinite(pedido.total)
    && ESTADOS_PEDIDO.includes(pedido.estado)
    && typeof pedido.creadoEn === 'string'
    && Number.isFinite(Date.parse(pedido.creadoEn));
}

export function obtenerPedidos() {
  let pedidos;
  try {
    const guardados = localStorage.getItem(STORAGE_KEY);
    if (guardados === null) return [];
    pedidos = JSON.parse(guardados);
  } catch {
    throw new Error('No se pudieron leer los pedidos de este navegador.');
  }
  if (!Array.isArray(pedidos) || !pedidos.every(esPedidoGuardado)) {
    throw new Error('Los pedidos guardados tienen un formato inválido.');
  }
  return pedidos;
}

function guardarPedidos(pedidos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
  } catch {
    throw new Error('No se pudieron guardar los pedidos en este navegador.');
  }
}

export function crearPedido({ cliente, producto, cantidad }) {
  const nombreCliente = cliente?.trim();
  const unidades = Number(cantidad);
  const imagen = producto?.thumbnail || producto?.images?.[0];

  if (!nombreCliente) throw new Error('Escribe el nombre del cliente.');
  if (!Number.isInteger(unidades) || unidades < 1 || unidades > 99) {
    throw new Error('La cantidad debe ser un número entero entre 1 y 99.');
  }
  if (!Number.isSafeInteger(producto?.id) || producto.id < 1
    || typeof producto.title !== 'string' || !producto.title.trim()
    || !Number.isFinite(producto.price) || producto.price < 0
    || typeof imagen !== 'string' || !imagen.trim()) {
    throw new Error('Faltan datos del producto. Vuelve al catálogo e inténtalo de nuevo.');
  }

  const pedido = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    cliente: nombreCliente,
    productoId: producto.id,
    producto: producto.title,
    imagen,
    cantidad: unidades,
    precioUnitario: producto.price,
    total: Math.round(producto.price * 100) * unidades / 100,
    moneda: 'USD',
    estado: 'Pendiente',
    creadoEn: new Date().toISOString(),
  };

  guardarPedidos([pedido, ...obtenerPedidos()]);
  return pedido;
}

export function cambiarEstadoPedido(id, estado) {
  if (!ESTADOS_PEDIDO.includes(estado)) {
    throw new Error('Selecciona un estado de pedido válido.');
  }

  const pedidos = obtenerPedidos();
  const pos = pedidos.findIndex((pedido) => pedido.id === id);
  if (pos === -1) throw new Error('No se encontró el pedido.');

  pedidos[pos] = { ...pedidos[pos], estado };
  guardarPedidos(pedidos);
  return pedidos;
}
