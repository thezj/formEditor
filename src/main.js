import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router'
// 优化chrome 事件 Passive Event Listeners
import 'default-passive-events'

let ccApp = createApp(App)
ccApp.use(router)
ccApp.mount('#app')
window.ccApp = ccApp
