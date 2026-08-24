import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  css: [fileURLToPath(new URL('./assets/css/main.css', import.meta.url))],
  vite: {
    plugins: [
      // We'll use standard Tailwind setup
    ]
  }
})