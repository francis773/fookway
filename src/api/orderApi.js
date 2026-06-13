import api from './axiosInstance'

export const placeOrder = (orderData) => api.post('/orders', orderData)
export const getOrderStatus = (id) => api.get(`/orders/${id}`)

// Admin
export const getAdminOrders = (status) => {
  const params = status ? { status } : {}
  return api.get('/admin/orders', { params })
}
export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status })
export const getDashboard = () => api.get('/admin/dashboard')

// Kitchen
export const getKitchenOrders = () => api.get('/kitchen/orders')
export const updateKitchenStatus = (id, status) =>
  api.put(`/kitchen/orders/${id}/status`, { status })
