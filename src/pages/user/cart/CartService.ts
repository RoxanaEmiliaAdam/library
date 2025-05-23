import axios from "axios";
import { ILendItem } from "../books/ILendItem";
import { ICart } from "./ICart";

const cartURL = "http://localhost:3000/cart";

// Fetch the cart for a specific user
export const fetchCart = async (userEmail: string): Promise<ICart | null> => {
  const { data } = await axios.get<ICart[]>(
    `${cartURL}?userEmail=${userEmail}`
  );
  return data.length > 0 ? data[0] : null;
};

export const createNewCart = async (
  userEmail: string,
  userId: number,
  newItem: ILendItem
): Promise<ICart> => {
  const newCart: Omit<ICart, "id"> = {
    userEmail,
    userId,
    cartBooksList: [newItem],
  };

  const response = await axios.post<ICart>(cartURL, newCart);
  return response.data;
};

export const addItemToCart = async (
  cart: ICart,
  newItem: ILendItem
): Promise<ICart> => {
  const updatedItems = [...(cart.cartBooksList || []), newItem];
  const updatedCart = { ...cart, cartBooksList: updatedItems };

  const response = await axios.put<ICart>(`${cartURL}/${cart.id}`, updatedCart);
  return response.data;
};

// Remove a cart by ID (after order placed)
export const removeCart = async (cartId: number) => {
  await axios.delete(`${cartURL}/${cartId}`);
};

// remove item from cart
export const removeItemFromCart = async (
  cart: ICart,
  itemIdToRemove: number
): Promise<ICart> => {
  const updatedItems = cart.cartBooksList.filter(
    (item) => item.id !== itemIdToRemove
  );
  const updatedCart: ICart = { ...cart, cartBooksList: updatedItems };

  const response = await axios.put<ICart>(`${cartURL}/${cart.id}`, updatedCart);
  return response.data;
};

// // Clear all carts (admin utility)
// export const clearCart = async () => {
//   const { data } = await axios.get<ICart[]>(cartURL);
//   await Promise.all(data.map((cart) => axios.delete(`${cartURL}/${cart.id}`)));
// };
