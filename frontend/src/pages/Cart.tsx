import { useAppDispatch, useAppSelector } from "../app/hooks"

const Cart = () => {
    const dispatch = useAppDispatch()
    const cart = useAppSelector((state) => state.cart)
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* {cart} */}
      </div>
    </div>
  )
} 

export default Cart

