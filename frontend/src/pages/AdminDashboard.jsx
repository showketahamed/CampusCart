import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import DashboardStats from "../components/DashboardStats";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, vendors: 0, products: 0, orders: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const [s, u, v, o] = await Promise.all([
      api.get("/management/admin/stats"),
      api.get("/management/users"),
      api.get("/management/vendors"),
      api.get("/orders")
    ]);
    setStats(s.data);
    setUsers(u.data);
    setVendors(v.data);
    setOrders(o.data);
  };

  useEffect(() => { load(); }, []);

  const updateUserStatus = async (id, status) => { await api.patch(`/management/users/${id}/status`, { status }); load(); };
  const updateVendorStatus = async (id, status) => { await api.patch(`/management/vendors/${id}/status`, { status }); load(); };
  const updateOrderStatus = async (id, orderStatus) => { await api.patch(`/orders/${id}/status`, { orderStatus }); load(); };

  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
    <DashboardStats stats={stats} />

    <div className="grid gap-4 xl:grid-cols-3">
      <section className="card p-4">
        <h2 className="text-xl font-bold mb-3">Manage Students/Users</h2>
        <div className="space-y-2 max-h-80 overflow-auto">
          {users.map((u) => (
            <div key={u._id} className="border rounded-xl p-2 flex items-center justify-between gap-2">
              <div><p className="font-medium">{u.name}</p><p className="text-xs">{u.role}</p></div>
              <select className="input w-32" value={u.status} onChange={(e) => updateUserStatus(u._id, e.target.value)}>
                <option>active</option><option>blocked</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="text-xl font-bold mb-3">Manage Vendors</h2>
        <div className="space-y-2 max-h-80 overflow-auto">
          {vendors.map((v) => (
            <div key={v._id} className="border rounded-xl p-2 flex items-center justify-between gap-2">
              <div><p className="font-medium">{v.name}</p><p className="text-xs">{v.type}</p></div>
              <select className="input w-36" value={v.status} onChange={(e) => updateVendorStatus(v._id, e.target.value)}>
                <option>pending</option><option>approved</option><option>blocked</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="text-xl font-bold mb-3">Manage Orders</h2>
        <div className="space-y-2 max-h-80 overflow-auto">
          {orders.map((o) => (
            <div key={o._id} className="border rounded-xl p-2 flex items-center justify-between gap-2">
              <div><p className="font-medium text-sm">{o.orderNumber}</p><p className="text-xs">{o.paymentMethod}</p></div>
              <select className="input w-36" value={o.orderStatus} onChange={(e) => updateOrderStatus(o._id, e.target.value)}>
                <option>pending</option><option>confirmed</option><option>preparing</option><option>ready</option><option>delivered</option><option>cancelled</option>
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  </DashboardLayout>;
}
