/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactRouter } from '@react-router/dev/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
