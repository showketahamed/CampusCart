import { Link } from "react-router-dom";

export default function NotFound() {
  return <div className="min-h-screen grid place-items-center p-4"><div className="card p-8 text-center"><h1 className="text-4xl font-extrabold">404</h1><p className="mt-2">Page not found</p><Link className="btn-primary inline-block mt-4" to="/">Back Home</Link></div></div>;
}
