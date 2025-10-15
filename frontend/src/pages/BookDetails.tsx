import { useEffect } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchBookById } from "../features/books/bookSlice";
import { Loader } from "lucide-react";
import { Link } from "react-router";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedBook: book, loading, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [id, dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (!book)
    return <p className="text-center text-gray-500 mt-10">Book not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
        <Link
              to={`/books/${book._id}`}
              key={book._id}
              className="block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition"
            >
      {book.coverImage && (
        <img
          src={book.coverImage.url}
          alt={book.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{book.title}</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">by {book.author}</p>
      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-4">
        ₹{book.price}
      </p>
      <p className="text-gray-600 dark:text-gray-300 ">{book.description}</p>
      </Link>
    </div>
  );
};

export default BookDetails;

