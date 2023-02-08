import { createWebHistory, createRouter } from "vue-router";
import canvas from "@/App.vue";
import render from "@/Render.vue";

const routes = [
    {
        path: "/",
        name: "canvas",
        component: canvas,
    },
    {
        path: "/render",
        name: "render",
        component: render,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;