import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(createVuetify({
        blueprint: md3
    }))
})