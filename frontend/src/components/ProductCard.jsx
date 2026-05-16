export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card p-4 overflow-hidden">
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-sm text-slate-500">{product.vendorId?.name} | {product.categoryId?.name}</p>
      <p className="mt-2 text-sm">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-extrabold bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">{"\u09F3"}{product.price}</span>
        {onAdd && <button className="btn-primary" onClick={() => onAdd(product)}>Add</button>}
      </div>
    </div>
  );
}
