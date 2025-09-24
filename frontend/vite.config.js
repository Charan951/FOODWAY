import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['react-icons', 'react-spinners'],
          charts: ['recharts'],
          maps: ['leaflet', 'react-leaflet'],
          firebase: ['firebase'],
          http: ['axios', 'socket.io-client']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  base: '/',
  define: {
    global: 'globalThis',
  },
})
