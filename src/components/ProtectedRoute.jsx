import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">403 — Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
      </div>
    )
  }

  return children
}
