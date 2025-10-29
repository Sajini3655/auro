"use client";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      setMessage("⚠️ Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  // Empty Cart View
  if (!cart || cart.length === 0) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-purple-400">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-6">
          Looks like you haven’t added anything yet. Explore our gift items!
        </p>
        <button
          onClick={() => router.push("/gift-items")}
          className="px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-md"
        >
          Browse Gift Items
        </button>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-24 px-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-purple-400 drop-shadow-lg">
        Your Cart 🛍️
      </h1>

      {message && (
        <p className="text-green-400 text-center mb-4 font-semibold">{message}</p>
      )}

      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {cart.map((item, index) => (
          <div
            key={item._id || item.name + index}
            className="bg-gray-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-md hover:shadow-purple-600/30 transition-all duration-300"
          >
            {/* Product Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-semibold text-xl text-purple-300">{item.name}</h2>
              <p className="text-purple-400 font-bold mt-1">Rs.{item.price}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-gray-700 px-3 py-2 rounded-lg">
              <button
                className="text-lg font-bold text-purple-400 hover:text-purple-300"
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
              >
                −
              </button>
              <span className="text-lg font-medium">{item.quantity}</span>
              <button
                className="text-lg font-bold text-purple-400 hover:text-purple-300"
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-400 hover:text-red-500 font-semibold transition-all mt-3 md:mt-0"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Total + Checkout */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <p className="text-2xl font-bold text-purple-400">
            Total: <span className="text-white">Rs.{total}</span>
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={clearCart}
              className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
