import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import Modal from "../components/Modal";
import { useNotify } from "../utils/useNotify";

const initial = { name: "", categoryId: "", description: "", price: 0, quantity: 1, stockStatus: "in_stock", status: "active" };

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const notify = useNotify();
  const lowStockItems = products.filter((product) => Number(product.quantity) <= 5);

  const load = async () => {
    const [p, c] = await Promise.all([api.get("/products/my"), api.get("/categories")]);
    setProducts(p.data);
    setCategories(c.data);
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/products", form);
      setForm(initial);
      notify.notifySuccess("Product added.");
      load();
    } catch (err) {
      notify.notifyError(err.response?.data?.message || "Failed to add product.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    setBusy(true);
    try {
      await api.delete(`/products/${id}`);
      notify.notifySuccess("Product deleted.");
      load();
    } catch (err) {
      notify.notifyError(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (product) => {
    setEditing({
      id: product._id,
      name: product.name,
      categoryId: product.categoryId?._id || "",
      description: product.description || "",
      price: Number(product.price || 0),
      quantity: Number(product.quantity || 1),
      stockStatus: product.stockStatus || "in_stock",
      status: product.status || "active"
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put(`/products/${editing.id}`, editing);
      notify.notifySuccess("Product updated.");
      setEditing(null);
      load();
    } catch (err) {
      notify.notifyError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setBusy(false);
    }
  };

  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Vendor Products</h1>
    <div className="card p-4 bg-amber-50 border-amber-200">
      <p className="font-semibold">Inventory Insight</p>
      <p className="text-sm text-slate-700">
        {lowStockItems.length
          ? `${lowStockItems.length} item(s) are low on stock. Restock soon to avoid missing orders.`
          : "Great job. All products are sufficiently stocked."}
      </p>
    </div>
    <form onSubmit={create} className="card p-4 grid gap-3 md:grid-cols-3">
      <input className="input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
      <select className="input" value={form.categoryId} onChange={(e)=>setForm({...form,categoryId:e.target.value})}>
        <option value="">Select category</option>
        {categories.map((c)=><option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <input className="input" placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form,price:+e.target.value})} />
      <input className="input" placeholder="Quantity" type="number" value={form.quantity} onChange={(e)=>setForm({...form,quantity:+e.target.value})} />
      <input className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      <button className="btn-primary disabled:opacity-60" disabled={busy}>Add Product</button>
    </form>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {products.map((p)=>(
        <div className="card p-4 space-y-2" key={p._id}>
          <h3 className="font-bold">{p.name}</h3>
          <p className="text-sm text-slate-500">{p.categoryId?.name}</p>
          <p>?{p.price} | Qty: {p.quantity} | {p.status}</p>
          <div className="flex gap-2">
            <button className="btn border" onClick={()=>startEdit(p)}>Edit</button>
            <button className="btn border" onClick={()=>remove(p._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>

    <Modal open={Boolean(editing)} title="Update Product" onClose={() => setEditing(null)}>
      {editing && (
        <form onSubmit={saveEdit} className="space-y-3">
          <input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <select className="input" value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <textarea className="input" rows="3" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
            <input className="input" type="number" value={editing.quantity} onChange={(e) => setEditing({ ...editing, quantity: +e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select className="input" value={editing.stockStatus} onChange={(e) => setEditing({ ...editing, stockStatus: e.target.value })}>
              <option value="in_stock">in_stock</option>
              <option value="low_stock">low_stock</option>
              <option value="out_of_stock">out_of_stock</option>
            </select>
            <select className="input" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <button className="btn-primary w-full disabled:opacity-60" disabled={busy}>Save Changes</button>
        </form>
      )}
    </Modal>
  </DashboardLayout>;
}
