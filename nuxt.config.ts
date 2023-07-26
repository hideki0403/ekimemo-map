import vuetify from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: {
    enabled: true
  },
  css: [
    'vuetify/lib/styles/main.sass'
  ],
  build: {
    transpile: [
      'vuetify'
    ]
  },
  modules: [
    async (_, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        config.plugins?.push(vuetify())
      })
    }
  ]
})
