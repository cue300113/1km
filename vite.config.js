import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 允许外部访问
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '3048bbf4.r8.vip.cpolar.cn',
      '.cpolar.cn' // 允许所有cpolar.cn子域名
    ],
    proxy: {
      '/api': {
        target: 'http://101.201.52.163:8081',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://101.201.52.163:8081',
        changeOrigin: true,
        ws: true, // 支持WebSocket代理
      },
    },
  },
})
