import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor':  ['three', '@react-three/fiber', '@react-three/drei'],
          'gsap-vendor':   ['gsap'],
          'framer-vendor': ['framer-motion'],
          'map-vendor':    ['react-simple-maps'],
          'router-vendor': ['react-router-dom'],
          'date-vendor':   ['date-fns'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion', 'gsap'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
  },
})
