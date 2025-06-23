import axios from "axios";
import { IBook } from "../user/books/IBook";
import { IOrder } from "../user/profile/IOrderItem";

const booksURL = "http://localhost:3000/books";

// fetch all books
export const fetchBooks = async (): Promise<IBook[]> => {
  const response = await axios.get(booksURL);
  return response.data;
};

// delete a book
export const deleteBook = async (bookId: number): Promise<void> => {
  await axios.delete(`${booksURL}/${bookId}`);
};

// fetch all orders
export const fetchAllOrders = async (): Promise<IOrder[]> => {
  const response = await axios.get("http://localhost:3000/orders");
  return response.data;
};
