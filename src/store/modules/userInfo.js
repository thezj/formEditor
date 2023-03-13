import { defineStore } from "pinia";

export default defineStore({
    id: 'useUserInfo',
    state: () => ({
        data: {}
    }),
    persist: {
        storage: sessionStorage,   // 将数据持久化到的 storage 中
    }
})