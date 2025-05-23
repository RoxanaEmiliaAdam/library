import axios from "axios";
import { IUser } from "../auth/IUser";

// users fetch and post
const usersURL = "http://localhost:3000/users";

export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await axios.get(`${usersURL}?role=user`);
  return response.data;
};

// export const addUser = async (user: { email: string; password: string }) => {
//   const response = await axios.post(usersURL, user);
//   return response.data;
// };
