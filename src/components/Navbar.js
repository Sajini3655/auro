"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Updated link list — merged Spin and Rewards
  const links = ["Cart", "Gift Items", "Spin & Rewards"];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-purple-900/90 shadow-2xl backdrop-blur-md"
          : "bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-purple-900/70 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
       
        <Link
          href="/"
          className="text-3xl sm:text-4xl font-extrabold text-purple-400 tracking-wide hover:scale-110 transition-transform relative group"
        >
          AURA
          <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-purple-400 rounded transition-all group-hover:w-1/2 -translate-x-1/2"></span>
        </Link>

        
        <div className="hidden md:flex items-center gap-6">
          
          <div className="relative">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="relative text-white font-medium hover:text-purple-300 transition-colors group"
            >
              Collections
              <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-purple-400 rounded transition-all group-hover:w-full -translate-x-1/2"></span>
            </button>
            {dropdown && (
              <div className="absolute flex flex-col bg-gray-800/95 mt-2 py-2 rounded-lg shadow-lg min-w-[160px] animate-slide-fade">
                <Link
                  href="/collections/men"
                  className="px-4 py-2 hover:bg-purple-700/40 rounded transition-colors"
                  onClick={() => setDropdown(false)}
                >
                  Men
                </Link>
                <Link
                  href="/collections/women"
                  className="px-4 py-2 hover:bg-purple-700/40 rounded transition-colors"
                  onClick={() => setDropdown(false)}
                >
                  Women
                </Link>
                <Link
                  href="/collections/sale"
                  className="px-4 py-2 hover:bg-purple-700/40 rounded transition-colors"
                  onClick={() => setDropdown(false)}
                >
                  Sale
                </Link>
              </div>
            )}
          </div>

          
          {links.map((text) => {
            const href =
              text === "Spin & Rewards"
                ? "/spin"
                : `/${text.toLowerCase().replace(" ", "")}`;
            return (
              <Link
                key={text}
                href={href}
                className={`relative text-white font-medium hover:text-purple-300 transition-colors group ${
                  pathname === href ? "text-purple-400 font-semibold" : ""
                }`}
              >
                {text}
                {text === "Cart" && cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                    {cart.length}
                  </span>
                )}
                <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-purple-400 rounded transition-all group-hover:w-full -translate-x-1/2"></span>
              </Link>
            );
          })}

        
          {user ? (
            <>
              <span className="font-semibold px-3 py-1 rounded bg-gray-800/60">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-purple-500 px-3 py-1 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-purple-500 px-3 py-1 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-purple-500 px-3 py-1 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>

        
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenu ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

    
      {mobileMenu && (
        <div className="md:hidden bg-gray-800/90 backdrop-blur-md py-4 flex flex-col gap-3 px-6 animate-slide-fade">
          <Link href="/collections/men" className="text-white py-2 hover:text-purple-300">
            Men
          </Link>
          <Link href="/collections/women" className="text-white py-2 hover:text-purple-300">
            Women
          </Link>
          <Link href="/collections/sale" className="text-white py-2 hover:text-purple-300">
            Sale
          </Link>
          {links.map((text) => {
            const href =
              text === "Spin & Rewards"
                ? "/spin"
                : `/${text.toLowerCase().replace(" ", "")}`;
            return (
              <Link key={text} href={href} className="text-white py-2 hover:text-purple-300">
                {text}{" "}
                {text === "Cart" && cart.length > 0 && (
                  <span className="ml-2 bg-red-500 text-xs px-2 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            );
          })}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white bg-purple-500 py-2 rounded-lg mt-2 hover:bg-purple-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-white bg-purple-500 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-white bg-purple-500 py-2 rounded-lg mt-1 hover:bg-purple-600 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      )}

     
      <style jsx>{`
        @keyframes slide-fade {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-fade {
          animation: slide-fade 0.25s ease-out forwards;
          transform-origin: top;
        }
      `}</style>
    </nav>
  );
}
