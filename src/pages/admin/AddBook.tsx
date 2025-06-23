import ReturnToBookListButton from "@/app_components/ReturnToBookListButton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { addNewBook, NewBook } from "./AddBookService";

const AddBook: React.FC = () => {
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // add new book mutation
  const addNewBookMutation = useMutation({
    mutationFn: addNewBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => {
      setError("Failed to add book.Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || stock <= 0 || !category || !description) {
      setError("Please fill all fields with valid values.");
      return;
    }

    const newBook: NewBook = {
      title,
      description,
      stock,
      initialStock: stock,
      category,
      coverImage: imageUrl,
    };
    addNewBookMutation.mutate(newBook);
    navigate("/admin/dashboard");
  };

  return (
    <>
      <ReturnToBookListButton />
      <div className="max-w-xl mx-auto p-6 border rounded shadow">
        <h2 className="w-[500px] text-xl font-bold mb-4">Add New Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(Math.max(1, Number(e.target.value)))}
          />
          <Input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={addNewBookMutation.isPending}>
            {addNewBookMutation.isPending ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </div>
    </>
  );
};
export default AddBook;
