import { FaUser, FaShoppingCart, FaTimes, FaBars } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { authenticated, loading } = useAuth();

  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleAvatarClick = () => {
    if (loading) return; // Wait for the authentication state to load
    if (authenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="flex items-center justify-between border-b-2 border-solid px-6 py-4 font-imprima">
      <a href="/" className="rounded-lg px-2 py-1 text-2xl underline">
        QuickBid
      </a>

      {/* menu layout for larger screens */}
      <div className="hidden space-x-6 text-xl md:flex">
        <a
          href="/listings"
          className="rounded-lg px-2 py-1 transition duration-200 ease-in-out hover:bg-gray-300"
        >
          Listings
        </a>
      </div>

      {/* menu layout for smaller screens */}
      {menuOpen && (
        <div className="absolute left-0 top-16 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col items-center space-y-4 py-4">
            <a
              href="/"
              className="w-fit rounded-lg px-2 py-1 text-xl transition duration-200 ease-in-out hover:bg-gray-300"
              onClick={toggleMenu}
            >
              Listings
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-6">
        {/* burger icon for smaller screens */}
        <button
          className="text-2xl md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <button
          onClick={handleCartClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition duration-200 ease-in-out hover:-translate-y-1"
        >
          <FaShoppingCart className="text-2xl" />
          {cartCount > 0 && (
            <span className="absolute -right-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={handleAvatarClick}
          className="flex h-10 w-10 items-center justify-center rounded-full transition duration-200 ease-in-out hover:-translate-y-1"
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="User Avatar"
              className="border-solid-2 h-full w-full rounded-full border object-cover"
            />
          ) : (
            <FaUser className="text-2xl" />
          )}
        </button>
      </div>
    </nav>
  );
}
