import axios from "axios";
import { IBook } from "./IBook";
import { IUser } from "../auth/IUser";

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

// users fetch and post
const usersURL = "http://localhost:3000/users";

export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await axios.get(usersURL);
  return response.data;
};

export const addUser = async (user: { email: string; password: string }) => {
  const response = await axios.post(usersURL, user);
  return response.data;
};
