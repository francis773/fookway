import { useState, useEffect } from 'react'
import { getAdminOrders, updateOrderStatus } from '../api/orderApi'
import OrderCard from '../components/OrderCard'

const STATUSES = ['', 'PENDING', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    getAdminOrders(filter || undefined)
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filter])

  useEffect(() => {
    const interval = setInterval(fetchOrders, 20000)
    return () => clearInterval(interval)
  }, [filter])

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
  }

  const getNextStatuses = (current) => {
    const map = {
      PENDING: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['SERVED', 'CANCELLED'],
      SERVED: ['COMPLETED']
    }
    return map[current] || []
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">All Orders</h1>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              filter === s ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No orders found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              actions={
                getNextStatuses(order.status).length > 0 && (
                  <>
                    {getNextStatuses(order.status).map((ns) => (
                      <button
                        key={ns}
                        onClick={() => handleStatusChange(order.orderId, ns)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                          ns === 'CANCELLED'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        → {ns}
                      </button>
                    ))}
                  </>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
