import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5175,
    open: true,
    cors: true,
    allowedHosts: [
      '4238d6cb.r35.cpolar.top',
      'c2e5d9c.r35.cpolar.top'
    ],
    hmr: {
      host: 'localhost'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
