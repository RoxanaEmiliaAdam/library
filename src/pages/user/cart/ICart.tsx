import { ILendItem } from "../ILendItem";

export interface ICart {
  id: number;
  userEmail: string;
  userId: number;
  cartBooksList: ILendItem[];
}
