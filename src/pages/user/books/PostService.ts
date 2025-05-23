import axios from "axios";
import { IBook } from "./IBook";

// books fetch
const axiosURL = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAllBooks = async (
  search?: string,
  category?: string
): Promise<IBook[]> => {
  const params: Record<string, string> = {};

  // full search
  if (search) params.q = search;

  // filter by category
  if (category && category !== "all") params.category = category;

  const response = await axiosURL.get("/books", { params });
  return response.data;
};

export default getAllBooks;

// update stock
export const updateBookStock = async (bookId: number, newStock: number) => {
  const { data: book } = await axiosURL.get(`/books/${bookId}`);

  const updatedBook = { ...book, stock: newStock };

  const response = await axiosURL.put(`/books/${bookId}`, updatedBook);
  return response.data;
};
