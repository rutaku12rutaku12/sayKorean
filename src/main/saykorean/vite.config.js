import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // 강제 폴링
      interval: 1000,   // 1초마다 변경 감지
    },
    hmr: {
      overlay: true,    // 에러 발생 시 브라우저에 표시
    },
  },
})