import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks"

const Cart = () => {
    const dispatch = useAppDispatch()
    const { items } = useAppSelector((state) => state.cart);

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
      <div className="flex flex-col md:flex-row gap-6">
        {/* {items.map((item) => (

        ))} */}
      </div>
    </div>
  )
} 

export default Cart