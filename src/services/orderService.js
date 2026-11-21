const STORAGE_KEY = 'shoppanel.pedidos.v1';

export const ESTADOS_PEDIDO = ['Pendiente', 'Confirmado', 'Enviado', 'Cancelado'];

export function obtenerPedidos() {
  try {
    const guardados = localStorage.getItem(STORAGE_KEY);
    if (!guardados) return [];
    const pedidos = JSON.parse(guardados);
    return Array.isArray(pedidos) ? pedidos : [];
  } catch {
    return [];
  }
}

export function guardarPedidos(pedidos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
    return true;
  } catch {
    return false;
  }
}

export function crearPedido({ cliente, producto, cantidad }) {
  const precio = 25000;
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    cliente: cliente.trim(),
    producto: producto.trim(),
    cantidad: Number(cantidad),
    total: Number(cantidad) * precio,
    estado: 'Pendiente',
    creadoEn: new Date().toISOString(),
  };
}
