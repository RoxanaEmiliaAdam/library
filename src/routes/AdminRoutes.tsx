import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Context";

interface ProtectedRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const AdminRoutes: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
export default AdminRoutes;
