import { createPinia } from "pinia";
import { demoStore } from "./modules/demo";

// 数据持久化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { demoStore }
export default pinia