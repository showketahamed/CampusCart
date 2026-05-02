import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";

const flow = ["pending", "confirmed", "preparing", "ready", "delivered"];

export default function OrderStatus() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/orders/${orderId}`).then((r) => setData(r.data)); }, [orderId]);
  if (!data) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  const idx = flow.indexOf(data.order.orderStatus);
  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Order Status</h1>
    <div className="grid gap-3 md:grid-cols-5">{flow.map((s,i)=><div key={s} className={`card p-3 ${i<=idx?"bg-brand-600 text-white":""}`}>{s}</div>)}</div>
    <div className="card p-4 mt-4"><p>Order: {data.order.orderNumber}</p><p>Total: ৳{data.order.total}</p></div>
  </DashboardLayout>;
}
