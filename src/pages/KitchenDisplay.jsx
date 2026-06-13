import { useState, useEffect } from 'react'
import { getKitchenOrders, updateKitchenStatus } from '../api/orderApi'
import StatusBadge from '../components/StatusBadge'

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    getKitchenOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000) // refresh every 10s
    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateKitchenStatus(id, newStatus)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update')
    }
  }

  const timeElapsed = (dateStr) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (mins < 1) return '< 1 min'
    if (mins < 60) return `${mins} min`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading kitchen orders...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">🍳 Kitchen Display</h1>
        <span className="text-sm text-gray-400">Auto-refreshes every 10s</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">✨</p>
          <h2 className="text-xl font-bold text-gray-600">All caught up!</h2>
          <p className="text-gray-400 mt-2">No pending orders right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className={`rounded-xl p-4 shadow-sm border-2 ${
                order.status === 'PENDING' ? 'border-yellow-300 bg-yellow-50' : 'border-blue-300 bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">Table #{order.tableNumber}</span>
                  <StatusBadge status={order.status} />
                </div>
                <span className="text-xs text-gray-500 font-mono">{timeElapsed(order.createdAt)}</span>
              </div>

              {/* Items */}
              <div className="space-y-1.5 mb-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="bg-white px-2 py-0.5 rounded text-sm font-bold">{item.quantity}x</span>
                    <span className="text-sm font-medium">{item.itemName}</span>
                    {item.specialInstructions && (
                      <span className="text-xs text-amber-700 italic">({item.specialInstructions})</span>
                    )}
                  </div>
                ))}
              </div>

              {order.customerNote && (
                <p className="text-xs text-amber-800 bg-amber-100 rounded p-2 mb-3">📝 {order.customerNote}</p>
              )}

              {/* Action button */}
              <div className="mt-3">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleStatusUpdate(order.orderId, 'PREPARING')}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    🔥 Start Cooking
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleStatusUpdate(order.orderId, 'READY')}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    ✅ Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
