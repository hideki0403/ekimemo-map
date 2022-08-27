import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pages from 'vite-plugin-pages'
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pages(),
    tsconfigPaths()
  ],
  server: {
    host: '0.0.0.0',
    port: 443,
    https: {
      key: fs.readFileSync('./cert/cert-key.pem'),
      cert: fs.readFileSync('./cert/cert.pem')
    }
  }
})
