import { createWebHistory, createRouter } from "vue-router";
import render from "@/App.vue";

const routes = [
    {
        path: "/",
        name: "render",
        component: render,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;