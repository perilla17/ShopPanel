import traducciones from '../data/productosEs.json' with { type: 'json' };

const categorias = {
  beauty: 'Belleza',
  fragrances: 'Fragancias',
  furniture: 'Muebles',
  groceries: 'Alimentos y mercado',
  'home-decoration': 'Decoración del hogar',
  'kitchen-accessories': 'Accesorios de cocina',
  laptops: 'Computadores portátiles',
  'mens-shirts': 'Camisas para hombre',
  'mens-shoes': 'Calzado para hombre',
  'mens-watches': 'Relojes para hombre',
  'mobile-accessories': 'Accesorios para celulares',
  motorcycle: 'Motocicletas',
  'skin-care': 'Cuidado de la piel',
  smartphones: 'Celulares',
  'sports-accessories': 'Artículos deportivos',
  sunglasses: 'Gafas de sol',
  tablets: 'Tabletas',
  tops: 'Blusas y camisetas',
  vehicle: 'Vehículos',
  'womens-bags': 'Bolsos para mujer',
  'womens-dresses': 'Vestidos para mujer',
  'womens-jewellery': 'Joyería para mujer',
  'womens-shoes': 'Calzado para mujer',
  'womens-watches': 'Relojes para mujer',
};

function buscarTraduccion(id, tituloOriginal) {
  const traduccion = traducciones[id];
  return traduccion?.original === tituloOriginal ? traduccion : undefined;
}

export function nombreProductoEnEspanol(id, nombre) {
  return buscarTraduccion(id, nombre)?.titulo ?? nombre;
}

export function localizarProducto(producto) {
  if (!Number.isSafeInteger(producto?.id)
    || typeof producto.title !== 'string'
    || typeof producto.description !== 'string'
    || !Number.isFinite(producto.price)) {
    throw new Error('El servicio devolvió un producto con datos inválidos.');
  }

  const traduccion = buscarTraduccion(producto.id, producto.title);
  return {
    ...producto,
    title: traduccion?.titulo ?? producto.title,
    description: traduccion?.descripcion ?? producto.description,
    category: categorias[producto.category] ?? 'Otra categoría',
    tituloOriginal: producto.title,
    descripcionOriginal: producto.description,
    categoriaOriginal: producto.category,
  };
}
