import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-secondary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          🍽️ Fookway
        </Link>

        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Link to="/cart" className="relative hover:text-accent transition">
                🛒
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link to="/login" className="text-sm hover:text-accent transition">
                Staff Login
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <>
              <Link to="/admin" className="text-sm hover:text-accent transition">Dashboard</Link>
              <Link to="/admin/menu" className="text-sm hover:text-accent transition">Menu</Link>
              <Link to="/admin/orders" className="text-sm hover:text-accent transition">Orders</Link>
              <Link to="/kitchen" className="text-sm hover:text-accent transition">Kitchen</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'KITCHEN' && (
            <Link to="/kitchen" className="text-sm hover:text-accent transition">Kitchen</Link>
          )}

          {isAuthenticated && (
            <button onClick={handleLogout} className="text-sm bg-primary px-3 py-1 rounded hover:bg-red-700 transition">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
