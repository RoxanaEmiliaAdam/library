import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logOut } from "@/pages/auth/LoginService";

interface Props {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isAdmin?: boolean;
  children: ReactNode;
}

const DashboardLayout: React.FC<Props> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  isAdmin = false,
  children,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex gap-2 flex-col md:flex-row w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={onSearchChange}
            className="max-w-md w-full"
          />

          <select
            value={category}
            onChange={onCategoryChange}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Categories</option>
            <option value="fiction">Fiction</option>
            <option value="adventure">Adventure</option>
            <option value="business">Business</option>
            <option value="horror">Horror</option>
          </select>
        </div>

        <div className="flex gap-4">
          {isAdmin ? (
            <>
              <Button onClick={() => navigate("/admin/manage-users")}>
                Manage Users
              </Button>
              <Button onClick={() => navigate("/admin/add-book")}>
                Add Book
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/user/cart")}>Cart</Button>
              <Button onClick={() => navigate("/user/profile")}>Profile</Button>
            </>
          )}
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {children}
    </div>
  );
};
export default DashboardLayout;
