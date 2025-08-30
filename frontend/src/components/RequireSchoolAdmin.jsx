import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { me as getCurrentUser } from "@services/auth.js";

export default function RequireSchoolAdmin({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (mounted) setAllowed(user.role_global === "school_admin");
      })
      .catch(() => {
        if (mounted) setAllowed(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (allowed === null) return null;
  if (!allowed) return <Navigate to="/" replace />;
  return children;
}
