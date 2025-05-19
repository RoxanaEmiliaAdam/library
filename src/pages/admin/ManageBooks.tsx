import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { IOrder, IOrderItem } from "../user/profile/IOrderItem";
import { IUser } from "../auth/IUser";
import { IBook } from "../user/IBook";
import { useParams } from "react-router-dom";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";

const ManageBooks: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const bookIdNum = Number(bookId);

  // fetch all orders
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<IOrder[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get<IOrder[]>("http://localhost:3000/orders");
      return res.data;
    },
  });

  // fetch users
  const { data: users } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<IUser[]>("http://localhost:3000/users");
      return res.data;
    },
  });

  // fetch the selected book
  const { data: books } = useQuery<IBook[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axios.get<IBook[]>("http://localhost:3000/books");
      return res.data;
    },
  });
  const book = books?.find((b) => b.id === bookIdNum);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data.</div>;

  const borrowedBy = (orders ?? [])
    ?.filter((order: IOrder) =>
      order.items.some((item) => item.id === bookIdNum)
    )
    .map((order) => {
      const item = order.items.find((i: IOrderItem) => i.id === bookIdNum);
      const user = users?.find((u: IUser) => Number(u.id) === order.userId);
      return {
        returnDate: item?.returnDate,
        userEmail: user?.email || "Unknown user",
        status: order.status,
      };
    });

  return (
    <>
      <ReturnToBookListButton />
      <div className="mt-4 p-4 border rounded">
        {/* Stock Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Stock: {book?.stock}</h3>
        </div>

        {/* Borrowed Info Section */}
        <div>
          <h2 className="text-lg font-semibold">Borrowed Info:</h2>
          {borrowedBy && borrowedBy.length > 0 ? (
            <ul className="space-y-2">
              {borrowedBy.map((entry, i) => (
                <li key={i} className="border p-2 rounded bg-gray-50">
                  <p>
                    <strong>User:</strong> {entry.userEmail}
                  </p>
                  <p>
                    <strong>Return Date:</strong> {entry.returnDate}
                  </p>
                  <p>
                    <strong>Status:</strong> {entry.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-extralight">This book has not been borrowed</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageBooks;
