// Consulta de productos en DummyJSON (solo solicitudes GET con fetch).
const BASE_URL = 'https://dummyjson.com/products';

async function solicitar(url) {
  let respuesta;
  try {
    respuesta = await fetch(url);
  } catch {
    // Falla de red: sin internet o API caída.
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
  return respuesta.json();
}

// GET /products
export async function getProducts(limite = 30) {
  const datos = await solicitar(`${BASE_URL}?limit=${limite}`);
  return datos.products;
}

// GET /products/{id}
export function getProductById(id) {
  return solicitar(`${BASE_URL}/${encodeURIComponent(id)}`);
}

// GET /products/search?q=termino (opcional)
export async function searchProducts(termino) {
  const datos = await solicitar(`${BASE_URL}/search?q=${encodeURIComponent(termino)}`);
  return datos.products;
}
