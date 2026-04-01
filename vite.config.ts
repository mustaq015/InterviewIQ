import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@monaco-editor')) {
              return 'monaco';
            }
            if (id.includes('@dnd-kit')) {
              return 'dnd';
            }
            if (id.includes('katex')) {
              return 'katex';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'markdown';
            }
            if (id.includes('zustand') || id.includes('zustand/')) {
              return 'zustand';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
