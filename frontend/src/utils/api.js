import axios from 'axios'

const getApiBaseUrl = () => {
  // 生产环境使用环境变量
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.railway.app/api'
  }
  // 开发环境使用本地后端
  return 'http://localhost:5000/api'
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // 生产环境错误处理
    if (import.meta.env.PROD) {
      console.error('API Error:', error)
    }
    
    return Promise.reject(error)
  }
)

export default api
