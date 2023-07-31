// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src',
  devtools: {
    enabled: true
  },
  css: [
    '@/styles/main.scss',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt',
  ],
  vite: {
    build: {
      target: 'esnext',
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,
    manifest: {
      name: '駅サーチ',
      short_name: '駅サーチ',
      description: '近くにある駅一覧を確認できるWebアプリ',
      lang: 'ja',
    },
    workbox: {
      navigateFallback: '/',
      importScripts: ['static/sw.js']
    },
  },
  googleFonts: {
    families: {
      'Noto+Sans+JP': true,
    },
    display: 'swap',
    inject: true,
  },
  devServer: {
    port: 3001
  }
})
