import { useState, useEffect } from 'react'
import { getDashboard } from '../api/orderApi'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = () => {
    getDashboard()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading dashboard...</div>
  }

  if (!stats) {
    return <div className="text-center py-12 text-red-500">Failed to load dashboard</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">Admin Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Orders Today" value={stats.totalOrdersToday} color="bg-blue-500" />
        <StatCard label="Pending" value={stats.pendingOrders} color="bg-yellow-500" />
        <StatCard label="Preparing" value={stats.preparingOrders} color="bg-indigo-500" />
        <StatCard label="Revenue" value={`$${stats.revenueToday?.toFixed(2) || '0.00'}`} color="bg-green-500" />
      </div>

      {/* Popular items */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="font-bold text-gray-800 mb-4">🔥 Popular Items Today</h2>
        {stats.popularItems?.length === 0 ? (
          <p className="text-gray-400 text-sm">No orders yet today</p>
        ) : (
          <div className="space-y-2">
            {stats.popularItems?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-700">{idx + 1}. {item.itemName}</span>
                <span className="bg-accent text-white px-2 py-0.5 rounded text-xs font-bold">
                  {item.orderCount} orders
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-2xl font-bold text-secondary">{value}</span>
      </div>
    </div>
  )
}
