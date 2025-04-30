export interface IOrderItem {
  id: number;
  title: string;
  returnDate: string;
}

// for receiving data from server
export interface IOrder {
  id?: number; // created by server
  userId: number;
  items: IOrderItem[];
  status: string;
  createdAt: string;
}

// for sending data to server
export interface createOrderInput {
  userId: number;
  items: IOrderItem[];
  status: string;
  createdAt: string;
}
