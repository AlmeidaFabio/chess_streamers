import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/chess_streamers/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/chess': {
        target: 'https://api.chess.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chess/, '/pub'),
        headers: {
          Accept: 'application/json',
          'User-Agent': 'ChessStreamers/1.0 (local-dev)',
        },
      },
    },
  },
})
