import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

export default function RoleBasedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
