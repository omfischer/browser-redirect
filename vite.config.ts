import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackStart(), nitro(), react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    allowedHosts: ['monocarpous-gratifyingly-taunya.ngrok-free.dev'],
  },
})
