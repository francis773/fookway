import api from './axiosInstance'

export const login = (username, password) =>
  api.post('/auth/login', { username, password })
