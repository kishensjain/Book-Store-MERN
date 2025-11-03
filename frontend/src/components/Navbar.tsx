import { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/auth/authSlice";
import ThemeToggle from "./ThemeToggle";
import { UserRound, Menu, X } from "lucide-react";

const Navbar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { name: "🏠 Home", path: "/" },
    { name: "📚 Books", path: "/books" },
    {name : "🛒 Cart", path : "/cart"}
  ];

  const confirmLogout = () => {
    dispatch(logoutUser());
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            Book Verse
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition ${
                    isActive
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <UserRound />
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none transition"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-200 rotate-0" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Side Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-2/3 max-w-xs bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-4 py-6 flex flex-col space-y-4">
            {/* Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end text-gray-700 dark:text-gray-200 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Links */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-gray-700 dark:text-gray-200 text-lg hover:text-blue-600 dark:hover:text-blue-400 transition ${
                    isActive
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <UserRound className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}

            <div className="pt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Are you sure you want to log out?
            </h2>
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
