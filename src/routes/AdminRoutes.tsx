import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const AdminRoutes: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  // const userEmail = localStorage.getItem("userEmail");
  // const userRole = localStorage.getItem("userRole");

  const userEmail = JSON.parse(localStorage.getItem("userEmail") || "null");
  const userRole = JSON.parse(localStorage.getItem("userRole") || "null");

  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
export default AdminRoutes;
