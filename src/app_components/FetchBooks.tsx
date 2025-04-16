import { useQuery } from "@tanstack/react-query";
import getAllBooks from "@/postService";
import { IBook } from "@/interfaces/interface IBook";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  handleAddToCart: (book: IBook) => void;
  addedBooks: number[];
};

const FetchBooks: React.FC<Props> = ({
  search,
  handleAddToCart,
  addedBooks,
}) => {
  const { data, error, isLoading } = useQuery<IBook[], Error>({
    queryKey: ["books"],
    queryFn: getAllBooks,
  });

  // Filter books

  const filteredBooks = data?.filter((book) => {
    const searchText = search.toLowerCase();
    return (
      book.title.toLocaleLowerCase().includes(searchText) ||
      book.category.toLocaleLowerCase().includes(searchText) ||
      book.description.toLocaleLowerCase().includes(searchText)
    );
  });

  if (error) return <div>There was an error</div>;

  if (isLoading) return <div>Data is Loading</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Result count */}
      {search && filteredBooks && filteredBooks.length > 0 && (
        <p className="text-muted-foreground">
          {`${filteredBooks?.length} result${
            filteredBooks?.length === 1 ? "" : "s"
          } found`}
        </p>
      )}
      {/* Book List */}
      <div className=" sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <ul>
          {filteredBooks?.length ? (
            filteredBooks.map((book) => (
              <Card key={book.id} className="max-w-sm">
                <CardTitle>{book.title}</CardTitle>
                <CardContent>
                  <h2>Category: {book.category}</h2>
                  <h3>Description: {book.description}</h3>
                  <img
                    src={book.coverImage}
                    className="w-full h-auto rounded-lg"
                  ></img>
                </CardContent>
                <CardContent>
                  <Button
                    variant="destructive"
                    className="w-full mt-2"
                    disabled={addedBooks.includes(book.id)}
                    onClick={() => handleAddToCart(book)}
                  >
                    {addedBooks.includes(book.id) ? "Added" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className=" text-muted-foreground">No books found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FetchBooks;
