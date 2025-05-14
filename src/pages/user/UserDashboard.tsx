import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import FetchBooks from "./FetchBooks";
import { ILendItem } from "./ILendItem";
import { IBook } from "./IBook";
import { fetchCart, addItemToCart, createNewCart } from "./cart/CartService";
import { ICart } from "./cart/ICart";
import { queryClient } from "@/main";
import DashboardLayout from "@/app_components/DashboardLayout";

const UserDashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const userEmail = JSON.parse(localStorage.getItem("userEmail") || '""');
  const userId = JSON.parse(localStorage.getItem("userId") || "0");

  const { data: cartData } = useQuery<ICart | null>({
    queryKey: ["cart", userEmail],
    queryFn: () => fetchCart(userEmail),
    enabled: !!userEmail,
  });

  const { mutate: addToCartMutation } = useMutation({
    mutationFn: async (book: IBook) => {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);

      const lendItem: ILendItem = {
        id: book.id,
        title: book.title,
        returnDate: returnDate.toISOString().split("T")[0],
        coverImage: book.coverImage,
      };

      if (cartData) {
        return await addItemToCart(cartData, lendItem);
      } else {
        return await createNewCart(userEmail, userId, lendItem);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userEmail] });
    },
    onError: (error) => {
      console.error("❌ Failed to add to cart:", error);
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  // const handleLogout = () => {
  //   logOut();
  //   navigate("/login");
  // };

  // const handleCartClick = () => {
  //   navigate("/user/cart");
  // };

  // const handleProfileClick = () => {
  //   navigate("/user/profile");
  // };

  const handleAddToCart = (book: IBook) => {
    if (!cartData?.cartBooksList.some((item) => item.id === book.id)) {
      addToCartMutation(book);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Top Bar */}
      <DashboardLayout
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        isAdmin={false}
      >
        <FetchBooks
          search={search}
          category={category}
          handleAddToCart={handleAddToCart}
          addedBooks={cartData?.cartBooksList.map((book) => book.id) || []}
        />
      </DashboardLayout>
      {/* <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex gap-2 flex-col md:flex-row w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-md w-full"
          />

          <select
            value={category}
            onChange={handleCategoryChange}
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
          <Button variant="destructive" onClick={handleCartClick}>
            Cart
          </Button>
          <Button onClick={handleProfileClick}>Profile</Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div> */}

      {/* Book List */}
      {/* <FetchBooks
        search={search}
        category={category}
        handleAddToCart={handleAddToCart}
        addedBooks={cartData?.cartBooksList.map((item) => item.id) || []}
      /> */}
    </div>
  );
};

export default UserDashboard;
