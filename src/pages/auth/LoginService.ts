import { IUser } from "./IUser";
import axios from "axios";

type LoginProps = {
  email: string;
  password: string;
};

// users fetch and post
const usersURL = "http://localhost:3000/users";

export const logIn = async (props: LoginProps): Promise<IUser> => {
  const { email, password } = props;
  const query = `?email=${email}&password=${password}`;
  const response = await axios.get(usersURL + query);
  return response.data[0];
};

export const logOut = () => {
  localStorage.setItem("userEmail", "");
};
