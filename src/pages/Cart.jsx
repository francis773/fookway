import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../api/orderApi'

export default function Cart() {
  const { items, tableToken, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()
  const [customerNote, setCustomerNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    if (!tableToken) {
      setError('No table detected. Please scan the QR code on your table.')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const orderData = {
        tableToken,
        customerNote: customerNote || null,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          specialInstructions: i.specialInstructions || null
        }))
      }
      const res = await placeOrder(orderData)
      clearCart()
      navigate(`/order/${res.data.orderId}`)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error'
      setError(`Order failed: ${msg} (Status: ${err.response?.status || 'no response'})`)
      console.error('Order error:', err.response?.data || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-700">Cart is empty</h2>
        <p className="text-gray-400 mt-2">Browse the menu and add some items.</p>
        <a href="/menu" className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
          View Menu
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-secondary mb-6">Your Order</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.menuItem.id} className="bg-white rounded-lg p-4 shadow-sm border flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
              <p className="text-sm text-gray-500">RM{item.menuItem.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                −
              </button>
              <span className="font-semibold w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                +
              </button>
              <span className="font-bold text-secondary w-16 text-right">
                RM{(item.menuItem.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.menuItem.id)}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <textarea
        value={customerNote}
        onChange={(e) => setCustomerNote(e.target.value)}
        placeholder="Any special requests? (optional)"
        className="w-full border rounded-lg p-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
        rows={2}
      />

      {/* Total and submit */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">RM{totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
