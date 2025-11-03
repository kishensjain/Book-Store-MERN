import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleTheme } from "../features/theme/themeSlice";
import { Moon, Sun } from "lucide-react";
const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);
  const handleToggle = () => dispatch(toggleTheme());
  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-100 active:scale-95 shadow-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      aria-label="Toggle Theme"
    >
      {mode === "light" ? (
        <Moon className="w-6 h-6 text-yellow-400 transition-colors duration-300" />
      ) : (
        <Sun className="w-6 h-6 text-indigo-500 transition-colors duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
