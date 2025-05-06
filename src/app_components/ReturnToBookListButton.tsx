// ReturnToBookListButton.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Adjust path as needed

const ReturnToBookListButton: React.FC = () => {
  const navigate = useNavigate();

  const returnToBookList = () => {
    navigate("/user/dashboard");
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
