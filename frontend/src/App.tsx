import { useEffect } from "react";
import { useAppSelector } from "./app/hooks"
import ThemeToggle from "./components/ThemeToggle";

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
      {/* routes here later */}
      <ThemeToggle/>
    </div>
  )
}

export default App
