import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src'), '@data': path.resolve(__dirname, '../../data') } },
  server: { port: 5173, fs: { allow: ['../..'] }, proxy: { '/api': 'http://localhost:8787' } },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], motion: ['framer-motion'], gsap: ['gsap'] } },
    },
  },
});
