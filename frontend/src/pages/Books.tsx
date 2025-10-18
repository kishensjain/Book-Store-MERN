import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchBooks } from "../features/books/bookSlice";
import { Link } from "react-router";
import { Loader } from "lucide-react";

const Books = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        📚 All Books
      </h1>

      {books.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No books available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              to={`/books/${book._id}`}
              key={book._id}
              className="block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition"
            >
              {book.coverImage && (
                <img
                  src={book.coverImage.url}
                  alt={book.title}
                  className="w-full h-60 object-contain rounded-md mb-4 bg-gray-100"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {book.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {book.author}
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                ₹{book.price}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
