import { useState } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "./OrderService";
import { IOrder } from "./IOrderItem";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";

import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const Profile: React.FC = () => {
  const userId = JSON.parse(localStorage.getItem("user") || "0");

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

  return (
    <div>
      <ReturnToBookListButton />
      <Card>
        <CardTitle>Your Orders</CardTitle>
        <CardContent>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div>
                <div>
                  <p>Order #{order.id}</p>
                  <small>Status:{order.status}</small>
                </div>
                <div>
                  <Button onClick={() => openOrderDetails(order)}>View</Button>
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
