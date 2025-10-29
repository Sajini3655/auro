"use client";
import Image from "next/image";
import Link from "next/link";
import { products } from "../../../data/products";
import Footer from "../../../components/Footer";

export default function SaleCollection() {
  const saleProducts = products.filter((p) => p.category === "sale");

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full pt-20">
      
      {/* Custom Banner Section */}
      <section className="relative h-64 w-full flex items-center justify-center mb-12 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-gray-800 to-purple-700 animate-gradientBackground opacity-80"></div>

        <div className="absolute text-center z-10 px-4 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-lg">
            🔥 SALE COLLECTION 🔥
          </h1>
          <p className="mt-2 text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-md">
            Limited Time Deals on Your Favorite Styles!
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-purple-400">
          Featured Sale Items
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {saleProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block rounded-xl overflow-hidden shadow-lg bg-gray-800 hover:shadow-purple-700/40 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-full h-80 overflow-hidden relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="mt-2 text-purple-400 font-bold">Rs.{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      
    </div>
  );
}
