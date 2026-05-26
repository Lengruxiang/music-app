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

// Simple cache: URL → { data, timestamp }
const cache = new Map<string, { data: any; ts: number }>()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

const client = {
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    const cacheKey = url

    // Return cached data if fresh
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      // Refresh in background
      instance.get(url, config).then((data) => {
        cache.set(cacheKey, { data, ts: Date.now() })
      }).catch(() => {})
      return cached.data as T
    }

    // Fetch fresh data
    const data = await instance.get(url, config)
    cache.set(cacheKey, { data, ts: Date.now() })
    return data as T
  },
}

export default client
