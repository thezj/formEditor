import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "manage",
        component: () => import("../views/manage.vue")
    },
    {
        path: "/canvas",
        name: "canvas",
        component: () => import("../views/canvas.vue")
    },
    {
        path: "/render",
        name: "render",
        component: () => import("../views/render.vue")
    },
    {
        path: "/nestPage",
        name: "nestPage",
        component: () => import("../views/nestPage.vue")
    },
    {
        path: "/test",
        name: "test",
        component: () => import("../components/vant/xApplicationItem.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router