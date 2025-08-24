// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // Optional: change dev server port
    open: true,        // Automatically open browser
  },
  build: {
    outDir: 'dist',    // Output folder for production build
  },
  resolve: {
    alias: {
      '@': '/src',     // Optional: shortcut to src folder
    },
  },
});