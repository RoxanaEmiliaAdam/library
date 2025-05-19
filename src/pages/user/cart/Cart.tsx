import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

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
import { createOrder } from "../profile/OrderService";
import { ICart } from "./ICart";
import { ILendItem } from "../ILendItem";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";
import { queryClient } from "@/main";

const Cart: React.FC = () => {
  const userEmail = JSON.parse(localStorage.getItem("userEmail") || '""');

  const [successMessage, setSuccessMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: cartData, isLoading } = useQuery<ICart | null>({
    queryKey: ["cart", userEmail],
    queryFn: () => fetchCart(userEmail),
  });

  const handleRemoveItem = async (itemId: number) => {
    if (!cartData) return;
    await removeItemFromCart(cartData, itemId);
    queryClient.invalidateQueries({ queryKey: ["cart", userEmail] });
  };

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      if (!cartData || cartData.cartBooksList.length === 0) return;

      // 1. Create the order
      await createOrder(cartData.userId, cartData.cartBooksList);

      // 2. Clear the cart
      await removeCart(cartData.id);
      console.log("Cart removed");
    },
    onSuccess: () => {
      console.log("Order placed, clearing UI...");
      queryClient.invalidateQueries({ queryKey: ["cart", userEmail] });
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
    <div className="p-4 space-y-4">
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
                  <Button onClick={() => handleRemoveItem(item.id)}>
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
          <Button onClick={() => setIsDialogOpen(true)}>Place Order</Button>
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
