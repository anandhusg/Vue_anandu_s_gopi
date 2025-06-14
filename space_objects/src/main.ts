import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueVirtualScroller from 'vue3-virtual-scroller'
const vuetify = createVuetify({
    components,
    directives,
     theme: { 
    defaultTheme: 'dark'
  } 
})
const app = createApp(App)
app.use(createPinia())
app.use(VueVirtualScroller)
app.use(router)
app.use(vuetify)
app.mount('#app')
