import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Loader } from "lucide-react";
import { fetchBooks } from "../features/books/bookSlice";

const Books = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    console.log(books); // 👈 See what comes from API
  }, [books]);  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        📚 Available Books
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No books found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="border rounded-lg p-4 shadow hover:shadow-md dark:border-gray-700 transition"
            >
              {book.coverImage?.url ? (
                <img
                  src={
                    book.coverImage?.url?.startsWith("http")
                      ? book.coverImage.url
                      : `http://localhost:4000${book.coverImage?.url}`
                  }
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-3" />
              )}

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                ₹{book.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
