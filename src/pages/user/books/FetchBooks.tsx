import { useQuery } from "@tanstack/react-query";

import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { IBook } from "./IBook";
import getAllBooks from "./PostService";

type Props = {
  search: string;
  category: string;
  handleAddToCart: (book: IBook) => void;
  addedBooks?: number[];
  isAdmin?: boolean;
};

const FetchBooks: React.FC<Props> = ({
  search,
  category,
  handleAddToCart,
  addedBooks,
  isAdmin = false,
}) => {
  const navigate = useNavigate();

  const {
    data: books,
    error,
    isLoading,
  } = useQuery<IBook[], Error>({
    queryKey: ["books", search, category],
    queryFn: () => getAllBooks(search, category),
  });

  if (error) return <div>There was an error</div>;

  if (isLoading) return <div>Data is Loading</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Result count */}
      {search && books && books.length > 0 && (
        <p className="text-muted-foreground">
          {`${books.length} result${books.length === 1 ? "" : "s"} found`}
        </p>
      )}
      {/* Book List */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books && books.length > 0 ? (
          books.map((book) => (
            <Card key={book.id}>
              <div>
                <CardTitle>{book.title}</CardTitle>
                <CardContent>
                  <h2 className="font-semibold">Category: {book.category}</h2>
                  <p className="text-sm text-muted-foreground">
                    {book.description}
                  </p>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-auto mt-2 rounded-lg"
                  />
                </CardContent>
              </div>

              <CardContent>
                {isAdmin ? (
                  <Button
                    onClick={() => navigate(`/admin/manage-books/${book.id}`)}
                  >
                    Manage Books
                  </Button>
                ) : (
                  <Button
                    disabled={book.stock === 0 || addedBooks?.includes(book.id)}
                    onClick={() => handleAddToCart(book)}
                    className="mt-2"
                  >
                    {book.stock === 0
                      ? "Out of Stock"
                      : addedBooks?.includes(book.id)
                      ? "Added to Cart"
                      : "Add to Cart"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default FetchBooks;
