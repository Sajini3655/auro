'use client'

import { useCart } from '../context/CartContext'

export default function CartModal({ onClose }) {
  const { cart, removeFromCart, total } = useCart()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-lg p-6 w-96">
        <button onClick={onClose} className="text-gray-400 float-right">✕</button>
        <h3 className="text-xl font-bold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-400">Cart is empty</p>
        ) : (
          <ul className="space-y-3">
            {cart.map((it, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-400">${it.price}</div>
                </div>
                <button onClick={() => removeFromCart(it.id)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-gray-300 font-semibold">Total: ${total}</div>
          <button className="px-4 py-2 bg-[#ff3b8a] text-black rounded">Checkout</button>
        </div>
      </div>
    </div>
  )
}
