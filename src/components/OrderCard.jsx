import StatusBadge from './StatusBadge'

export default function OrderCard({ order, actions }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="font-bold text-lg">Table #{order.tableNumber}</span>
          <span className="text-gray-400 text-sm ml-2">#{order.orderId}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-1 mb-3">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.quantity}x {item.itemName}</span>
            <span className="text-gray-500">RM{item.subtotal?.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.customerNote && (
        <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mb-3">
          📝 {order.customerNote}
        </p>
      )}

      <div className="flex justify-between items-center border-t pt-3">
        <span className="text-xs text-gray-400">{timeAgo(order.createdAt)}</span>
        <span className="font-bold text-secondary">RM{order.totalAmount?.toFixed(2)}</span>
      </div>

      {actions && <div className="mt-3 flex gap-2">{actions}</div>}
    </div>
  )
}
