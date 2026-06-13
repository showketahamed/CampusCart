import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../utils/useAuth";
import { useNotify } from "../utils/useNotify";

export default function Register() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", studentId: "", phone: "", vendorName: "", vendorType: "", vendorDescription: "" });
  const { register } = useAuth();
  const notify = useNotify();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form);
      const text = data.message || "Registered";
      setMsg(text);
      notify.notifySuccess(text);
    } catch (err) {
      const text = err.response?.data?.message || "Register failed";
      setMsg(text);
      notify.notifyError(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 card p-6">
        <h1 className="text-2xl font-extrabold">Register</h1>
        {msg && <p className="mt-2 text-brand-600">{msg}</p>}
        <form className="grid gap-3 md:grid-cols-2 mt-4" onSubmit={onSubmit}>
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option><option value="vendor">Vendor</option>
          </select>
          {form.role === "student" ? <input className="input" placeholder="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} /> : <input className="input" placeholder="Vendor Name" value={form.vendorName} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} />}
          {form.role === "vendor" && <>
            <input className="input" placeholder="Vendor Type" value={form.vendorType} onChange={(e) => setForm({ ...form, vendorType: e.target.value })} />
            <input className="input" placeholder="Vendor Description" value={form.vendorDescription} onChange={(e) => setForm({ ...form, vendorDescription: e.target.value })} />
          </>}
          <button className="btn-primary md:col-span-2 disabled:opacity-60" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
