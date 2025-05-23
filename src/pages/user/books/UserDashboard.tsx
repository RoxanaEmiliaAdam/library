import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import FetchBooks from "./FetchBooks";
import { ILendItem } from "./ILendItem";
import { IBook } from "./IBook";
import { fetchCart, addItemToCart, createNewCart } from "../cart/CartService";
import { ICart } from "../cart/ICart";
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
    mutationFn: async ({
      book,
      quantity,
    }: {
      book: IBook;
      quantity: number;
    }) => {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);

      const lendItem: ILendItem = {
        id: book.id,
        title: book.title,
        returnDate: returnDate.toISOString().split("T")[0],
        coverImage: book.coverImage,
        stock: book.stock,
        quantity: quantity,
      };

      if (cartData) {
        if (book.stock > 0) {
          return await addItemToCart(cartData, lendItem);
        } else return console.log("stock 0");
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

  const handleAddToCart = (book: IBook) => {
    if (!cartData?.cartBooksList.some((item) => item.id === book.id)) {
      addToCartMutation({ book, quantity: 1 });
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
    </div>
  );
};

export default UserDashboard;
