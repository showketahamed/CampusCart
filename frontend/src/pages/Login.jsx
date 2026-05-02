import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../utils/useAuth";
import { useNotify } from "../utils/useNotify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const notify = useNotify();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await login(form);
      notify.notifySuccess(`Welcome back, ${user.name}.`);
      navigate(user.role === "admin" ? "/admin-dashboard" : user.role === "vendor" ? "/vendor-dashboard" : "/student-dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      notify.notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="max-w-md mx-auto mt-12 card p-6">
        <h1 className="text-2xl font-extrabold">Login</h1>
        {error && <p className="text-rose-600 mt-3">{error}</p>}
        <form className="space-y-3 mt-4" onSubmit={onSubmit}>
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full disabled:opacity-60" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
