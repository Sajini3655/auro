import { useCart } from '../context/CartContext'
import { showSuccess } from './Toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const handleAdd = () => {
    addToCart(product)
    showSuccess(`${product.name} added`)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-soft">
      <img src={product.image} alt={product.name} className="w-full h-56 object-cover product-img" />
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">${product.price}</p>
        <button onClick={handleAdd} className="btn bg-primary text-white w-full">Add to cart</button>
      </div>
    </div>
  )
}
