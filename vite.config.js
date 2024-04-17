import { resolve } from 'path';
import pkg from 'fs-extra';
const { copy } = pkg;
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        choose: resolve(__dirname, 'choose/index.html'),
        404: resolve(__dirname, '404/index.html'),
      },
    },
    // Output to the root 'dist' directory
    outDir: resolve(__dirname, 'dist'),
  },
});
