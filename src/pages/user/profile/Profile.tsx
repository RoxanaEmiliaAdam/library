import { useState } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "./OrderService";
import { IOrder } from "./IOrderItem";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";
import { updateOrderStatus } from "./OrderService";
import { updateBookStock } from "../books/PostService";
import axios from "axios";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { queryClient } from "@/main";

const Profile: React.FC = () => {
  const userId = Number(localStorage.getItem("userId")) || 0;

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<IOrder[]>({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrders(userId),
  });

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  if (isLoading) return <div>Loading your orders...</div>;
  if (error) return <div>Failed to load orders.</div>;

  const openOrderDetails = (order: IOrder) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const handleReturnBook = async (order: IOrder) => {
    try {
      // 1. Update book stock for each item
      await Promise.all(
        order.items.map(async (item) => {
          const res = await axios.get(`http://localhost:3000/books/${item.id}`);
          const newStock = res.data.stock + 1;
          await updateBookStock(item.id, newStock);
        })
      );

      // 2. set order status
      await updateOrderStatus(order.id!, "closed");

      // 3. refetch orders
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <div className="space-y-4">
      <ReturnToBookListButton />
      <Card>
        <CardTitle>Your Orders</CardTitle>
        <CardContent>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div className="space-y-4">
                <div>
                  <p>
                    {" "}
                    <strong>Order: </strong>#{order.id}
                  </p>

                  <p>
                    <strong>Status: </strong>
                    {order.status}
                  </p>
                </div>
                <div className="space-x-3">
                  <Button onClick={() => openOrderDetails(order)}>
                    View Order Details
                  </Button>
                  <Button
                    onClick={() => handleReturnBook(order)}
                    disabled={order.status === "closed"}
                    className={
                      order.status === "closed"
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }
                  >
                    {order.status === "closed" ? "Returned" : "Return Book"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No Orders yet!</p>
          )}
        </CardContent>
      </Card>

      {/* Order openOrderDetails */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={closeOrderDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>Status: {selectedOrder.status}</p>
              <p>
                Ordered on: {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>

              <ul>
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    {" "}
                    <p>Title: {item.title}</p>
                    <p>
                      Return Date:{" "}
                      {new Date(item.returnDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeOrderDetails}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Profile;
