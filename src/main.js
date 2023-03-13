// 添加gridStack css
import 'gridstack/dist/gridstack.min.css';
// 这个库会在桌面端自动将 mouse 事件转换成对应的 touch 事件，使得组件能够在桌面端使用
import '@vant/touch-emulator';


// 初始化vue
import { createApp } from 'vue'
import './style.less'
import App from "./App.vue"
import router from "./router"
import store from './store'

const ccApp = createApp(App)
ccApp.use(router)
ccApp.use(store)

// 全局工具类
import { httpService } from './services/httpService'
ccApp.config.globalProperties.$service = httpService;
import moment from 'moment'
ccApp.config.globalProperties.moment = moment;



// 引入fontawesome图标
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsUpDownLeftRight,faLink,  faAnglesUp, faBoxOpen, faAnglesDown,faRulerCombined, faExpandArrowsAlt, faExpand, faCrosshairs, faExpandAlt, faPlus, faLayerGroup, faAlignLeft, faFileLines, faTerminal, faPlusCircle, faCubes, faInbox, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
let addIcons = [faArrowsUpDownLeftRight,faLink,faAnglesUp, faBoxOpen, faAnglesDown,faRulerCombined, faExpand, faCrosshairs, faExpandArrowsAlt, faExpandAlt, faPlus, faLayerGroup, faAlignLeft, faFileLines, faTerminal, faPlusCircle, faCubes, faInbox, faTrashAlt]
addIcons.forEach(icon => library.add(icon))
ccApp.component('font-awesome-icon', FontAwesomeIcon)

// 引入antDesign
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
ccApp.use(Antd)
import { CodeOutlined, SyncOutlined } from '@ant-design/icons-vue';
ccApp.component('CodeOutlined', CodeOutlined)
ccApp.component('SyncOutlined', SyncOutlined)


// 组件库引用
import { componentregister } from "./utils/signupComponent";
componentregister(ccApp)

// 启动app
ccApp.mount('#app')
window.ccApp = ccApp
