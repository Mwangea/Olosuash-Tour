import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/uploads': {
        target: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/' : 'https://api.olosuashi.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, '/uploads')
      },
      '/api': {
        target: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/' : 'https://api.olosuashi.com/',
        changeOrigin: true
      }
    }
  }
})