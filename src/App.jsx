import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomerMenu from './pages/CustomerMenu'
import Cart from './pages/Cart'
import OrderStatus from './pages/OrderStatus'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminMenu from './pages/AdminMenu'
import AdminOrders from './pages/AdminOrders'
import KitchenDisplay from './pages/KitchenDisplay'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          {/* Public customer routes */}
          <Route path="/menu" element={<CustomerMenu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/:id" element={<OrderStatus />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute roles={['ADMIN']}><AdminMenu /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['ADMIN']}><AdminOrders /></ProtectedRoute>} />

          {/* Kitchen routes */}
          <Route path="/kitchen" element={<ProtectedRoute roles={['KITCHEN', 'ADMIN']}><KitchenDisplay /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<CustomerMenu />} />
        </Routes>
      </main>
    </div>
  )
}
