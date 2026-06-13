import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import { useNotify } from "../utils/useNotify";

export default function StudentDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const notify = useNotify();

  const load = async () => {
    const [p, c] = await Promise.all([
      api.get("/products", { params: { search, categoryId } }),
      api.get("/categories")
    ]);
    setProducts(p.data);
    setCategories(c.data);
  };

  useEffect(() => { load(); }, [search, categoryId]);

  const options = useMemo(() => categories.map((c) => ({ value: c._id, label: c.name })), [categories]);

  const add = async (product) => {
    try {
      await api.post("/cart", { productId: product._id, quantity: 1 });
      notify.notifySuccess(`${product.name} added to cart.`);
    } catch (err) {
      notify.notifyError(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Student Dashboard</h1>
    <div className="grid gap-3 md:grid-cols-2">
      <SearchBar value={search} onChange={setSearch} placeholder="Search products" />
      <FilterBar value={categoryId} onChange={setCategoryId} options={options} label="categories" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => <ProductCard key={p._id} product={p} onAdd={add} />)}
    </div>
  </DashboardLayout>;
}
