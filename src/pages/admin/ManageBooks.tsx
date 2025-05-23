import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { IOrder, IOrderItem } from "../user/profile/IOrderItem";
import { IUser } from "../auth/IUser";
import { IBook } from "../user/books/IBook";
import { updateBookStock } from "../user/books/PostService";
import { useParams } from "react-router-dom";
import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/main";
import { useNavigate } from "react-router-dom";

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
    await axios.delete(`http://localhost:3000/books/${bookIdNum}`);
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
      <div className="mt-4 p-4 border rounded space-y-10">
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
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stockActionType === "add" ? "Add Stock" : "Remove Stock"}
            </DialogTitle>
          </DialogHeader>
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmStockChange}>
              {updateStockMutation.isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <strong>{book?.title}</strong>? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageBooks;
