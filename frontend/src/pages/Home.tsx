import { useEffect } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchBooks } from "../features/books/bookSlice"; // adjust import path

const Home = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks()); // backend: /api/books?limit=6
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ===== HERO SECTION ===== */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to BookVerse 📚
        </h1>
        <p className="max-w-xl text-lg mb-6">
          Discover your next great read — from timeless classics to modern
          bestsellers.
        </p>
        <Link
          to="/books"
          className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Browse Books
        </Link>
      </section>

      {/* ===== FEATURED BOOKS ===== */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Featured Books
        </h2>

        {loading && <p className="text-gray-500">Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.slice(0, 6).map((book) => (
            <div
              key={book._id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
            >
              <img
                src={book.coverImage?.url || "/placeholder.jpg"}
                alt={book.title}
                className="w-full h-60 object-contain mb-3 rounded-md"
              />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 truncate">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {book.author}
              </p>
              <p className="mt-2 text-blue-600 dark:text-blue-400 font-semibold">
                ₹{book.price}
              </p>
              <Link
                to={`/books/${book._id}`}
                className="mt-3 inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
