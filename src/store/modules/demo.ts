import { defineStore } from "pinia";

interface demoState {
    name?: string
}

export const demoStore = defineStore('demo', {
    state: (): demoState => ({
        name: 'demo'
    }),
    // persist: true,   // 是否持久化存储
    persist: {
        storage: sessionStorage,   // 将数据持久化到的 storage 中
    },
    getters: {
        getName: (state) => {
            return state.name
        },
        // or
        otherToGetName(): string | undefined {
            return this.name
        }
    },
    actions: {
        setName(name: string) {
            this.name = name
        }
        // 可以异步
        // ...
    }
})