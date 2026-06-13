import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import { useNotify } from "../utils/useNotify";

export default function Cart() {
  const [items, setItems] = useState([]);
  const notify = useNotify();
  const load = () => api.get("/cart").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);
  const remove = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      notify.notifySuccess("Item removed from cart.");
      load();
    } catch (err) {
      notify.notifyError(err.response?.data?.message || "Failed to remove item.");
    }
  };
  const subtotal = items.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);
  return <DashboardLayout><h1 className="text-3xl font-extrabold">Cart</h1><div className="space-y-3">{items.map((i)=><div key={i._id} className="card p-4 flex justify-between"><span>{i.productId?.name} x {i.quantity}</span><button onClick={()=>remove(i._id)} className="btn border">Remove</button></div>)}</div><div className="card p-4 font-bold">Subtotal: ৳{subtotal}</div></DashboardLayout>;
}
