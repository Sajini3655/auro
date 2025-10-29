"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext"; 

const vouchers = [
  { id: 1, name: "Rs.500 Gift Voucher", price: 500, desc: "Perfect little treat." },
  { id: 2, name: "Rs.1000 Gift Voucher", price: 1000, desc: "A thoughtful gift." },
  { id: 3, name: "Rs.2000 Gift Voucher", price: 2000, desc: "Make someone's day." },
];

export default function GiftItemsPage() {
  const { addToCart } = useCart();
  const [msg, setMsg] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const handleAdd = async (voucher) => {
    if (!addToCart) {
      setMsg({ type: "error", text: "Cart not available. Please login." });
      setTimeout(() => setMsg(null), 2500);
      return;
    }

    try {
      setAddingId(voucher.id);
      await addToCart({ id: voucher.id, name: voucher.name, price: voucher.price, quantity: 1 });
      setMsg({ type: "success", text: `✅ ${voucher.name} added to cart` });
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "❌ Could not add item. Try again." });
    } finally {
      setAddingId(null);
      setTimeout(() => setMsg(null), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white pt-24 pb-16">
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 shadow-xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-300 tracking-tight">
              🎁 AURA Gift Lounge
            </h1>
            <p className="mt-3 text-gray-300 max-w-xl">
              Treat someone special — premium vouchers, instantly redeemable. Elegant, simple,
              and perfect for any celebration.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:brightness-110"
              >
                Browse Vouchers
              </button>
              <button
                onClick={() => setMsg({ type: "info", text: "Tip: Use vouchers at checkout." })}
                className="px-5 py-2 rounded-full border border-gray-700 text-gray-200 hover:bg-gray-800/50"
              >
                How it works
              </button>
            </div>
          </div>

          <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl bg-gradient-to-br from-purple-700/40 via-pink-600/30 to-transparent flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="opacity-95">
              <path d="M3 7h18v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" stroke="#E9D5FF" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M12 3c1.657 0 3 1.343 3 3 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3z" stroke="#FCE7F3" strokeWidth="1.2"/>
              <path d="M12 3v4" stroke="#FCE7F3" strokeWidth="1.2"/>
            </svg>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <span className="px-3 py-1 text-sm rounded-full bg-gray-800/40 border border-gray-700">All</span>
            <span className="px-3 py-1 text-sm rounded-full bg-gray-800/30 border border-gray-700">Rs.500</span>
            <span className="px-3 py-1 text-sm rounded-full bg-gray-800/30 border border-gray-700">Rs.1000</span>
            <span className="px-3 py-1 text-sm rounded-full bg-gray-800/30 border border-gray-700">Rs.2000</span>
          </div>
          <div className="text-sm text-gray-400">Secure purchases • No expiry vouchers</div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vouchers.map((v) => (
            <motion.article
              key={v.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700 p-6 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-purple-200">{v.name}</h3>
                  <span className="text-sm text-gray-400">Instant</span>
                </div>

                <p className="mt-3 text-gray-300">{v.desc}</p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="rounded-full bg-gray-900/40 border border-gray-700 w-14 h-14 flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-300">Rs.</span>
                    <span className="text-lg font-bold text-purple-300">{v.price}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Redeemable value</span>
                    <span className="text-lg font-semibold text-white">Rs.{v.price}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  onClick={() => handleAdd(v)}
                  disabled={addingId === v.id}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold shadow hover:brightness-105 disabled:opacity-60"
                >
                  {addingId === v.id ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  onClick={() => setMsg({ type: "info", text: `Details: ${v.name} — valid for any purchase.` })}
                  className="px-3 py-3 rounded-full border border-gray-700 text-sm hover:bg-gray-800"
                  aria-label="Details"
                >
                  i
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {vouchers.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-2xl">No vouchers available</p>
            <p className="mt-3">Check back later — new gifts arrive often.</p>
          </div>
        )}
      </main>

      <div className="fixed right-6 bottom-6 z-50">
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`rounded-xl px-5 py-3 shadow-lg ${
              msg.type === "success" ? "bg-green-600 text-white" :
              msg.type === "error" ? "bg-red-600 text-white" : "bg-gray-800 text-white"
            }`}
          >
            {msg.text}
          </motion.div>
        )}
      </div>
    </div>
  );
}
