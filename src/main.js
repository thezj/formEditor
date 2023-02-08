
// 添加图标库
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
document.head.appendChild(script);


/**
 * 初始化vue
 */
import { createApp } from 'vue'
import './style.less'
import router from './router'
let ccApp = createApp({ template: '<router-view></router-view>' })
ccApp.use(router)

/**
 * 注册组件
 */

//这个库会在桌面端自动将 mouse 事件转换成对应的 touch 事件，使得组件能够在桌面端使用
import '@vant/touch-emulator';

// 组件库引用
import ivanCheckbox from './ivanCheckbox.vue'
ccApp.component('ivanCheckbox', ivanCheckbox)
import ivanSearch from './ivanSearch.vue'
ccApp.component('ivanSearch', ivanSearch)

// ant design for vue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
ccApp.use(Antd)
import { CodeOutlined } from '@ant-design/icons-vue';
ccApp.component('CodeOutlined', CodeOutlined)

//启动app
ccApp.mount('#app')
window.ccApp = ccApp
