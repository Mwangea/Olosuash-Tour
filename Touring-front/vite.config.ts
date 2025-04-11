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
        target: 'https://api.olosuashi.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, '/uploads')
      },
      '/api': {
        target: 'https://api.olosuashi.com/',
        changeOrigin: true
      }
    }
  }
})