import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Navbar from "../components/Navbar";
import VendorCard from "../components/VendorCard";

export default function Home() {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products/vendors").then((res) => setVendors(res.data));
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="card p-8 md:p-10 overflow-hidden relative">
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-cyan-200/50 blur-2xl float-slow" />
          <div className="absolute -left-8 -bottom-8 w-56 h-56 rounded-full bg-emerald-200/50 blur-2xl float-slow" />
          <div className="relative grid md:grid-cols-[1.1fr_.9fr] gap-6 items-center">
            <div>
              <p className="inline-flex text-xs uppercase tracking-[.2em] px-3 py-1 rounded-full bg-white/90 border border-slate-200">Campus Marketplace</p>
              <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight bg-gradient-to-r from-teal-800 via-cyan-700 to-blue-700 bg-clip-text text-transparent">CampusCart Marketplace</h1>
              <p className="mt-4 text-slate-700 text-lg">Smart shopping experience for students with trusted campus vendors, lightning-fast ordering, and role-based dashboards.</p>
            </div>
            <div className="rounded-2xl shadow-xl border border-white/80 min-h-48 bg-gradient-to-br from-cyan-50 to-blue-100" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Featured Vendors</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vendors.map((v) => <VendorCard key={v._id} vendor={v} onSelect={() => navigate(`/student-dashboard?vendorId=${v._id}`)} />)}
        </div>
      </section>
    </div>
  );
}
