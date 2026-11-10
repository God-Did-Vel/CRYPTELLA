import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            // Silently handle proxy connection errors when backend is offline or restarting
            // so the Vite terminal stays clean and doesn't dump ECONNREFUSED stack traces
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(
                JSON.stringify({
                  success: false,
                  message: 'Backend server is not running or unreachable on port 5000.',
                  code: 'ECONNREFUSED',
                })
              )
            }
          })
        },
      },
    },
  },
})
