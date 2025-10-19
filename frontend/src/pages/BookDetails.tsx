import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchBookById } from "../features/books/bookSlice";
import { Loader } from "lucide-react";
import { addToCart } from "../features/cart/cartSlice";
import toast from "react-hot-toast";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    selectedBook: book,
    loading,
    error,
  } = useAppSelector((state) => state.books);
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const addItemToCart = () => {
    if (!book) return;
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        bookId: book._id,
        title: book.title,
        price: book.price,
        coverImage: book.coverImage?.url || "",
        quantity: 1,
      })
    );
    toast.success("Book added to cart");
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [id, dispatch]);
  useEffect(() => { window.scrollTo(0, 0); }, [id]);


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (!book)
    return <p className="text-center text-gray-500 mt-10">Book not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Book Cover */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img
            src={book.coverImage?.url}
            alt={book.title}
            className="w-full h-96 object-contain rounded-md bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl text-gray-600 dark:text-gray-300 font-bold mb-2">
              {book.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              by {book.author}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {book.description || "No description available."}
            </p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
              ₹{book.price}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {book && (
              <button
                onClick={addItemToCart}
                disabled = {loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
            )}

            <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
