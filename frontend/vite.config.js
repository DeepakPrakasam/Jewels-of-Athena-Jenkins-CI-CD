import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Load env manually so it's available even in vite.config.js
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://backend-container:4000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
