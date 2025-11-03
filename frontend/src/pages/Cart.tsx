import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  removeFromCart,
  updateCart,
  clearCart,
  fetchCart,
  clearCartBackend,
} from "../features/cart/cartSlice";
const Cart = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const handleClearCart = async () => {
  await dispatch(clearCartBackend());
  await dispatch(fetchCart()); // 🔁 refetch to confirm cleared state
};


  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 dark:text-gray-300">
        <p className="text-lg mb-4">Your cart is empty 🛒</p>
        <Link
          to="/books"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="gap-6">
        {items.map((item) => (
          <div
            key={item._id || item.bookId}
            className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-4"
          >
            {/* Left: Cover + Details */}
            <div className="flex items-center space-x-4">
              <img
                src={item.coverImage || "/placeholder.jpg"}
                alt={item.title || "Book cover"}
                className="w-24 h-32 object-contain rounded-md bg-gray-100 dark:bg-gray-800"
              />

              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {item.title}
                </h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* Right: Quantity + Remove + Subtotal */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Quantity Controls */}
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() =>
                    dispatch(
                      updateCart({
                        ...item,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    )
                  }
                  className="px-2 py-1 text-gray-600 dark:text-amber-50 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-3 dark:text-amber-50">{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch(
                      updateCart({ ...item, quantity: item.quantity + 1 })
                    )
                  }
                  className="px-2 py-1 text-gray-600 dark:text-amber-50 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                ₹{item.price * item.quantity}
              </p>

              {/* Remove */}
              <button
                onClick={() => dispatch(removeFromCart(item.bookId!))}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Cart Summary */}
      <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Cart Summary
        </h2>
        <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300 font-medium mb-4">
          <span>Total Price:</span>
          <span>₹{totalPrice}</span>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleClearCart}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer"
          >
            Clear Cart
          </button>

          <button
            onClick={() => alert("Proceeding to checkout...")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
