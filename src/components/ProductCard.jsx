import { Link } from 'react-router-dom';

// Tarjeta reutilizable: recibe el producto mediante props.
export default function ProductCard({ product }) {
  const { id, title, description, price, thumbnail } = product;

  return (
    <article className="card h-100 shadow-sm">
      <img
        src={thumbnail}
        alt={title}
        className="card-img-top p-3"
        style={{ height: 200, objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <h2 className="h5 card-title">{title}</h2>
        <p className="card-text text-muted small flex-grow-1">
          {description.length > 90 ? `${description.slice(0, 90)}…` : description}
        </p>
        <p className="fw-bold fs-5 mb-3">${price.toFixed(2)}</p>
        <Link to={`/productos/${id}`} className="btn btn-outline-primary btn-sm">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
