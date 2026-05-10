import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: [
      // Use the pre-built browser ESM bundle — bypasses engine.io-client node.js files entirely
      {
        find: 'socket.io-client',
        replacement: path.resolve('./node_modules/socket.io-client/dist/socket.io.esm.min.js'),
      },
      // Node.js polyfills for simple-peer
      { find: 'events', replacement: 'events' },
      { find: 'util', replacement: 'util' },
      { find: 'buffer', replacement: 'buffer' },
    ],
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
    exclude: ['socket.io-client'],
  },
});

