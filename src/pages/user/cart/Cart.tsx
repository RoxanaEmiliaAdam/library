import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchCart, removeCart, removeItemFromCart } from "./CartService";
import { createOrder, fetchOrders } from "../profile/OrderService";
import { ICart } from "./ICart";
import { ILendItem } from "../books/ILendItem";

import { IBook } from "../books/IBook";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";

import { queryClient } from "@/main";
import { IOrder } from "../profile/IOrderItem";
import { updateBookStock } from "../books/PostService";

const Cart: React.FC = () => {
  const userEmail = JSON.parse(localStorage.getItem("userEmail") || '""');
  const userId = Number(localStorage.getItem("userId") || "0");

  const [successMessage, setSuccessMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // fetch cart
  const { data: cartData, isLoading } = useQuery<ICart | null>({
    queryKey: ["cart", userId],
    queryFn: () => fetchCart(userEmail),
  });

  // fetch user orders

  const { data: orders } = useQuery<IOrder[]>({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(userId),
  });

  // check if any pending order for user
  const hasPendingOrder = orders?.some((order) => order.status === "pending");

  const handleRemoveItem = async (itemId: number) => {
    if (!cartData) return;
    await removeItemFromCart(cartData, itemId);
    queryClient.invalidateQueries({ queryKey: ["cart", userEmail] });
  };

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      if (!cartData || cartData.cartBooksList.length === 0) return;

      // 1. Create the order
      await createOrder(userId, cartData.cartBooksList);

      // 2. update stock
      await Promise.all(
        cartData.cartBooksList.map(async (item) => {
          const { data: latestBook } = await axios.get<IBook>(
            `http://localhost:3000/books/${item.id}`
          );
          const newStock = Math.max(0, latestBook.stock - 1);
          await updateBookStock(item.id, newStock);
        })
      );

      // 3. Clear the cart
      await removeCart(cartData.id);
    },
    onSuccess: () => {
      console.log("Order placed, clearing UI...");
      queryClient.invalidateQueries({ queryKey: ["cart", userEmail] });
      queryClient.invalidateQueries({ queryKey: ["books"] });

      setIsDialogOpen(false);
      setSuccessMessage("✅ Order placed successfully!");

      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (error) => {
      console.error("Error placing order", error);
      setSuccessMessage("❌ Failed to place order.");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
  });

  const cartItems = cartData?.cartBooksList || [];

  return (
    <div className="p-4 space-y-10">
      <ReturnToBookListButton />

      <h2 className="text-xl font-bold">Your Cart</h2>

      {successMessage && <p className="text-green-400">{successMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Return Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item: ILendItem) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.returnDate}</TableCell>
                <TableCell>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {cartItems.length > 0 && (
        <>
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={hasPendingOrder}
          >
            {hasPendingOrder ? "Pending Order Exists" : "Place Order"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Order</DialogTitle>
              </DialogHeader>
              <p>Do you want to place this order? This will clear your cart.</p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={placeOrderMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => placeOrderMutation.mutate()}
                  disabled={placeOrderMutation.isPending}
                >
                  {placeOrderMutation.isPending ? "Placing..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Cart;
