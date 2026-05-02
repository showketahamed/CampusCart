import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data));
  }, [id]);

  if (!product) return <div><Navbar /><div className="p-10">Loading...</div></div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 card p-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-slate-500">{product.vendorId?.name}</p>
        <p className="mt-3">{product.description}</p>
        <p className="mt-3 font-bold">?{product.price}</p>
      </div>
    </div>
  );
}
