import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth.js";

export default function RequireAuth({ children }) {
  const auth = useAuth();
  if (!auth?.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}