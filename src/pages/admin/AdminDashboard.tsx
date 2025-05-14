import { useState } from "react";
import DashboardLayout from "@/app_components/DashboardLayout";
import FetchBooks from "../user/FetchBooks";

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  return (
    <DashboardLayout
      search={search}
      onSearchChange={handleSearchChange}
      onCategoryChange={handleCategoryChange}
      category={category}
      isAdmin={true}
    >
      <FetchBooks
        search={search}
        category={category}
        handleAddToCart={() => {}}
        isAdmin={true}
      />
    </DashboardLayout>
  );
}

export default AdminDashboard;
