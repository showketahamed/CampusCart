export default function OrderCard({ order, children }) {
  return (
    <div className="card p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">{order.orderNumber}</h3>
          <p className="text-sm text-slate-500">{order.vendorId?.name}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm">{order.orderStatus}</span>
      </div>
      <p className="mt-2 text-sm">Payment: {order.paymentMethod} / {order.paymentStatus}</p>
      <p className="font-semibold mt-1">Total: ৳{order.total}</p>
      {children}
    </div>
  );
}
