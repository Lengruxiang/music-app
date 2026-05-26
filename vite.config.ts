import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import http from 'node:http'
import https from 'node:https'

function audioProxy(): Plugin {
  return {
    name: 'audio-proxy',
    configureServer(server) {
      server.middlewares.use('/audio-proxy', (req, res) => {
        const reqUrl = new URL(req.url!, `http://${req.headers.host}`)
        const targetUrl = reqUrl.searchParams.get('url')

        if (!targetUrl) {
          res.statusCode = 400
          res.end('Missing url parameter')
          return
        }

        // Validate URL to prevent SSRF
        let parsed: URL
        try {
          parsed = new URL(targetUrl)
        } catch {
          res.statusCode = 400
          res.end('Invalid url')
          return
        }

        if (!parsed.hostname?.endsWith('.music.126.net') && !parsed.hostname?.endsWith('.music.163.com')) {
          res.statusCode = 403
          res.end('Forbidden')
          return
        }

        const client = parsed.protocol === 'https:' ? https : http

        const options: http.RequestOptions = {
          hostname: parsed.hostname,
          port: parsed.port,
          path: parsed.pathname + parsed.search,
          method: req.method,
          headers: {
            ...Object.fromEntries(
              Object.entries(req.headers as Record<string, string | string[]>)
                .filter(([k]) => !['host', 'referer', 'origin'].includes(k))
            ),
            Referer: 'https://music.163.com/',
          },
        }

        const proxyReq = client.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
          proxyRes.pipe(res)
        })

        proxyReq.on('error', (err) => {
          console.error('Audio proxy error:', err.message)
          if (!res.headersSent) {
            res.statusCode = 502
            res.end('Proxy error')
          }
        })

        proxyReq.end()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), audioProxy()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
