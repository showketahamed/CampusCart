export default function VendorCard({ vendor, onSelect }) {
  const image = `https://picsum.photos/seed/vendor-${vendor._id}/600/320`;
  return (
    <div className="card p-4 overflow-hidden">
      <img className="w-full h-36 object-cover rounded-xl mb-3" src={image} alt={vendor.name} />
      <h3 className="font-bold text-lg">{vendor.name}</h3>
      <p className="text-sm text-slate-500 capitalize">{vendor.type}</p>
      <p className="mt-2 text-sm">{vendor.description}</p>
      <button className="btn-primary mt-3" onClick={() => onSelect(vendor)}>Browse</button>
    </div>
  );
}
