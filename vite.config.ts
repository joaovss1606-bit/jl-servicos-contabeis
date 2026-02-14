import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        viteStaticCopy({
          targets: [
            { src: 'servicos/**/*', dest: 'servicos' },
            { src: 'blog/**/*', dest: 'blog' },
            { src: 'sobre/**/*', dest: 'sobre' },
            { src: 'lgpd/**/*', dest: 'lgpd' },
            { src: 'views/**/*', dest: 'views' },
            { src: 'components/**/*', dest: 'components' },
            { src: 'login.html', dest: '.' },
            { src: 'style.css', dest: '.' },
            { src: 'menu.js', dest: '.' },
            { src: 'logo.png', dest: '.' },
            { src: 'minha-foto.jpeg', dest: '.' },
            { src: 'supabase.js', dest: '.' },
            { src: 'auth.js', dest: '.' },
            { src: 'constants.ts', dest: '.' },
            { src: 'types.ts', dest: '.' },
            { src: 'metadata.json', dest: '.' }
          ]
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            login: path.resolve(__dirname, 'login.html')
          }
        }
      }
    };
});
