import axios from "axios";
import { IBook } from "./interfaces/interface IBook";
import { IUser } from "./interfaces/IUser";

// books fetch
const axiosURL = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAllBooks = async (): Promise<IBook[]> => {
  const response = await axiosURL.get("/books");
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
