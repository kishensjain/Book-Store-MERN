import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { Route, Routes } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"
import Books from "./pages/Books"
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import { fetchCart, addToCart } from "./features/cart/cartSlice";
function App() {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state)=>state.auth)
  const theme = useAppSelector((s) => s.theme.mode);
  
  useEffect(() => {
    if (user) {
      // 🔹 If logged in, get cart from backend
      dispatch(fetchCart());
    } else {
      // 🔹 If guest, restore from local storage
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      localCart.forEach((item: any) => dispatch(addToCart(item)));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const root = document.documentElement; //html tag
    if(theme === "dark"){
      root.classList.add("dark")
    }else{
      root.classList.remove("dark");
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path = '/register' element={<Register/>} />
        <Route path = '/login' element={<Login/>} />

        <Route path="/books" element={<Books/>} />
        <Route path="/books/:id" element={<BookDetails />} />

        <Route path="/cart" element={<Cart/>}/>

      </Routes>
    </div>
  )
}

export default App
