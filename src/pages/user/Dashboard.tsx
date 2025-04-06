import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome, {userEmail}!</h1>
      <Button
        onClick={() => {
          // logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
};
export default Dashboard;
