import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: './admin',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5001,
    strictPort: true,
  },
  build: {
    outDir: '../dist-admin',
    emptyOutDir: true,
  },
  publicDir: '../public',
})
