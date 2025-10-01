import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // 明确指定端口为5173
    host: '0.0.0.0', // 允许外部访问
    allowedHosts: [
      '101.201.52.163',
      'localhost',
      '127.0.0.1',
      '3048bbf4.r8.vip.cpolar.cn',
      '.cpolar.cn' // 允许所有cpolar.cn子域名
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8081',  // 开发环境代理到本地后端
        changeOrigin: true,
        rewrite: (path) => path  // 保持/api路径不变
      },
      '/chat-websocket': {
        target: 'http://localhost:8081',  // 开发环境代理到本地后端
        changeOrigin: true,
        ws: true, // 支持WebSocket代理
        rewrite: (path) => path.replace(/^\/chat-websocket/, '/chat')
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保构建后的资源路径正确
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
