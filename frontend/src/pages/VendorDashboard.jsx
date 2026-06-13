import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import DashboardStats from "../components/DashboardStats";

export default function VendorDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const [s, o] = await Promise.all([
      api.get("/management/vendor/stats"),
      api.get("/orders")
    ]);
    setStats(s.data);
    setOrders(o.data);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, orderStatus) => {
    await api.patch(`/orders/${id}/status`, { orderStatus });
    load();
  };

  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Vendor Dashboard</h1>
    <DashboardStats stats={stats} />
    <div className="card p-4">
      <h2 className="text-xl font-bold mb-3">Own Orders</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="border rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <p className="font-semibold">{o.orderNumber}</p>
              <p className="text-sm text-slate-500">Status: {o.orderStatus}</p>
            </div>
            <select className="input md:w-56" value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)}>
              <option>pending</option><option>confirmed</option><option>preparing</option><option>ready</option><option>delivered</option><option>cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>;
}
