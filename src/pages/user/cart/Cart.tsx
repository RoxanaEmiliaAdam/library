import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

const Cart: React.FC = () => {
  const queryClient = useQueryClient();
  const userEmail = JSON.parse(localStorage.getItem("userEmail") || '""');

  const [successMessage, setSuccessMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { data: cartData, isLoading } = useQuery<ICart | null>({
    queryKey: ["cart", userEmail],
    queryFn: () => fetchCart(userEmail),
  });

  const handleRemoveItem = async (itemId: number) => {
    if (!cartData) return;
    await removeItemFromCart(cartData, itemId);
    queryClient.invalidateQueries({ queryKey: ["cart", userEmail] });
  };

  const handlePlaceOrder = async () => {
    if (!cartData || cartData.cartBooksList.length === 0) return;

    try {
      setIsPlacingOrder(true);

      // 1. Create the order
      await createOrder(cartData.userId, cartData.cartBooksList);

      // 2. Clear the cart
      await removeCart(cartData.id);

      // 3. Update UI
      queryClient.invalidateQueries({ queryKey: ["cart", userEmail] });
      setIsDialogOpen(false);
      setSuccessMessage("✅ Order placed successfully!");
    } catch (error) {
      console.error("Error placing order", error);
      setSuccessMessage("❌ Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

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
                  disabled={isPlacingOrder}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Placing..." : "Confirm"}
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
