import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../user/profile/OrderService";
import { IOrder } from "../user/profile/IOrderItem";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";

const OrderHistory: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = Number(searchParams.get("userId"));

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<IOrder[]>({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrders(userId),
  });

  const navigate = useNavigate();
  const returnToManageUsers = () => navigate("/admin/manage-users");

  if (isLoading) return <p>Loading order history...</p>;
  if (error) return <p>Error fetching orders.</p>;
  if (!orders || orders.length === 0) return <p>No past orders found.</p>;

  return (
    <div className="w-[500px] p-6 space-y-6">
      <Button
        className="text-blue-500 hover:text-blue-700 underline bg-transparent border-none p-0"
        onClick={returnToManageUsers}
      >
        Back to Manage Users
      </Button>
      <h2 className="text-2xl font-bold">Order History</h2>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold">
              Order #{order.id} - Status:{" "}
              <span className="capitalize">{order.status}</span>
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Return Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.returnDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
