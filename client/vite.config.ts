import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envDir: '..', // load .env from v2/ root
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': `http://localhost:${process.env.PORT ?? 3001}`,
      '/socket.io': {
        target: `http://localhost:${process.env.PORT ?? 3001}`,
        ws: true,
      },
    },
  },
});
