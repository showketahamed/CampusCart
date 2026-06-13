import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/client";
import { useAuth } from "../utils/useAuth";

export default function Settings() {
  const { user, vendor, refresh } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", studentId: "", vendorName: "", vendorDescription: "", vendorPhone: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      studentId: user.studentId || "",
      vendorName: vendor?.name || "",
      vendorDescription: vendor?.description || "",
      vendorPhone: vendor?.phone || ""
    });
  }, [user, vendor]);

  const save = async (e) => {
    e.preventDefault();
    await api.put("/settings/profile", form);
    setMsg("Settings updated");
    refresh();
  };

  return <DashboardLayout>
    <h1 className="text-3xl font-extrabold">Settings</h1>
    <form className="card p-4 grid gap-3 md:grid-cols-2" onSubmit={save}>
      {msg && <p className="md:col-span-2 text-brand-600">{msg}</p>}
      <input className="input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Name" />
      <input className="input" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Phone" />
      {user?.role === "student" && <input className="input" value={form.studentId} onChange={(e)=>setForm({...form,studentId:e.target.value})} placeholder="Student ID" />}
      {user?.role === "vendor" && <>
        <input className="input" value={form.vendorName} onChange={(e)=>setForm({...form,vendorName:e.target.value})} placeholder="Vendor Name" />
        <input className="input" value={form.vendorPhone} onChange={(e)=>setForm({...form,vendorPhone:e.target.value})} placeholder="Vendor Phone" />
        <input className="input md:col-span-2" value={form.vendorDescription} onChange={(e)=>setForm({...form,vendorDescription:e.target.value})} placeholder="Vendor Description" />
      </>}
      <button className="btn-primary md:col-span-2">Save</button>
    </form>
  </DashboardLayout>;
}
