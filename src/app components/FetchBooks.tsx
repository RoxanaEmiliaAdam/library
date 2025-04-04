import React from "react";
import { useQuery } from "@tanstack/react-query";
import getAllBooks from "@/postService";
import { IBook } from "@/interfaces/interface IBook";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FetchData: React.FC = () => {
  const { data, error, isLoading } = useQuery<IBook[], Error>({
    queryKey: ["books"],
    queryFn: getAllBooks,
  });

  if (error) return <div>There was an error</div>;

  if (isLoading) return <div>Data is Loading</div>;

  return (
    <div className=" sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      <h1>Books</h1>
      <ul>
        {data?.map((book) => (
          <Card key={book.id} className="max-w-sm">
            <CardTitle>{book.title}</CardTitle>
            <CardContent>
              <img
                src={book.coverImage}
                className="w-full h-auto rounded-lg"
              ></img>
            </CardContent>
            <CardContent>
              <Button variant="destructive" className="w-full mt-2">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};

export default FetchData;
