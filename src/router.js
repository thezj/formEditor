import { createWebHistory, createRouter } from "vue-router";
import canvas from "@/App.vue";
import render from "@/Render.vue";
import nestPage from "@/nestPage.vue";

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
    },
    {
        path: "/nestPage",
        name: "nestPage",
        component: nestPage,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;