const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  READY: 'bg-green-100 text-green-800',
  SERVED: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
