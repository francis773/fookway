import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getMenu, getCategories } from '../api/menuApi'
import { useCart } from '../context/CartContext'
import MenuItemCard from '../components/MenuItemCard'

export default function CustomerMenu() {
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [categories, setCategoriesList] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const { setTableToken, totalItems } = useCart()

  // Read table token from QR code URL
  useEffect(() => {
    const token = searchParams.get('table')
    if (token) setTableToken(token)
  }, [searchParams, setTableToken])

  useEffect(() => {
    getCategories().then((res) => {
      if (Array.isArray(res.data)) setCategoriesList(res.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    getMenu(activeCategory)
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Our Menu</h1>
        <p className="text-gray-500 mt-1">Scan, browse, and order from your table</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            !activeCategory ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading menu...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No items available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Floating cart button */}
      {totalItems > 0 && (
        <a
          href="/cart"
          className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          🛒 View Cart ({totalItems})
        </a>
      )}
    </div>
  )
}
