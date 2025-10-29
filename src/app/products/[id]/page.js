"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { products } from "../../../data/products";
import { useCart } from "../../../context/CartContext";
import Footer from "../../../components/Footer";

export default function ProductDetail() {
  const params = useParams();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === Number(params.id));

  if (!product) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-12">
        ⚠️ Product not found
      </div>
    );
  }

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, quantity });
    setMessage("✅ Product added to cart!");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-24 px-6">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-start gap-6">
          <h1 className="text-4xl font-bold text-purple-400">{product.name}</h1>
          <p className="text-2xl font-semibold text-white">Rs.{product.price}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block mb-2 font-semibold">Select Size:</label>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === size
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-purple-600 hover:border-purple-600"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block mb-2 font-semibold">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-gray-800 p-2 rounded w-24"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Add to Cart
          </button>

          {message && (
            <p className="mt-2 text-green-400 font-semibold">{message}</p>
          )}

          {product.sizeChart && (
            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-2">Size Chart</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-4">Size</th>
                    <th className="py-2 px-4">Chest (in)</th>
                    <th className="py-2 px-4">Waist (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {product.sizeChart.map((row, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-2 px-4">{row.size}</td>
                      <td className="py-2 px-4">{row.chest}</td>
                      <td className="py-2 px-4">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.description && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-purple-400 mb-2">Description</h3>
              <p className="text-gray-300">{product.description}</p>
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
}
