import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API Error:', err.message)
    return Promise.reject(err)
  }
)

export default client
