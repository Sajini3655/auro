"use client"
import Link from "next/link"

const products = [
  { id: 1, name: "Men Shirt", price: 40 },
  { id: 2, name: "Women Dress", price: 50 },
  { id: 3, name: "Hoodie", price: 60 },
]

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-gray-900 p-6 rounded-lg hover:scale-105 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-400">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
