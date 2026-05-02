import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";

export default function Subscription() {
  const [products, setProducts] = useState([]);
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState({ productId: "", frequency: "weekly", quantity: 1, nextOrderDate: new Date().toISOString().slice(0,10) });

  const load = async () => {
    const [p, s] = await Promise.all([api.get("/products"), api.get("/subscriptions")]);
    setProducts(p.data); setSubs(s.data);
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => { e.preventDefault(); await api.post("/subscriptions", form); load(); };
  const remove = async (id) => { await api.delete(`/subscriptions/${id}`); load(); };

  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Subscription Orders</h1>
    <form className="card p-4 grid gap-3 md:grid-cols-4" onSubmit={create}>
      <select className="input" value={form.productId} onChange={(e)=>setForm({...form,productId:e.target.value})}>{products.map((p)=><option key={p._id} value={p._id}>{p.name}</option>)}</select>
      <select className="input" value={form.frequency} onChange={(e)=>setForm({...form,frequency:e.target.value})}><option>daily</option><option>weekly</option><option>monthly</option></select>
      <input className="input" type="number" value={form.quantity} onChange={(e)=>setForm({...form,quantity:+e.target.value})} />
      <button className="btn-primary">Create</button>
    </form>
    <div className="grid gap-3">{subs.map((s)=><div key={s._id} className="card p-4 flex justify-between"><span>{s.productId?.name} ({s.frequency})</span><button className="btn border" onClick={()=>remove(s._id)}>Delete</button></div>)}</div>
  </DashboardLayout>;
}
