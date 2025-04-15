import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logOut } from "../auth/LoginService";
import FetchData from "@/app_components/FetchBooks";
import { ILendItem } from "./ILendItem";
import { useEffect, useState } from "react";
import { IBook } from "@/interfaces/interface IBook";

const Dashboard: React.FC = () => {
  //const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<ILendItem[]>([]);
  const [addedBooks, setAddedBooks] = useState<number[]>([]);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart: ILendItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    setCart(savedCart);
    setAddedBooks(savedCart.map((item) => item.id));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/user/cart");
  };

  const handleAddToCart = (book: IBook) => {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);

    const lendItem: ILendItem = {
      id: book.id,
      title: book.title,
      returnDate: returnDate.toISOString().split("T")[0],
      coverImage: book.coverImage,
    };

    const updatedCart = [...cart, lendItem];
    setCart(updatedCart);
    setAddedBooks((prev) => [...prev, book.id]);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="p-4 space-y-6 ">
      {/* Top bar with Search, Cart, Logout */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-md w-full"
        />

        <div className="flex gap-4">
          <Button variant="destructive" onClick={handleCartClick}>
            Cart
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Book list */}
      <FetchData
        search={search}
        handleAddToCart={handleAddToCart}
        addedBooks={addedBooks}
      />
    </div>
  );
};

export default Dashboard;
