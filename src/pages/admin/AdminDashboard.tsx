import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function AdminDashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();
  return (
    <div>
      <h1>AdminDashboard</h1>
      <p>Wecome, {userEmail}!</p>
      <Button
        onClick={() => {
          //logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
}

export default AdminDashboard;
