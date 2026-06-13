import { Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const student = [
    ["Student Dashboard", "/student-dashboard"],
    ["Cart", "/cart"],
    ["Checkout", "/checkout"],
    ["Order History", "/order-history"],
    ["Subscription", "/subscription"],
    ["Settings", "/settings"]
  ];
  const vendor = [["Vendor Dashboard", "/vendor-dashboard"], ["Products", "/vendor-products"], ["Settings", "/settings"]];
  const admin = [["Admin Dashboard", "/admin-dashboard"], ["Settings", "/settings"]];
  const items = user.role === "student" ? student : user.role === "vendor" ? vendor : admin;

  return (
    <aside className="card p-4 lg:sticky lg:top-24">
      <nav className="space-y-2">
        {items.map(([label, to]) => (
          <Link key={to} to={to} className="block rounded-xl px-3 py-2 hover:bg-brand-50">{label}</Link>
        ))}
      </nav>
    </aside>
  );
}
