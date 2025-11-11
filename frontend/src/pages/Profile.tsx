import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchOrders } from "../features/order/orderSlice"; 
import { logout } from "../features/auth/authSlice";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 dark:text-gray-300">
        <p className="text-lg mb-4">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      {/* === USER INFO === */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          My Profile
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Name:</span> {user.name}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* === ORDER HISTORY === */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          My Orders
        </h2>

        {loading && <p className="text-gray-500">Loading your orders...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="text-gray-500">You have no orders yet.</p>
        )}

        <div className="space-y-6">
          {orders.map((order: { _id: string; createdAt: string; totalAmount: number; items: { book: { _id: string; title: string; price: number }; quantity: number }[] }) => (
            <div
              key={order._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  Order #{order._id.slice(-6)}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-medium">Total:</span> ₹{order.totalAmount}
              </p>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                {order.items.map((item: { book: { _id: string; title: string; price: number }; quantity: number }) => (
                  <div
                    key={item.book._id}
                    className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1"
                  >
                    <span>{item.book.title}</span>
                    <span>
                      {item.quantity} × ₹{item.book.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
