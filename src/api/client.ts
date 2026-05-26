import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API Error:', err.message)
    return Promise.reject(err)
  }
)

const client = {
  get: <T = any>(url: string, config?: any): Promise<T> => instance.get(url, config) as any,
}

export default client
