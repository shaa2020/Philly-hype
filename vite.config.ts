import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: process.env.DISABLE_HMR !== 'true',
        },
        manifest: {
          name: 'PHILLY HYPE',
          short_name: 'PhillyHype',
          description: 'The best Philly Cheesesteaks & Smash Burgers in town.',
          theme_color: '#FF6B00',
          background_color: '#0a0a0a',
          display: 'standalone',
          icons: [
            {
              src: 'https://images.unsplash.com/photo-1614548483848-18e310034a2e?q=80&w=192&h=192&auto=format&fit=crop',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://images.unsplash.com/photo-1614548483848-18e310034a2e?q=80&w=512&h=512&auto=format&fit=crop',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
