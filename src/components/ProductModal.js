'use client'

export default function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="bg-[#0f0b22] p-6 rounded-lg shadow-glow z-10 max-w-xl w-full">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>
        <p className="text-gray-300 mt-4">{product.desc}</p>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-2xl font-bold">${product.price}</div>
          <div className="flex gap-3">
            <button onClick={onAdd} className="btn bg-accent text-white">Add to cart</button>
            <button onClick={onClose} className="btn border border-white/10">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
