import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': JSON.stringify({ NODE_ENV: 'production' }),
  },
  resolve: {
    alias: {
      // Polyfill Node.js built-ins used by simple-peer
      events: 'events',
      util: 'util',
      buffer: 'buffer',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['simple-peer', 'buffer', 'events', 'util'],
  },
});
