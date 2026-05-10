import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    // Force browser-specific builds for engine.io-client
    conditions: ['browser', 'module', 'import', 'default'],
    alias: [
      // Remap Node.js-only engine.io-client files to their browser equivalents
      {
        find: /^engine\.io-client\/build\/esm\/globals\.node\.js$/,
        replacement: path.resolve('./node_modules/engine.io-client/build/esm/globals.js'),
      },
      {
        find: /^.*\/engine\.io-client\/build\/esm\/globals\.node\.js$/,
        replacement: path.resolve('./node_modules/engine.io-client/build/esm/globals.js'),
      },
      {
        find: /^.*\/globals\.node\.js$/,
        replacement: path.resolve('./node_modules/engine.io-client/build/esm/globals.js'),
      },
      {
        find: /^.*\/polling-xhr\.node\.js$/,
        replacement: path.resolve('./node_modules/engine.io-client/build/esm/transports/polling-xhr.js'),
      },
      {
        find: /^.*\/websocket\.node\.js$/,
        replacement: path.resolve('./node_modules/engine.io-client/build/esm/transports/websocket.js'),
      },
      // Standard Node.js polyfills
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
    exclude: ['socket.io-client', 'engine.io-client'],
  },
});
