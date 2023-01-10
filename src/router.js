import { createWebHistory, createRouter } from "vue-router";
import render from "@/App.vue";
import editor from "@/editor.vue";

const routes = [
    {
        path: "/sss",
        name: "render",
        component: render,
    },
    {
        path: "/editor",
        name: "editor",
        component: editor,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;