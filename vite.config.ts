import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/Future-Pulse/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_DEEPSEEK_API_KEY': JSON.stringify(env.VITE_DEEPSEEK_API_KEY),
      'process.env.VITE_USE_SERVER_API': JSON.stringify(env.VITE_USE_SERVER_API),
      'process.env.VITE_PUBLIC_MODE': JSON.stringify(env.VITE_PUBLIC_MODE || ''),
      'process.env.VITE_WORKER_URL': JSON.stringify(env.VITE_WORKER_URL || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Keep file watching stable during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
