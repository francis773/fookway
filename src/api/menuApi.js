import api from './axiosInstance'

export const getMenu = (category) => {
  const params = category ? { category } : {}
  return api.get('/menu', { params })
}

export const getMenuItem = (id) => api.get(`/menu/${id}`)

export const getCategories = () => api.get('/menu/categories')

// Admin
export const getAllMenuItems = () => api.get('/admin/menu')
export const createMenuItem = (data) => api.post('/admin/menu', data)
export const updateMenuItem = (id, data) => api.put(`/admin/menu/${id}`, data)
export const deleteMenuItem = (id) => api.delete(`/admin/menu/${id}`)
export const toggleAvailability = (id) => api.patch(`/admin/menu/${id}/toggle`)
