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
            { src: 'style.css', dest: '.' },
            { src: 'menu.js', dest: '.' },
            { src: 'logo.png', dest: '.' },
            { src: 'minha-foto.jpeg', dest: '.' },
            { src: 'supabase.js', dest: '.' },
            { src: 'auth.js', dest: '.' }
          ]
        })
      ],
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            sobre: path.resolve(__dirname, 'sobre/index.html'),
            servicos: path.resolve(__dirname, 'servicos/index.html'),
            blog: path.resolve(__dirname, 'blog/index.html'),
            lgpd: path.resolve(__dirname, 'lgpd/index.html'),
            login: path.resolve(__dirname, 'servicos/area_do_cliente/index.html'),
            cadastro: path.resolve(__dirname, 'servicos/area_do_cliente/cadastro.html'),
            dashboard: path.resolve(__dirname, 'servicos/area_do_cliente/dashboard.html'),
            compra: path.resolve(__dirname, 'servicos/compra/index.html')
          }
        }
      }
    };
});
