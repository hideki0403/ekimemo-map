// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: {
    enabled: true
  },
  css: [
    '@/styles/main.scss',
  ],
  modules: [
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          'Noto+Sans+JP': true,
        },
        display: 'swap',
        inject: true,
      }
    ],
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  devServer: {
    port: 3001
  }
})
