import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteBackendHmrPlugin from 'vite-plugin-backend-hmr';

const ASSET_URL = 'https://localhost:3009';

export default defineConfig({
  define: {
    global: {},
    'process.env': {
      SERVER_ENV: 'development'
    },
  },
  plugins: [
    react(),
    ViteBackendHmrPlugin({
      hmrFile: ['.php'],
      hmrDir: __dirname
    })
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.php'],
  },
  base: `${ASSET_URL}/dist/`,
  root: './',
  server: {
    strictPort: true,
    port: 3009,
    hmr: {
      host: 'localhost',
      port: 3009,
      protocol: 'ws',
    },
  },
  build: {
    manifest: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: './pages/index.tsx',
      },
    },
  },
});