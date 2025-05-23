import axios from "axios";
import { IBook } from "../user/books/IBook";

export type NewBook = Omit<IBook, "id">;

export const addNewBook = async (book: NewBook): Promise<IBook> => {
  const res = await axios.post<IBook>("http://localhost:3000/books", book);
  return res.data;
};
