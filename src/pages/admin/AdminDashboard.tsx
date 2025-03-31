import React from "react";
import { useAuth } from "@/routes/Context";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <h1>AdminDashboard</h1>
      <p>Wecome, {user?.email}!</p>
      <Button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
}

export default AdminDashboard;
