import { useMutation, useQuery } from "@tanstack/react-query";

import React from "react";
import { useState } from "react";
import { IOrder, IOrderItem } from "../user/profile/IOrderItem";
import { IUser } from "../auth/IUser";
import { IBook } from "../user/books/IBook";
import { updateBookStock } from "../user/books/PostService";
import { useParams } from "react-router-dom";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "./UserService";
import { deleteBook, fetchAllOrders, fetchBooks } from "./BookService";
import ConfirmDialog from "@/app_components/ConfirmDialog";

const ManageBooks: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const bookIdNum = Number(bookId);
  const navigate = useNavigate();

  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [stockChangeAmount, setStockChangeAmount] = useState<number>(0);
  const [stockActionType, setStockActionType] = useState<"add" | "remove">(
    "add"
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // fetch all orders
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<IOrder[]>({
    queryKey: ["orders"],
    queryFn: fetchAllOrders,
  });

  // fetch users
  const { data: users } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // fetch the selected book
  const { data: books } = useQuery<IBook[]>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
  const book = books?.find((b) => b.id === bookIdNum);

  // mutation to update stock
  const updateStockMutation = useMutation({
    mutationFn: async (newStock: number) => {
      if (book?.id === undefined) throw new Error("Book ID is undefined");
      return await updateBookStock(book.id, newStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setIsStockDialogOpen(false);
      setStockChangeAmount(0);
    },
  });

  // handle stock change
  const handleConfirmStockChange = () => {
    if (!book) return;
    const currentStock = book.stock || 0;
    const newStock =
      stockActionType === "add"
        ? currentStock + stockChangeAmount
        : Math.max(0, currentStock - stockChangeAmount);
    updateStockMutation.mutate(newStock);
  };

  // delete book
  const handleDeleteBook = async () => {
    await deleteBook(bookIdNum);
    queryClient.invalidateQueries({ queryKey: ["books"] });
    setIsDeleteDialogOpen(false);
    navigate("/admin/dashboard");
  };

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data.</div>;

  return (
    <>
      <ReturnToBookListButton />
      <div className="w-[500px]mt-4 p-4 border rounded space-y-10">
        {/* Stock Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Title: {book?.title}</h3>
          <h3 className="text-lg font-semibold">
            Total Stock: {book?.initialStock} pcs
          </h3>
          <h3 className="text-lg font-semibold">
            Available Stock: {book?.stock} pcs
          </h3>
          <h3 className="text-lg font-semibold">
            Borrowed Stock: {(book?.initialStock ?? 0) - (book?.stock ?? 0)} pcs
          </h3>
        </div>

        {/* Borrowed Info Section */}
        <div className="space-y-2">
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
        {/* Manage books */}
        <div className="space-y-2 space-x-4">
          <h2 className="text-lg font-semibold">Manage Stock</h2>
          <Button
            onClick={() => {
              setStockActionType("add");
              setStockChangeAmount(0);
              setIsStockDialogOpen(true);
            }}
          >
            Add Pieces
          </Button>
          <Button
            onClick={() => {
              setStockActionType("remove");
              setStockChangeAmount(0);
              setIsStockDialogOpen(true);
            }}
            disabled={!book || book.stock <= 1}
          >
            Delete Pieces
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Book
          </Button>
        </div>
      </div>
      {/* Dialog */}
      <ConfirmDialog
        open={isStockDialogOpen}
        title={stockActionType === "add" ? "Add Stock" : "Remove Stock"}
        onCancel={() => setIsStockDialogOpen(false)}
        onConfirm={handleConfirmStockChange}
        confirmText="Confirm"
        isLoading={updateStockMutation.isPending}
      >
        <Input
          type="number"
          value={stockChangeAmount}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value < 0) {
              setStockChangeAmount(0);
            } else if (
              stockActionType === "remove" &&
              value > (book?.stock ?? 0)
            ) {
              setStockChangeAmount(book?.stock ?? 0);
            } else {
              setStockChangeAmount(value);
            }
          }}
          placeholder="Enter number of pieces"
        />
      </ConfirmDialog>
      {/*  delete confirmation dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${book?.title}"? This action cannot be undone.`}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteBook}
        confirmVariant="destructive"
        confirmText="Confirm Delete"
      />
    </>
  );
};

export default ManageBooks;
