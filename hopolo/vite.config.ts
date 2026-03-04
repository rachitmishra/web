/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactRouter } from '@react-router/dev/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    https: false,
    port: 5174,
    host: true,
  },
  plugins: [
    mode === 'test' ? react() : reactRouter(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/test/setup.ts',
  },
}))
