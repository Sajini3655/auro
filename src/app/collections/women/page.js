"use client";
import Image from "next/image";
import Link from "next/link";
import { products } from "../../../data/products";
import Footer from "../../../components/Footer";

export default function WomenCollection() {
  const womenProducts = products.filter((p) => p.category === "women");

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center text-purple-400">
          Women's Collection
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {womenProducts.map((product) => (
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
