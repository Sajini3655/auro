"use client";

import Navbar from "../components/Navbar";
import { CartProvider } from "../context/CartContext";

export default function ClientWrapper({ children }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
    </CartProvider>
  );
}
