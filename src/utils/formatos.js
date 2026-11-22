const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  currencyDisplay: 'code',
  maximumFractionDigits: 0,
});

const dolares = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'code',
});

export function formatearPrecio(valor, moneda = 'USD') {
  return (moneda === 'COP' ? pesos : dolares).format(valor);
}
