import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      port: 3001,
      clientPort: 3001
    }
  },
  define: {
    global: 'globalThis',
    // Fix timer compatibility issues in WebContainer
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.nextTick': 'globalThis.queueMicrotask',
    'process.hrtime': 'performance.now',
  },
  optimizeDeps: {
    exclude: ['fsevents'],
    include: ['react', 'react-dom', '@supabase/supabase-js']
  },
  esbuild: {
    target: 'es2020',
    // Fix timer and process compatibility
    define: {
      'process.nextTick': 'queueMicrotask',
      'process.hrtime': 'performance.now'
    }
  }
})