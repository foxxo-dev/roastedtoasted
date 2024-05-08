import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        choose: resolve(__dirname, 'choose/index.html'),
        chat: resolve(__dirname, 'chat/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        404: resolve(__dirname, '404/index.html'),
      },
    },
    // Output to the root 'dist' directory
    outDir: resolve(__dirname, 'dist'),
  },
});
