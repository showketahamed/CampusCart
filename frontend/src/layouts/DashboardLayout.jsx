import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 grid gap-4 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main className="space-y-4 page-shell">{children}</main>
      </div>
    </div>
  );
}
