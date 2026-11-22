import { localizarProducto } from './productLocalization.js';

const BASE_URL = 'https://dummyjson.com/products';
const CAMPOS_CATALOGO = 'id,title,description,price,category,brand,thumbnail,tags';

async function solicitar(url, signal) {
  let respuesta;
  try {
    respuesta = await fetch(url, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('No se pudo conectar con el servicio de productos. Revisa tu conexión.');
  }

  if (respuesta.status === 404) {
    const error = new Error('El producto no existe.');
    error.status = 404;
    throw error;
  }
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al consultar los productos.`);
  }
  try {
    return await respuesta.json();
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('El servicio de productos devolvió una respuesta inválida.');
  }
}

// GET /products
export async function getProducts(signal) {
  const parametros = new URLSearchParams({ limit: '0', select: CAMPOS_CATALOGO });
  const datos = await solicitar(`${BASE_URL}?${parametros}`, signal);
  if (!Array.isArray(datos?.products)) {
    throw new Error('El catálogo tiene un formato inválido.');
  }
  return datos.products.map(localizarProducto);
}

// GET /products/{id}
export async function getProductById(id) {
  const producto = await solicitar(`${BASE_URL}/${encodeURIComponent(id)}`);
  return localizarProducto(producto);
}

function normalizarBusqueda(texto) {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es-CO');
}

export function filtrarProductos(productos, consulta) {
  const termino = normalizarBusqueda(consulta.trim());
  if (!termino) return productos;

  return productos.filter((producto) => {
    const texto = [
      producto.title,
      producto.description,
      producto.category,
      producto.brand,
      producto.tituloOriginal,
      producto.descripcionOriginal,
      producto.categoriaOriginal,
    ].concat(producto.tags ?? []).join(' ');
    return normalizarBusqueda(texto).includes(termino);
  });
}
