import { useCart } from '../context/CartContext'

export default function MenuItemCard({ item }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-4xl">
          🍽️
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <span className="text-primary font-bold">RM{item.price.toFixed(2)}</span>
        </div>
        {item.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
        )}
        <button
          onClick={() => addToCart(item)}
          disabled={!item.available}
          className={`w-full py-2 rounded-lg text-sm font-medium transition ${
            item.available
              ? 'bg-primary text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {item.available ? '+ Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
