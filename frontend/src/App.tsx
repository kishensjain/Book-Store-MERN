import { useEffect } from "react";
import { useAppSelector } from "./app/hooks"
import { Route, Routes } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const theme = useAppSelector((s) => s.theme.mode);
  
  useEffect(() => {
    const root = document.documentElement;
    if(theme === "dark"){
      root.classList.add("dark")
    }else{
      root.classList.remove("dark");
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Routes>
        <Route path = '/register' element={<Register/>} />
        <Route path = '/login' element={<Login/>} />
      </Routes>
    </div>
  )
}

export default App
