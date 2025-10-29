"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 relative overflow-hidden mt-16">
      
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-[120%] h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 opacity-20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 text-center text-gray-400 space-y-4">
        <h2 className="text-xl font-bold text-purple-400">AURA Clothing</h2>
        <p>Dark streetwear inspired by individuality and style.</p>
        <div className="flex justify-center gap-6 mt-4">
          <Link href="#" className="hover:text-purple-300 transition">Instagram</Link>
          <Link href="#" className="hover:text-purple-300 transition">Twitter</Link>
          <Link href="#" className="hover:text-purple-300 transition">Facebook</Link>
        </div>
        <p className="text-sm mt-6">&copy; {new Date().getFullYear()} AURA. All rights reserved.</p>
      </div>
    </footer>
  );
}
