import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderStatus } from '../api/orderApi'
import StatusBadge from '../components/StatusBadge'

const STEPS = ['PENDING', 'PREPARING', 'READY', 'SERVED']

export default function OrderStatus() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  const fetchOrder = () => {
    getOrderStatus(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Order not found'))
  }

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 15000) // poll every 15s
    return () => clearInterval(interval)
  }, [id])

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>
  }

  if (!order) {
    return <div className="text-center py-16 text-gray-400">Loading order...</div>
  }

  const currentStep = STEPS.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-secondary">Order #{order.orderId}</h1>
        <p className="text-gray-500 mt-1">Table #{order.tableNumber}</p>
      </div>

      {/* Progress stepper */}
      <div className="flex justify-between items-center mb-10 px-4">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              idx <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            <span className={`text-xs mt-2 ${idx <= currentStep ? 'text-primary font-semibold' : 'text-gray-400'}`}>
              {step}
            </span>
            {idx < STEPS.length - 1 && (
              <div className="hidden" /> /* connector is handled by flex */
            )}
          </div>
        ))}
      </div>

      {/* Status message */}
      <div className="text-center mb-8">
        {order.status === 'PENDING' && <p className="text-lg">⏳ Your order is waiting to be prepared...</p>}
        {order.status === 'PREPARING' && <p className="text-lg">👨‍🍳 The kitchen is working on your order!</p>}
        {order.status === 'READY' && <p className="text-lg text-green-600 font-semibold">✅ Your food is ready!</p>}
        {order.status === 'SERVED' && <p className="text-lg">🍽️ Enjoy your meal!</p>}
        {order.status === 'COMPLETED' && <p className="text-lg text-gray-500">✓ Order completed. Thank you!</p>}
        {order.status === 'CANCELLED' && <p className="text-lg text-red-500">✕ This order was cancelled.</p>}
      </div>

      {/* Order items */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
        <div className="space-y-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.itemName}</span>
              <span className="text-gray-500">RM{item.subtotal?.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">RM{order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>

      {/* Print Receipt button */}
      {order.status !== 'CANCELLED' && (
        <div className="text-center mt-6">
          <button
            onClick={() => printReceipt(order)}
            className="bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition"
          >
            🖨️ Print Receipt
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">
        This page auto-refreshes every 15 seconds
      </p>
    </div>
  )
}

function printReceipt(order) {
  const receiptWindow = window.open('', '_blank', 'width=350,height=600')
  receiptWindow.document.write(`
    <html>
    <head><title>Receipt - Order #${order.orderId}</title>
    <style>
      body { font-family: monospace; font-size: 12px; padding: 10px; max-width: 300px; margin: 0 auto; }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      .line { border-top: 1px dashed #000; margin: 8px 0; }
      .item { display: flex; justify-content: space-between; margin: 4px 0; }
      .total { font-size: 14px; font-weight: bold; }
    </style>
    </head>
    <body>
      <div class="center bold" style="font-size:16px;">FOOKWAY</div>
      <div class="center">Order Receipt</div>
      <div class="line"></div>
      <div>Order #: ${order.orderId}</div>
      <div>Table #: ${order.tableNumber}</div>
      <div>Date: ${new Date(order.createdAt).toLocaleString()}</div>
      <div class="line"></div>
      ${order.items.map(item => `
        <div class="item">
          <span>${item.quantity}x ${item.itemName}</span>
          <span>RM${item.subtotal?.toFixed(2)}</span>
        </div>
      `).join('')}
      <div class="line"></div>
      <div class="item total">
        <span>TOTAL</span>
        <span>RM${order.totalAmount?.toFixed(2)}</span>
      </div>
      <div class="line"></div>
      ${order.customerNote ? `<div>Note: ${order.customerNote}</div><div class="line"></div>` : ''}
      <div class="center" style="margin-top:10px;">Thank you for dining with us!</div>
      <div class="center">--- Fookway ---</div>
      <script>window.print();</script>
    </body>
    </html>
  `)
  receiptWindow.document.close()
}
