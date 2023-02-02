
// 添加图标库
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
document.head.appendChild(script);


import { createApp } from 'vue'
import './style.less'
import router from './router'

let ccApp = createApp({ template: '<router-view></router-view>' })

// 注册组件
import ivanCheckbox from './ivanCheckbox.vue'
ccApp.component('ivanCheckbox', ivanCheckbox)
import ivanSearch from './ivanSearch.vue'
ccApp.component('ivanSearch', ivanSearch)

ccApp.use(router)
ccApp.mount('#app')
window.ccApp = ccApp
