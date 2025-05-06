import axios from "axios";
import { IOrder, IOrderItem } from "./IOrderItem";

const ordersURL = "http://localhost:3000/orders";

// Create an order

export const createOrder = async (
  userId: number,
  items: IOrderItem[]
): Promise<IOrder> => {
  try {
    if (items.length === 0) {
      throw new Error("No items in order");
    }

    const orderData: IOrder = {
      userId,
      items,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const response = await axios.post<IOrder>(
      "http://localhost:3000/orders",
      orderData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create order", error);
    throw error;
  }
};

// Fetch all orders for a user

export const fetchOrders = async (userId: number): Promise<IOrder[]> => {
  const response = await axios.get<IOrder[]>(`${ordersURL}?userId=${userId}`);
  return response.data;
};
