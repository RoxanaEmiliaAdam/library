import React from "react";
import { useAuth } from "@/routes/Context";
import { useNavigate } from "react-router-dom";
import Login from "../../app components/Login";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
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
};
export default Dashboard;
