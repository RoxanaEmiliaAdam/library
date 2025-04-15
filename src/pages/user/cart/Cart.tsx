import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ILendItem } from "../ILendItem";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const Cart: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<ILendItem[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Save items and run code only once
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  // if (cartItems.length === 0) {
  //   return <p className="p-4">Your lend list is empty.</p>;
  // }

  const handleRemoveFromCart = (id: number) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (!confirmRemove) return;

    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handlePlaceOrder = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    setSuccessMessage("✅ Order placed successfully!");
  };

  const returnToBookList = () => {
    navigate("/user/dashboard");
  };

  return (
    <div className="p-4 space-y-4">
      <Button
        className="text-blue-500 hover:text-blue-700 underline bg-transparent border-none p-0"
        onClick={returnToBookList}
      >
        Back to Book List
      </Button>
      <h2 className="text-xl font-bold">Your Cart</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead></TableHead>

            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        {cartItems.length === 0 && <p className="p-4">Your cart is empty.</p>}
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.returnDate}</TableCell>
              <TableCell>
                <Button onClick={() => handleRemoveFromCart(item.id)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {cartItems.length > 0 && (
        <Button onClick={handlePlaceOrder}>Place order</Button>
      )}
      {successMessage && <p className="text-green-400">{successMessage}</p>}
    </div>
  );
};

export default Cart;
