import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false, // Автоматически найдет свободный порт, если 5173 занят
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // Перезаписывает домен cookies, чтобы они работали с прокси
        cookieDomainRewrite: '',
        // Сохраняет оригинальный путь cookies
        cookiePathRewrite: '/',
        // Передает cookies из запроса клиента
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Передаем все cookies из запроса клиента в проксируемый запрос
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie);
            }
          });
          // Передаем cookies из ответа прокси в ответ клиенту
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const setCookieHeaders = proxyRes.headers['set-cookie'];
            if (setCookieHeaders) {
              // Перезаписываем домен cookies для работы с прокси
              proxyRes.headers['set-cookie'] = setCookieHeaders.map(cookie =>
                cookie.replace(/Domain=[^;]+/gi, 'Domain=')
              );
            }
          });
        },
      },
    },
  },
});
