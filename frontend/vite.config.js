import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      url: 'url/' // Giúp Vite hiểu "url" khi một package Node yêu cầu nó
    }
  }
});
