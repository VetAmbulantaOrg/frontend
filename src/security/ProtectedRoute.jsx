import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useContext(AuthContext);

  // Ako nije ulogovan → redirect na login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ako je ulogovan ali nema potrebnu rolu → redirect na "unauthorized"
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Ako je sve ok → renderuj decu (traženu rutu)
  return children;
}
