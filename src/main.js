import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import lazy from "./hook/useLazy.js";

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(lazy)
app.mount('#app')

