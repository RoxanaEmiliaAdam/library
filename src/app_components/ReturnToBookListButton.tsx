// ReturnToBookListButton.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ReturnToBookListButton: React.FC = () => {
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("userRole") || '""');

  const returnToBookList = () => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    }
    if (role === "user") {
      navigate("/user/dashboard");
    }
  };

  return (
    <Button
      className="text-blue-500 hover:text-blue-700 underline bg-transparent border-none p-0"
      onClick={returnToBookList}
    >
      Back to Book List
    </Button>
  );
};

export default ReturnToBookListButton;
