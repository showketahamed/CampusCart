import { Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-white/80 sticky top-0 z-20 shadow-[0_8px_24px_rgba(2,6,23,.08)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">CampusCart</Link>
        <div className="flex items-center gap-3">
          {!user && <>
            <Link to="/login" className="btn border">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>}
          {user && <>
            <span className="text-sm bg-white/90 border border-slate-200 px-3 py-1 rounded-full capitalize">{user.role}</span>
            <button onClick={logout} className="btn border">Logout</button>
          </>}
        </div>
      </div>
    </header>
  );
}
